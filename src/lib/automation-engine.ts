// Automation Engine for Follow-up Sequences
// Handles sequence processing, scheduling, and execution

import Sequence from '@/models/Sequence';
import Template from '@/models/Template';
import Communication from '@/models/Communication';
import Contact from '@/models/Contact';
import Property from '@/models/Property';
import { CommunicationService } from './communication-service';

export interface AutomationContext {
  sequenceId: string;
  contactId: string;
  stepNumber: number;
  variables: Record<string, any>;
}

export interface AutomationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  nextStep?: number;
  scheduledAt?: Date;
}

export class AutomationEngine {
  /**
   * Process a sequence step for a contact
   */
  static async processSequenceStep(
    sequenceId: string,
    contactId: string,
    stepNumber: number,
    variables: Record<string, any> = {}
  ): Promise<AutomationResult> {
    try {
      // Get sequence and validate
      const sequence = await Sequence.findById(sequenceId);
      if (!sequence || !sequence.isActive) {
        throw new Error('Sequence not found or inactive');
      }

      // Get contact
      const contact = await Contact.findById(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }

      // Find the step
      const step = sequence.steps.find((s: any) => s.stepNumber === stepNumber);
      if (!step || !step.isActive) {
        throw new Error('Step not found or inactive');
      }

      // Check if step should be executed based on conditions
      const shouldExecute = await this.evaluateStepConditions(sequence, contact, step, variables);
      if (!shouldExecute) {
        return {
          success: true,
          messageId: 'skipped',
          nextStep: this.getNextStepNumber(sequence, stepNumber)
        };
      }

      // Get template
      const template = await Template.findById(step.templateId);
      if (!template || !template.isActive) {
        throw new Error('Template not found or inactive');
      }

      // Prepare variables
      const finalVariables = {
        ...variables,
        contact_name: contact.name || '',
        contact_email: contact.email || '',
        contact_phone: contact.phone || '',
        ...this.extractPropertyVariables(sequence, variables)
      };

      // Send communication
      const result = await CommunicationService.sendWithTemplate(
        step.templateId,
        {
          email: contact.email,
          phone: contact.phone,
          name: contact.name
        },
        finalVariables,
        step.channel
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to send communication');
      }

      // Record communication
      await Communication.create({
        agentId: sequence.agentId,
        contactId,
        sequenceId,
        sequenceStepId: stepNumber.toString(),
        templateId: step.templateId,
        propertyId: sequence.trigger.propertyId,
        channel: step.channel,
        subject: step.channel === 'email' ? template.renderSubject(finalVariables) : undefined,
        content: template.render(finalVariables),
        renderedContent: template.render(finalVariables),
        recipient: {
          email: contact.email,
          phone: contact.phone,
          name: contact.name
        },
        status: 'sent',
        provider: {
          name: result.provider,
          messageId: result.messageId,
          cost: result.cost
        },
        sentAt: new Date(),
        campaign: {
          name: sequence.name,
          source: 'sequence'
        }
      });

      // Calculate next step
      const nextStepNumber = this.getNextStepNumber(sequence, stepNumber);

      return {
        success: true,
        messageId: result.messageId,
        nextStep: nextStepNumber,
        scheduledAt: nextStepNumber ? this.calculateNextStepTime(sequence, nextStepNumber) : undefined
      };

    } catch (error) {
      console.error('Sequence processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown automation error'
      };
    }
  }

  /**
   * Start a sequence for a contact
   */
  static async startSequenceForContact(
    sequenceId: string,
    contactId: string,
    variables: Record<string, any> = {}
  ): Promise<AutomationResult> {
    return this.processSequenceStep(sequenceId, contactId, 1, variables);
  }

