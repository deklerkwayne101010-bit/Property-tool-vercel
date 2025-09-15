// Communication Service for Email and SMS
// Handles sending messages via SendGrid and Twilio

import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import Communication from '@/models/Communication';
import Template from '@/models/Template';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  templateId?: string;
  tracking?: boolean;
}

export interface SendSMSOptions {
  to: string;
  message: string;
  from?: string;
}

export interface CommunicationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  provider?: string;
}

export class CommunicationService {
  private static sendGridClient: any;
  private static twilioClient: any;
  private static nodemailerTransporter: any;

  /**
   * Initialize communication services
   */
  static initialize() {
    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.sendGridClient = sgMail;
    }

    // Initialize Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }

    // Initialize Nodemailer as fallback
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.nodemailerTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  /**
   * Send email using SendGrid or fallback to Nodemailer
   */
  static async sendEmail(options: SendEmailOptions): Promise<CommunicationResult> {
    try {
      const from = options.from || process.env.FROM_EMAIL || 'noreply@propertypro.com';
      const replyTo = options.replyTo || process.env.REPLY_TO_EMAIL || from;

      // Try SendGrid first
      if (this.sendGridClient) {
        const msg = {
          to: options.to,
          from: {
            email: from,
            name: process.env.FROM_NAME || 'PropertyPro'
          },
          replyTo: replyTo,
          subject: options.subject,
          html: options.html,
          text: options.text || this.stripHtml(options.html),
          trackingSettings: options.tracking !== false ? {
            clickTracking: { enable: true },
            openTracking: { enable: true }
          } : undefined,
          customArgs: {
            templateId: options.templateId
          }
        };

        const result = await this.sendGridClient.send(msg);

        return {
          success: true,
          messageId: result[0]?.headers?.['x-message-id'],
          provider: 'sendgrid',
          cost: 0.0001 // Approximate SendGrid cost per email
        };
      }

      // Fallback to Nodemailer
      if (this.nodemailerTransporter) {
        const mailOptions = {
          from: `"${process.env.FROM_NAME || 'PropertyPro'}" <${from}>`,
          to: options.to,
          replyTo: replyTo,
          subject: options.subject,
          html: options.html,
          text: options.text || this.stripHtml(options.html)
        };

        const result = await this.nodemailerTransporter.sendMail(mailOptions);

        return {
          success: true,
          messageId: result.messageId,
          provider: 'nodemailer'
        };
      }

      throw new Error('No email service configured');

    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      };
    }
  }

  /**
   * Send SMS using Twilio
   */
  static async sendSMS(options: SendSMSOptions): Promise<CommunicationResult> {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio not configured');
      }

      const from = options.from || process.env.TWILIO_PHONE_NUMBER;
      if (!from) {
        throw new Error('No sender phone number configured');
      }

      // Format phone number (ensure international format)
      const to = this.formatPhoneNumber(options.to);

      const message = await this.twilioClient.messages.create({
        body: options.message,
        from: from,
        to: to
      });

      return {
        success: true,
        messageId: message.sid,
        provider: 'twilio',
        cost: parseFloat(message.price || '0.01') // Twilio SMS cost
      };

    } catch (error) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMS error'
      };
    }
  }

  /**
   * Send WhatsApp message (placeholder for future WhatsApp Business API integration)
   */
  static async sendWhatsApp(options: SendSMSOptions): Promise<CommunicationResult> {
    // For now, fall back to SMS
    console.warn('WhatsApp not fully implemented, falling back to SMS');
    return this.sendSMS(options);
  }

  /**
   * Send communication using template
   */
  static async sendWithTemplate(
    templateId: string,
    recipient: { email?: string; phone?: string; name?: string },
    variables: Record<string, any> = {},
    channel?: 'email' | 'sms' | 'whatsapp'
  ): Promise<CommunicationResult> {
    try {
      const template = await Template.findById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const actualChannel = channel || template.channel;
      const renderedContent = template.render(variables);

      if (actualChannel === 'email') {
        if (!recipient.email) {
          throw new Error('Email address required for email communication');
        }

        const subject = template.renderSubject(variables);
        return this.sendEmail({
          to: recipient.email,
          subject: subject,
          html: renderedContent,
          templateId: templateId
        });

      } else if (actualChannel === 'sms' || actualChannel === 'whatsapp') {
        if (!recipient.phone) {
          throw new Error('Phone number required for SMS/WhatsApp communication');
        }

        const message = this.truncateSMS(renderedContent);

        if (actualChannel === 'whatsapp') {
          return this.sendWhatsApp({
            to: recipient.phone,
            message: message
          });
        } else {
          return this.sendSMS({
            to: recipient.phone,
            message: message
          });
        }
      }

      throw new Error('Unsupported communication channel');

    } catch (error) {
      console.error('Template sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown template error'
      };
    }
  }

  /**
   * Format phone number to international format
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // If it starts with 0, replace with +27 (South Africa)
    if (cleaned.startsWith('0')) {
      return '+27' + cleaned.substring(1);
    }

    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }

    return cleaned;
  }

  /**
   * Strip HTML tags for text version
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Truncate message for SMS length limits
   */
  private static truncateSMS(message: string, maxLength: number = 160): string {
    if (message.length <= maxLength) {
      return message;
    }

    // Try to truncate at word boundary
    const truncated = message.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Validate email address
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  /**
   * Get service status
   */
  static getServiceStatus() {
    return {
      sendgrid: !!this.sendGridClient,
      twilio: !!this.twilioClient,
      nodemailer: !!this.nodemailerTransporter,
      whatsapp: false // Not implemented yet
    };
  }
}

// Initialize services
CommunicationService.initialize();