import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  whatsappNumber: { type: String },
  status: { type: String, enum: ['lead', 'prospect', 'client'], default: 'lead' },
  source: { type: String, enum: ['website', 'referral', 'social', 'advertisement', 'other'], default: 'website' },
  budget: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  preferences: {
    propertyType: [{ type: String }], // apartment, house, condo, etc.
    bedrooms: Number,
    bathrooms: Number,
    location: [String]
  },
  notes: { type: String },
  lastContact: { type: Date },
  nextFollowUp: { type: Date },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
contactSchema.index({ agentId: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ nextFollowUp: 1 });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;