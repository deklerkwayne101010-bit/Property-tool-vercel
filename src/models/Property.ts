import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },

  // Property details
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  garages: { type: Number, default: 0 },
  squareFootage: { type: Number, required: true },
  erfSize: { type: String }, // Property24 specific
  floorSize: { type: String }, // Property24 specific
  propertyType: { type: String, default: 'Residential' },

  // Pricing
  price: { type: Number },
  priceRange: { type: String, enum: ['Budget', 'Affordable', 'Mid-Range', 'Premium', 'Luxury'] },

  // Location
  location: {
    address: { type: String, required: true },
    suburb: { type: String }, // Property24 specific
    city: { type: String, required: true },
    province: { type: String }, // Property24 specific
    state: { type: String }, // For backward compatibility
    zipCode: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Property features
  amenities: [{ type: String }],
  uniqueFeatures: [{ type: String }],
  features: [{ type: String }], // Property24 specific features

  // Images
  images: [{
    url: { type: String, required: true },
    thumbnail: { type: String },
    alt: { type: String },
    order: { type: Number, default: 0 }
  }],

  // Agent information (Property24 specific)
  agentInfo: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    agencyName: { type: String }
  },

  // Property24 import data
  property24Data: {
    propertyId: { type: String },
    originalUrl: { type: String },
    listingDate: { type: String },
    importedAt: { type: Date, default: Date.now },
    lastSyncedAt: { type: Date }
  },

  // Marketing data
  targetMarket: { type: String, enum: ['First-Time Buyers', 'Couples & Young Families', 'Growing Families', 'Families'] },
  neighborhoodHighlights: { type: String },
  uniqueSellingPoints: { type: String },

  // Status and metadata
  status: { type: String, enum: ['draft', 'active', 'sold', 'rented', 'imported'], default: 'draft' },
  importStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: null },
  importError: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
propertySchema.index({ agentId: 1, status: 1 });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

export default Property;