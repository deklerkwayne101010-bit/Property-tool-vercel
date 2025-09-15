import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['credit_purchase', 'subscription', 'refund', 'credit_bonus'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ZAR' },

  // Payment details
  yocoPaymentId: { type: String },
  yocoChargeId: { type: String },
  paymentMethod: { type: String },

  // Credit details
  creditsGranted: { type: Number },
  creditsUsed: { type: Number },

  // Subscription details
  subscriptionPlan: { type: String },
  subscriptionPeriod: { type: String }, // 'monthly', 'yearly'
  subscriptionId: { type: String },

  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },

  // Additional metadata
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Update the updatedAt field before saving
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Index for efficient queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ yocoPaymentId: 1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;