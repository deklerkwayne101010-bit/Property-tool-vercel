// Analytics Service for Follow-up Sequences and Communications
// Provides comprehensive analytics and reporting functionality

import Communication from '@/models/Communication';
import Sequence from '@/models/Sequence';
import Template from '@/models/Template';

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

export interface SequenceAnalytics {
  sequenceId: string;
  sequenceName: string;
  totalContacts: number;
  completedContacts: number;
  completionRate: number;
  averageStepsCompleted: number;
  totalMessages: number;
  deliveredMessages: number;
  openedMessages: number;
  clickedMessages: number;
  respondedMessages: number;
  bouncedMessages: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  totalCost: number;
  averageCostPerContact: number;
}

export interface ChannelAnalytics {
  channel: 'email' | 'sms' | 'whatsapp';
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  responded: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  bounceRate: number;
  totalCost: number;
  averageCost: number;
}

export interface TemplateAnalytics {
  templateId: string;
  templateName: string;
  channel: string;
  category: string;
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  responded: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  bounceRate: number;
  lastUsed: Date;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics for a specific sequence
   */
  static async getSequenceAnalytics(
    sequenceId: string,
    period?: AnalyticsPeriod
  ): Promise<SequenceAnalytics | null> {
    try {
      // Get sequence info
      const sequence = await Sequence.findById(sequenceId);
      if (!sequence) return null;

      // Build date filter
      const dateFilter: any = { sequenceId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      // Get communication stats
      const stats = await Communication.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            deliveredMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['delivered', 'opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            openedMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            clickedMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['clicked', 'responded']] }, 1, 0]
              }
            },
            respondedMessages: {
              $sum: {
                $cond: [{ $eq: ['$status', 'responded'] }, 1, 0]
              }
            },
            bouncedMessages: {
              $sum: {
                $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0]
              }
            },
            unsubscribed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'unsubscribed'] }, 1, 0]
              }
            },
            totalCost: { $sum: '$provider.cost' },
            uniqueContacts: { $addToSet: '$contactId' }
          }
        }
      ]);

      const statData = stats[0] || {
        totalMessages: 0,
        deliveredMessages: 0,
        openedMessages: 0,
        clickedMessages: 0,
        respondedMessages: 0,
        bouncedMessages: 0,
        unsubscribed: 0,
        totalCost: 0,
        uniqueContacts: []
      };

      // Calculate rates
      const deliveryRate = statData.totalMessages > 0 ? (statData.deliveredMessages / statData.totalMessages) * 100 : 0;
      const openRate = statData.deliveredMessages > 0 ? (statData.openedMessages / statData.deliveredMessages) * 100 : 0;
      const clickRate = statData.deliveredMessages > 0 ? (statData.clickedMessages / statData.deliveredMessages) * 100 : 0;
      const responseRate = statData.deliveredMessages > 0 ? (statData.respondedMessages / statData.deliveredMessages) * 100 : 0;
      const bounceRate = statData.totalMessages > 0 ? (statData.bouncedMessages / statData.totalMessages) * 100 : 0;
      const unsubscribeRate = statData.totalMessages > 0 ? (statData.unsubscribed / statData.totalMessages) * 100 : 0;

      // Get unique contacts count
      const totalContacts = statData.uniqueContacts.length;
      const completedContacts = await this.getCompletedContactsCount(sequenceId, period);
      const completionRate = totalContacts > 0 ? (completedContacts / totalContacts) * 100 : 0;
      const averageStepsCompleted = await this.getAverageStepsCompleted(sequenceId, period);

      return {
        sequenceId,
        sequenceName: sequence.name,
        totalContacts,
        completedContacts,
        completionRate,
        averageStepsCompleted,
        totalMessages: statData.totalMessages,
        deliveredMessages: statData.deliveredMessages,
        openedMessages: statData.openedMessages,
        clickedMessages: statData.clickedMessages,
        respondedMessages: statData.respondedMessages,
        bouncedMessages: statData.bouncedMessages,
        unsubscribed: statData.unsubscribed,
        deliveryRate,
        openRate,
        clickRate,
        responseRate,
        bounceRate,
        unsubscribeRate,
        totalCost: statData.totalCost,
        averageCostPerContact: totalContacts > 0 ? statData.totalCost / totalContacts : 0
      };

    } catch (error) {
      console.error('Error getting sequence analytics:', error);
      return null;
    }
  }

  /**
   * Get analytics for all sequences of an agent
   */
  static async getAllSequencesAnalytics(
    agentId: string,
    period?: AnalyticsPeriod
  ): Promise<SequenceAnalytics[]> {
    try {
      const sequences = await Sequence.find({ agentId, isActive: true });
      const analytics = [];

      for (const sequence of sequences) {
        const sequenceAnalytics = await this.getSequenceAnalytics(sequence._id.toString(), period);
        if (sequenceAnalytics) {
          analytics.push(sequenceAnalytics);
        }
      }

      return analytics;
    } catch (error) {
      console.error('Error getting all sequences analytics:', error);
      return [];
    }
  }

  /**
   * Get channel performance analytics
   */
  static async getChannelAnalytics(
    agentId: string,
    period?: AnalyticsPeriod
  ): Promise<ChannelAnalytics[]> {
    try {
      const dateFilter: any = { agentId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      const channelStats = await Communication.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$channel',
            totalSent: { $sum: 1 },
            delivered: {
              $sum: {
                $cond: [{ $in: ['$status', ['delivered', 'opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            opened: {
              $sum: {
                $cond: [{ $in: ['$status', ['opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            clicked: {
              $sum: {
                $cond: [{ $in: ['$status', ['clicked', 'responded']] }, 1, 0]
              }
            },
            responded: {
              $sum: {
                $cond: [{ $eq: ['$status', 'responded'] }, 1, 0]
              }
            },
            bounced: {
              $sum: {
                $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0]
              }
            },
            totalCost: { $sum: '$provider.cost' }
          }
        }
      ]);

      return channelStats.map(stat => ({
        channel: stat._id,
        totalSent: stat.totalSent,
        delivered: stat.delivered,
        opened: stat.opened,
        clicked: stat.clicked,
        responded: stat.responded,
        bounced: stat.bounced,
        deliveryRate: stat.totalSent > 0 ? (stat.delivered / stat.totalSent) * 100 : 0,
        openRate: stat.delivered > 0 ? (stat.opened / stat.delivered) * 100 : 0,
        clickRate: stat.delivered > 0 ? (stat.clicked / stat.delivered) * 100 : 0,
        responseRate: stat.delivered > 0 ? (stat.responded / stat.delivered) * 100 : 0,
        bounceRate: stat.totalSent > 0 ? (stat.bounced / stat.totalSent) * 100 : 0,
        totalCost: stat.totalCost,
        averageCost: stat.totalSent > 0 ? stat.totalCost / stat.totalSent : 0
      }));

    } catch (error) {
      console.error('Error getting channel analytics:', error);
      return [];
    }
  }

  /**
   * Get template performance analytics
   */
  static async getTemplateAnalytics(
    agentId: string,
    period?: AnalyticsPeriod
  ): Promise<TemplateAnalytics[]> {
    try {
      const dateFilter: any = { agentId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      const templateStats = await Communication.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'templates',
            localField: 'templateId',
            foreignField: '_id',
            as: 'template'
          }
        },
        { $unwind: '$template' },
        {
          $group: {
            _id: '$templateId',
            templateName: { $first: '$template.name' },
            channel: { $first: '$template.channel' },
            category: { $first: '$template.category' },
            totalSent: { $sum: 1 },
            delivered: {
              $sum: {
                $cond: [{ $in: ['$status', ['delivered', 'opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            opened: {
              $sum: {
                $cond: [{ $in: ['$status', ['opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            clicked: {
              $sum: {
                $cond: [{ $in: ['$status', ['clicked', 'responded']] }, 1, 0]
              }
            },
            responded: {
              $sum: {
                $cond: [{ $eq: ['$status', 'responded'] }, 1, 0]
              }
            },
            bounced: {
              $sum: {
                $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0]
              }
            },
            lastUsed: { $max: '$createdAt' }
          }
        }
      ]);

      return templateStats.map(stat => ({
        templateId: stat._id.toString(),
        templateName: stat.templateName,
        channel: stat.channel,
        category: stat.category,
        totalSent: stat.totalSent,
        delivered: stat.delivered,
        opened: stat.opened,
        clicked: stat.clicked,
        responded: stat.responded,
        bounced: stat.bounced,
        deliveryRate: stat.totalSent > 0 ? (stat.delivered / stat.totalSent) * 100 : 0,
        openRate: stat.delivered > 0 ? (stat.opened / stat.delivered) * 100 : 0,
        clickRate: stat.delivered > 0 ? (stat.clicked / stat.delivered) * 100 : 0,
        responseRate: stat.delivered > 0 ? (stat.responded / stat.delivered) * 100 : 0,
        bounceRate: stat.totalSent > 0 ? (stat.bounced / stat.totalSent) * 100 : 0,
        lastUsed: stat.lastUsed
      }));

    } catch (error) {
      console.error('Error getting template analytics:', error);
      return [];
    }
  }

  /**
   * Get overall dashboard metrics
   */
  static async getDashboardMetrics(
    agentId: string,
    period?: AnalyticsPeriod
  ): Promise<any> {
    try {
      const dateFilter: any = { agentId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      const metrics = await Communication.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            deliveredMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['delivered', 'opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            openedMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['opened', 'clicked', 'responded']] }, 1, 0]
              }
            },
            clickedMessages: {
              $sum: {
                $cond: [{ $in: ['$status', ['clicked', 'responded']] }, 1, 0]
              }
            },
            respondedMessages: {
              $sum: {
                $cond: [{ $eq: ['$status', 'responded'] }, 1, 0]
              }
            },
            totalCost: { $sum: '$provider.cost' },
            uniqueContacts: { $addToSet: '$contactId' },
            uniqueSequences: { $addToSet: '$sequenceId' }
          }
        }
      ]);

      const data = metrics[0] || {
        totalMessages: 0,
        deliveredMessages: 0,
        openedMessages: 0,
        clickedMessages: 0,
        respondedMessages: 0,
        totalCost: 0,
        uniqueContacts: [],
        uniqueSequences: []
      };

      return {
        totalMessages: data.totalMessages,
        totalContacts: data.uniqueContacts.length,
        totalSequences: data.uniqueSequences.length,
        deliveryRate: data.totalMessages > 0 ? (data.deliveredMessages / data.totalMessages) * 100 : 0,
        openRate: data.deliveredMessages > 0 ? (data.openedMessages / data.deliveredMessages) * 100 : 0,
        clickRate: data.deliveredMessages > 0 ? (data.clickedMessages / data.deliveredMessages) * 100 : 0,
        responseRate: data.deliveredMessages > 0 ? (data.respondedMessages / data.deliveredMessages) * 100 : 0,
        totalCost: data.totalCost,
        averageCostPerMessage: data.totalMessages > 0 ? data.totalCost / data.totalMessages : 0
      };

    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return {};
    }
  }

  /**
   * Helper method to get completed contacts count
   */
  private static async getCompletedContactsCount(
    sequenceId: string,
    period?: AnalyticsPeriod
  ): Promise<number> {
    try {
      const dateFilter: any = { sequenceId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      // Get contacts who have completed all steps
      const sequence = await Sequence.findById(sequenceId);
      if (!sequence) return 0;

      const lastStepNumber = Math.max(...sequence.steps.map((s: any) => s.stepNumber));

      const completedContacts = await Communication.distinct('contactId', {
        ...dateFilter,
        sequenceStepId: lastStepNumber.toString(),
        status: { $in: ['sent', 'delivered', 'opened', 'clicked', 'responded'] }
      });

      return completedContacts.length;

    } catch (error) {
      console.error('Error getting completed contacts count:', error);
      return 0;
    }
  }

  /**
   * Helper method to get average steps completed
   */
  private static async getAverageStepsCompleted(
    sequenceId: string,
    period?: AnalyticsPeriod
  ): Promise<number> {
    try {
      const dateFilter: any = { sequenceId };
      if (period) {
        dateFilter.createdAt = {
          $gte: period.start,
          $lte: period.end
        };
      }

      const stepStats = await Communication.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$contactId',
            maxStep: { $max: { $toInt: '$sequenceStepId' } }
          }
        },
        {
          $group: {
            _id: null,
            totalContacts: { $sum: 1 },
            totalSteps: { $sum: '$maxStep' }
          }
        }
      ]);

      const data = stepStats[0];
      return data ? data.totalSteps / data.totalContacts : 0;

    } catch (error) {
      console.error('Error getting average steps completed:', error);
      return 0;
    }
  }
}