  /**
   * Process pending sequence steps (called by cron job)
   */
  static async processPendingSteps(): Promise<{ processed: number; errors: number }> {
    try {
      const now = new Date();

      // Find sequences with pending communications
      const pendingCommunications = await Communication.find({
        status: 'pending',
        scheduledAt: { $lte: now }
      }).populate('sequenceId');

      let processed = 0;
      let errors = 0;

      for (const comm of pendingCommunications) {
        try {
          // Check business hours
          if (!this.isWithinBusinessHours(comm.sequenceId)) {
            continue; // Skip until business hours
          }

          // Process the step
          const result = await this.processSequenceStep(
            comm.sequenceId._id,
            comm.contactId,
            parseInt(comm.sequenceStepId),
            {} // TODO: Extract variables from communication
          );

          if (result.success) {
            // Update communication status
            await Communication.findByIdAndUpdate(comm._id, {
              status: 'sent',
              sentAt: new Date(),
              provider: {
                messageId: result.messageId
              }
            });

            // Schedule next step if applicable
            if (result.nextStep && result.scheduledAt) {
              await this.scheduleNextStep(
                comm.sequenceId._id,
                comm.contactId,
                result.nextStep,
                result.scheduledAt
              );
            }

            processed++;
          } else {
            // Mark as failed
            await Communication.findByIdAndUpdate(comm._id, {
              status: 'failed',
              error: {
                message: result.error
              }
            });
            errors++;
          }

        } catch (error) {
          console.error(`Error processing communication ${comm._id}:`, error);
          errors++;
        }
      }

      return { processed, errors };

    } catch (error) {
      console.error('Error processing pending steps:', error);
      return { processed: 0, errors: 1 };
    }
  }

  /**
   * Get contacts that match sequence targeting criteria
   */
  static async getTargetContacts(sequenceId: string): Promise<string[]> {
    try {
      const sequence = await Sequence.findById(sequenceId);
      if (!sequence) return [];

      const query: any = {
        agentId: sequence.agentId
      };

      // Apply targeting filters
      const { targetAudience } = sequence;

      if (targetAudience.tags && targetAudience.tags.length > 0) {
        query.tags = { $in: targetAudience.tags };
      }

      if (targetAudience.locations && targetAudience.locations.length > 0) {
        // This would need to be implemented based on your contact schema
        // query.location = { $in: targetAudience.locations };
      }

      const contacts = await Contact.find(query).select('_id');
      return contacts.map(c => c._id.toString());

    } catch (error) {
      console.error('Error getting target contacts:', error);
      return [];
    }
  }

  /**
   * Schedule next step for a contact
   */
  private static async scheduleNextStep(
    sequenceId: string,
    contactId: string,
    stepNumber: number,
    scheduledAt: Date
  ): Promise<void> {
    try {
      const sequence = await Sequence.findById(sequenceId);
      if (!sequence) return;

      const step = sequence.steps.find((s: any) => s.stepNumber === stepNumber);
      if (!step) return;

      // Create pending communication record
      await Communication.create({
        agentId: sequence.agentId,
        contactId,
        sequenceId,
        sequenceStepId: stepNumber.toString(),
        templateId: step.templateId,
        channel: step.channel,
        status: 'pending',
        scheduledAt,
        campaign: {
          name: sequence.name,
          source: 'sequence'
        }
      });

    } catch (error) {
      console.error('Error scheduling next step:', error);
    }
  }

  /**
   * Evaluate step conditions
   */
  private static async evaluateStepConditions(
    sequence: any,
    contact: any,
    step: any,
    variables: Record<string, any>
  ): Promise<boolean> {
    // Check response received condition
    if (step.conditions.responseReceived) {
      const hasResponded = await Communication.findOne({
        sequenceId: sequence._id,
        contactId: contact._id,
        status: 'responded'
      });
      if (!hasResponded) return false;
    }

    // Check open rate condition
    if (step.conditions.openRate) {
      // TODO: Implement open rate checking
      // This would require tracking email opens
    }

    // Check click rate condition
    if (step.conditions.clickRate) {
      // TODO: Implement click rate checking
      // This would require tracking email clicks
    }

    return true;
  }

