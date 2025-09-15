import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['agent', 'admin', 'user'], default: 'user' },

  // Credit system
  credits: { type: Number, default: 5 }, // Free users get 5 credits

  // Subscription system
  subscription: {
    plan: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'inactive', 'cancelled', 'trial'], default: 'active' },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days trial
    yocoSubscriptionId: { type: String },
    features: [{ type: String }],
    autoRenew: { type: Boolean, default: true }
  },

  // Usage tracking
  usage: {
    descriptionsGenerated: { type: Number, default: 0 },
    templatesCreated: { type: Number, default: 0 },
    imagesProcessed: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },

  // Profile information
  profile: {
    agency: { type: String },
    phone: { type: String },
    location: { type: String },
    website: { type: String },
    bio: { type: String }
  },

  // Settings
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },

  // Security
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;