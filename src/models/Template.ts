import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['welcome', 'follow_up', 'property_update', 'market_report', 'custom'],
    default: 'custom'
  },
  channel: {
    type: String,
    enum: ['email', 'sms', 'whatsapp'],
    required: true
  },
  subject: {
    type: String,
    required: function(this: any) {
      return this.channel === 'email';
    }
  },
  content: { type: String, required: true },
  variables: [{
    name: { type: String, required: true }, // e.g., "contact_name", "property_address"
    description: { type: String },
    required: { type: Boolean, default: false },
    defaultValue: { type: String }
  }],
  design: {
    // Email-specific design settings
    templateType: {
      type: String,
      enum: ['plain_text', 'html_basic', 'html_advanced'],
      default: 'html_basic'
    },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#64748b' },
    fontFamily: { type: String, default: 'Arial, sans-serif' },
    logoUrl: { type: String },
    headerImage: { type: String },
    footerText: { type: String }
  },
  settings: {
    // SMS-specific settings
    maxLength: { type: Number, default: 160 }, // SMS character limit
    concatenate: { type: Boolean, default: false }, // Allow long SMS concatenation

    // Email-specific settings
    trackOpens: { type: Boolean, default: true },
    trackClicks: { type: Boolean, default: true },
    unsubscribeLink: { type: Boolean, default: true },

    // WhatsApp-specific settings
    includeButtons: { type: Boolean, default: false },
    buttonText: { type: String },
    buttonUrl: { type: String }
  },
  tags: [{ type: String }], // For organization and filtering
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false }, // Default template for category/channel
  usageStats: {
    totalSent: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    lastUsed: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
templateSchema.index({ agentId: 1, channel: 1, category: 1 });
templateSchema.index({ agentId: 1, isActive: 1 });
templateSchema.index({ tags: 1 });

// Update the updatedAt field before saving
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get default templates
templateSchema.statics.getDefaultTemplates = function(agentId: string, channel: string) {
  return this.find({
    agentId,
    channel,
    isDefault: true,
    isActive: true
  });
};

// Instance method to render template with variables
templateSchema.methods.render = function(variables: Record<string, any> = {}): string {
  let renderedContent = this.content;

  // Replace variables in content
  this.variables.forEach((variable: any) => {
    const placeholder = `{{${variable.name}}}`;
    const value = variables[variable.name] || variable.defaultValue || '';

    // Handle special variables
    let finalValue = value;
    if (variable.name === 'current_date') {
      finalValue = new Date().toLocaleDateString();
    } else if (variable.name === 'current_year') {
      finalValue = new Date().getFullYear().toString();
    }

    renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), finalValue);
  });

  return renderedContent;
};

// Instance method to render subject (email only)
templateSchema.methods.renderSubject = function(variables: Record<string, any> = {}): string {
  if (this.channel !== 'email' || !this.subject) {
    return '';
  }

  let renderedSubject = this.subject;

  // Replace variables in subject
  this.variables.forEach((variable: any) => {
    const placeholder = `{{${variable.name}}}`;
    const value = variables[variable.name] || variable.defaultValue || '';
    renderedSubject = renderedSubject.replace(new RegExp(placeholder, 'g'), value);
  });

  return renderedSubject;
};

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);

export default Template;