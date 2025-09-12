import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ['meeting', 'showing', 'call', 'task', 'reminder'], default: 'meeting' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled'], default: 'scheduled' },
  attendees: [{
    name: String,
    email: String,
    phone: String
  }],
  location: {
    address: String,
    virtual: Boolean,
    meetingLink: String
  },
  relatedTo: {
    type: { type: String, enum: ['property', 'contact'] },
    id: mongoose.Schema.Types.ObjectId
  },
  reminders: [{
    time: Number, // minutes before event
    type: { type: String, enum: ['email', 'sms', 'push'], default: 'email' }
  }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
eventSchema.index({ agentId: 1, startTime: 1 });
eventSchema.index({ agentId: 1, status: 1 });
eventSchema.index({ startTime: 1, endTime: 1 });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;