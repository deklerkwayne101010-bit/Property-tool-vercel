import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  content: {
    html: string;
    css: string;
    variables: Record<string, any>;
  };
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  isDefault: boolean;
  usageCount: number;
  rating: number;
  reviews: number;
  metadata: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    format: string;
  };
  settings: {
    autoSave: boolean;
    versionControl: boolean;
    collaboration: boolean;
  };
  versions: Array<{
    version: number;
    content: any;
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'residential',
      'commercial',
      'industrial',
      'agricultural',
      'vacant-land',
      'social-media',
      'flyer',
      'brochure',
      'email',
      'website'
    ]
  },
  content: {
    html: {
      type: String,
      required: true
    },
    css: {
      type: String,
      default: ''
    },
    variables: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  thumbnail: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  metadata: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'landscape'
    },
    format: {
      type: String,
      default: 'image'
    }
  },
  settings: {
    autoSave: {
      type: Boolean,
      default: true
    },
    versionControl: {
      type: Boolean,
      default: true
    },
    collaboration: {
      type: Boolean,
      default: false
    }
  },
  versions: [{
    version: {
      type: Number,
      required: true
    },
    content: {
      type: Schema.Types.Mixed,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
TemplateSchema.index({ userId: 1, category: 1 });
TemplateSchema.index({ isPublic: 1, category: 1 });
TemplateSchema.index({ tags: 1 });
TemplateSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to create version
TemplateSchema.pre<ITemplate>('save', function(next) {
  if (this.isModified('content') && this.settings.versionControl) {
    const currentVersion = this.versions.length > 0
      ? Math.max(...this.versions.map((v: any) => v.version))
      : 0;

    this.versions.push({
      version: currentVersion + 1,
      content: this.content,
      createdAt: new Date(),
      createdBy: this.userId
    });

    // Keep only last 10 versions
    if (this.versions.length > 10) {
      this.versions = this.versions.slice(-10);
    }
  }
  next();
});

// Static methods
TemplateSchema.statics.findByCategory = function(category: string, userId?: string) {
  const query: any = { category };
  if (userId) {
    query.$or = [
      { userId },
      { isPublic: true }
    ];
  } else {
    query.isPublic = true;
  }
  return this.find(query).sort({ usageCount: -1, rating: -1 });
};

TemplateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ usageCount: -1, rating: -1 })
    .limit(limit);
};

TemplateSchema.statics.findByTags = function(tags: string[], userId?: string) {
  const query: any = { tags: { $in: tags } };
  if (userId) {
    query.$or = [
      { userId },
      { isPublic: true }
    ];
  } else {
    query.isPublic = true;
  }
  return this.find(query);
};

// Instance methods
TemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

TemplateSchema.methods.addRating = function(newRating: number) {
  const totalRating = (this.rating * this.reviews) + newRating;
  this.reviews += 1;
  this.rating = totalRating / this.reviews;
  return this.save();
};

TemplateSchema.methods.createVersion = function(createdBy: mongoose.Types.ObjectId) {
  const currentVersion = this.versions.length > 0
    ? Math.max(...this.versions.map((v: any) => v.version))
    : 0;

  this.versions.push({
    version: currentVersion + 1,
    content: this.content,
    createdAt: new Date(),
    createdBy
  });

  return this.save();
};

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);