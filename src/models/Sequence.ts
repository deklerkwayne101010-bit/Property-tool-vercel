import mongoose from 'mongoose';

const sequenceStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  delayDays: { type: Number, required: true, min: 0 }, // Days to wait before sending
  delayHours: { type: Number, default: 0, min: 0, max: 23 }, // Additional hours
  delayMinutes: { type: Number, default: 0, min: 0, max: 59 }, // Additional minutes
  channel: {
    type: String,
    enum: ['email', 'sms', 'whatsapp'],
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  isActive: { type: Boolean, default: true },
  conditions: {
    openRate: { type: Number, min: 0, max: 100 }, // Only send if previous email open rate meets this
    clickRate: { type: Number, min: 0, max: 100 }, // Only send if previous email click rate meets this
    responseReceived: { type: Boolean, default: false } // Don't send if response already received
  }
});

const sequenceSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  trigger: {
    type: {
      type: String,
      enum: ['manual', 'property_import', 'contact_added', 'scheduled'],
      default: 'manual'
    },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // For property-specific sequences
    schedule: {
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
      dayOfMonth: { type: Number, min: 1, max: 31 },
      time: { type: String } // HH:MM format
    }
  },
  targetAudience: {
    tags: [{ type: String }], // Contact tags to target
    propertyTypes: [{ type: String }], // Property types to target
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    locations: [{ type: String }], // Cities/suburbs to target
    customFilters: { type: mongoose.Schema.Types.Mixed } // Flexible custom filters
  },
  steps: [sequenceStepSchema],
  isActive: { type: Boolean, default: true },
  stats: {
    totalContacts: { type: Number, default: 0 },
    completedContacts: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    deliveredMessages: { type: Number, default: 0 },
    openedMessages: { type: Number, default: 0 },
    clickedMessages: { type: Number, default: 0 },
    responses: { type: Number, default: 0 },
    unsubscribes: { type: Number, default: 0 },
    bounces: { type: Number, default: 0 }
  },
  settings: {
    respectDoNotDisturb: { type: Boolean, default: true },
    maxMessagesPerDay: { type: Number, default: 50 },
    timezone: { type: String, default: 'Africa/Johannesburg' },
    businessHours: {
      start: { type: String, default: '08:00' },
      end: { type: String, default: '18:00' },
      daysOfWeek: [{ type: Number, min: 0, max: 6, default: [1, 2, 3, 4, 5] }] // Monday to Friday
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
sequenceSchema.index({ agentId: 1, isActive: 1 });
sequenceSchema.index({ 'trigger.type': 1, 'trigger.propertyId': 1 });
sequenceSchema.index({ 'targetAudience.tags': 1 });

// Update the updatedAt field before saving
sequenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Sequence = mongoose.models.Sequence || mongoose.model('Sequence', sequenceSchema);

export default Sequence;