  /**
   * Calculate when the next step should be executed
   */
  private static calculateNextStepTime(sequence: any, stepNumber: number): Date | undefined {
    const step = sequence.steps.find((s: any) => s.stepNumber === stepNumber);
    if (!step) return undefined;

    const now = new Date();
    const delayMs = (step.delayDays * 24 * 60 * 60 * 1000) +
                   (step.delayHours * 60 * 60 * 1000) +
                   (step.delayMinutes * 60 * 1000);

    const scheduledTime = new Date(now.getTime() + delayMs);

    // Adjust for business hours if enabled
    if (sequence.settings.respectDoNotDisturb) {
      return this.adjustForBusinessHours(scheduledTime, sequence.settings);
    }

    return scheduledTime;
  }

  /**
   * Adjust time to fit within business hours
   */
  private static adjustForBusinessHours(time: Date, settings: any): Date {
    const { businessHours } = settings;

    // If no business hours defined, return original time
    if (!businessHours) return time;

    const dayOfWeek = time.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if current day is a business day
    if (!businessHours.daysOfWeek.includes(dayOfWeek)) {
      // Find next business day
      const nextBusinessDay = this.findNextBusinessDay(time, businessHours.daysOfWeek);
      time.setDate(time.getDate() + nextBusinessDay);
      time.setHours(parseInt(businessHours.start.split(':')[0]));
      time.setMinutes(parseInt(businessHours.start.split(':')[1]));
      return time;
    }

    const [startHour, startMinute] = businessHours.start.split(':').map(Number);
    const [endHour, endMinute] = businessHours.end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const currentTime = time.getHours() * 60 + time.getMinutes();

    if (currentTime < startTime) {
      // Before business hours - schedule for start time
      time.setHours(startHour, startMinute, 0, 0);
    } else if (currentTime > endTime) {
      // After business hours - schedule for next business day
      const nextBusinessDay = this.findNextBusinessDay(time, businessHours.daysOfWeek);
      time.setDate(time.getDate() + nextBusinessDay);
      time.setHours(startHour, startMinute, 0, 0);
    }

    return time;
  }

  /**
   * Find days until next business day
   */
  private static findNextBusinessDay(currentDate: Date, businessDays: number[]): number {
    let days = 1;
    let checkDate = new Date(currentDate);

    while (days <= 7) {
      checkDate.setDate(currentDate.getDate() + days);
      if (businessDays.includes(checkDate.getDay())) {
        return days;
      }
      days++;
    }

    return 1; // Default to tomorrow if no business days found
  }

  /**
   * Check if current time is within business hours
   */
  private static isWithinBusinessHours(sequence: any): boolean {
    if (!sequence.settings.respectDoNotDisturb) return true;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const { businessHours } = sequence.settings;

    if (!businessHours || !businessHours.daysOfWeek.includes(dayOfWeek)) {
      return false;
    }

    const [startHour, startMinute] = businessHours.start.split(':').map(Number);
    const [endHour, endMinute] = businessHours.end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Get next step number in sequence
   */
  private static getNextStepNumber(sequence: any, currentStep: number): number | undefined {
    const nextStep = sequence.steps.find((s: any) => s.stepNumber === currentStep + 1);
    return nextStep ? nextStep.stepNumber : undefined;
  }

  /**
   * Extract property-related variables
   */
  private static extractPropertyVariables(sequence: any, variables: Record<string, any>): Record<string, any> {
    const propertyVars: Record<string, any> = {};

    if (variables.property) {
      const property = variables.property;
      propertyVars.property_address = property.location?.address || '';
      propertyVars.property_price = property.price ? `R ${property.price.toLocaleString()}` : '';
      propertyVars.property_bedrooms = property.bedrooms || '';
      propertyVars.property_bathrooms = property.bathrooms || '';
      propertyVars.property_type = property.propertyType || '';
    }

    return propertyVars;
  }

  /**
   * Get sequence statistics
   */
  static async getSequenceStats(sequenceId: string): Promise<any> {
    try {
      const stats = await Communication.aggregate([
        { $match: { sequenceId: sequenceId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalOpens: { $sum: '$openCount' },
            totalClicks: { $sum: '$clickCount' }
          }
        }
      ]);

      return stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = {
          count: stat.count,
          opens: stat.totalOpens,
          clicks: stat.totalClicks
        };
        return acc;
      }, {});

    } catch (error) {
      console.error('Error getting sequence stats:', error);
      return {};
    }
  }
}