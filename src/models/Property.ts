import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  price: { type: Number },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [{ type: String }],
  uniqueFeatures: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    thumbnail: { type: String },
    alt: { type: String },
    order: { type: Number, default: 0 }
  }],
  status: { type: String, enum: ['draft', 'active', 'sold', 'rented'], default: 'draft' },
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