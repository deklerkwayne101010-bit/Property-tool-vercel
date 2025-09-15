import mongoose from 'mongoose';

const communicationSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  sequenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sequence' },
  sequenceStepId: { type: String }, // Reference to specific step in sequence
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Associated property if applicable

  channel: {
    type: String,
    enum: ['email', 'sms', 'whatsapp'],
    required: true
  },

  // Message content
  subject: { type: String }, // For email
  content: { type: String, required: true },
  renderedContent: { type: String }, // Content with variables replaced

  // Recipient information
  recipient: {
    email: { type: String },
    phone: { type: String },
    name: { type: String }
  },

  // Delivery status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'responded', 'bounced', 'failed', 'unsubscribed'],
    default: 'pending'
  },

  // Provider information
  provider: {
    name: { type: String, enum: ['sendgrid', 'twilio', 'whatsapp_business'] },
    messageId: { type: String }, // Provider's message ID
    cost: { type: Number }, // Cost of sending
    metadata: { type: mongoose.Schema.Types.Mixed } // Provider-specific data
  },

  // Timing information
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  openedAt: { type: Date },
  clickedAt: { type: Date },
  respondedAt: { type: Date },
  failedAt: { type: Date },

  // Engagement tracking
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  linkClicks: [{
    url: { type: String },
    clickedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
  }],

  // Response tracking
  response: {
    received: { type: Boolean, default: false },
    content: { type: String },
    receivedAt: { type: Date },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] }
  },

  // Error information
  error: {
    code: { type: String },
    message: { type: String },
    details: { type: mongoose.Schema.Types.Mixed }
  },

  // Campaign/sequence context
  campaign: {
    name: { type: String },
    tags: [{ type: String }],
    source: { type: String, enum: ['sequence', 'manual', 'campaign', 'follow_up'] }
  },

  // Geographic information
  geo: {
    ipAddress: { type: String },
    country: { type: String },
    city: { type: String },
    region: { type: String }
  },

  // User agent and device info
  device: {
    userAgent: { type: String },
    browser: { type: String },
    os: { type: String },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'] }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
communicationSchema.index({ agentId: 1, status: 1 });
communicationSchema.index({ contactId: 1, createdAt: -1 });
communicationSchema.index({ sequenceId: 1, sequenceStepId: 1 });
communicationSchema.index({ channel: 1, sentAt: -1 });
communicationSchema.index({ 'recipient.email': 1 });
communicationSchema.index({ 'recipient.phone': 1 });
communicationSchema.index({ status: 1, sentAt: -1 });

// Update the updatedAt field before saving
communicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods for analytics
communicationSchema.statics.getDeliveryStats = function(agentId: string, startDate?: Date, endDate?: Date) {
  const matchConditions: any = { agentId };

  if (startDate || endDate) {
    matchConditions.createdAt = {};
    if (startDate) matchConditions.createdAt.$gte = startDate;
    if (endDate) matchConditions.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalOpens: { $sum: '$openCount' },
        totalClicks: { $sum: '$clickCount' }
      }
    }
  ]);
};

communicationSchema.statics.getChannelPerformance = function(agentId: string, channel?: string) {
  const matchConditions: any = { agentId };
  if (channel) matchConditions.channel = channel;

  return this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$channel',
        total: { $sum: 1 },
        sent: {
          $sum: {
            $cond: [{ $in: ['$status', ['sent', 'delivered', 'opened', 'clicked', 'responded']] }, 1, 0]
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
        }
      }
    },
    {
      $project: {
        channel: '$_id',
        total: 1,
        sent: 1,
        opened: 1,
        clicked: 1,
        responded: 1,
        deliveryRate: { $multiply: [{ $divide: ['$sent', '$total'] }, 100] },
        openRate: { $multiply: [{ $divide: ['$opened', '$sent'] }, 100] },
        clickRate: { $multiply: [{ $divide: ['$clicked', '$sent'] }, 100] },
        responseRate: { $multiply: [{ $divide: ['$responded', '$sent'] }, 100] }
      }
    }
  ]);
};

const Communication = mongoose.models.Communication || mongoose.model('Communication', communicationSchema);

export default Communication;