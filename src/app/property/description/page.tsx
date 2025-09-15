'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface PropertyData {
  // Basic Information
  title: string;
  propertyType: string;
  listingType: string;

  // Size & Layout
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  levels: string;

  // Location
  address: string;
  suburb: string;
  city: string;
  province: string;
  coordinates: string;

  // Pricing
  price: string;
  priceRange: string;
  ratesAndTaxes: string;
  levies: string;
  deposit: string;

  // Features & Amenities
  features: string;
  kitchenFeatures: string;
  bathroomFeatures: string;
  securityFeatures: string;
  outdoorFeatures: string;
  specialFeatures: string;

  // Property Details
  yearBuilt: string;
  condition: string;
  roofType: string;
  wallType: string;
  flooring: string;

  // Neighborhood
  neighborhoodHighlights: string;
  nearbyAmenities: string;
  schools: string;
  transport: string;
  shopping: string;

  // Agent Information
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agencyName: string;

  // Marketing Preferences
  targetAudience: string;
  tone: string;
  keySellingPoints: string;
  uniqueFeatures: string;
  marketPositioning: string;

  // Generation Settings
  descriptionLength: string;
  includeAgentInfo: boolean;
  includePricing: boolean;
  includeNeighborhood: boolean;
  seoKeywords: string;
}

export default function AIDescriptionPage() {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [activeTab, setActiveTab] = useState('basic');
  const [propertyData, setPropertyData] = useState<PropertyData>({
    // Basic Information
    title: '',
    propertyType: 'Residential',
    listingType: 'For Sale',

    // Size & Layout
    bedrooms: '',
    bathrooms: '',
    garages: '',
    erfSize: '',
    floorSize: '',
    levels: '',

    // Location
    address: '',
    suburb: '',
    city: '',
    province: '',
    coordinates: '',

    // Pricing
    price: '',
    priceRange: '',
    ratesAndTaxes: '',
    levies: '',
    deposit: '',

    // Features & Amenities
    features: '',
    kitchenFeatures: '',
    bathroomFeatures: '',
    securityFeatures: '',
    outdoorFeatures: '',
    specialFeatures: '',

    // Property Details
    yearBuilt: '',
    condition: '',
    roofType: '',
    wallType: '',
    flooring: '',

    // Neighborhood
    neighborhoodHighlights: '',
    nearbyAmenities: '',
    schools: '',
    transport: '',
    shopping: '',

    // Agent Information
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agencyName: '',

    // Marketing Preferences
    targetAudience: 'Families',
    tone: 'Professional',
    keySellingPoints: '',
    uniqueFeatures: '',
    marketPositioning: '',

    // Generation Settings
    descriptionLength: 'Medium',
    includeAgentInfo: true,
    includePricing: true,
    includeNeighborhood: true,
    seoKeywords: ''
  });

  const [generatedDescriptions, setGeneratedDescriptions] = useState<{
    short: string;
    medium: string;
    long: string;
    social: string;
  }>({
    short: '',
    medium: '',
    long: '',
    social: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDescription, setActiveDescription] = useState<'short' | 'medium' | 'long' | 'social'>('medium');

  const handleInputChange = (field: keyof PropertyData, value: string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDescription = async () => {
    setIsGenerating(true);

    // Simulate AI generation with different lengths
    setTimeout(() => {
      const baseDescription = generateBaseDescription();

      const descriptions = {
        short: generateShortDescription(baseDescription),
        medium: generateMediumDescription(baseDescription),
        long: generateLongDescription(baseDescription),
        social: generateSocialDescription(baseDescription)
      };

      setGeneratedDescriptions(descriptions);
      setIsGenerating(false);
    }, 3000);
  };

  const generateBaseDescription = (): string => {
    const parts = [];

    // Title and basic info
    if (propertyData.title) {
      parts.push(`Discover this stunning ${propertyData.title}`);
    }

    // Size and layout
    const sizeParts = [];
    if (propertyData.bedrooms) sizeParts.push(`${propertyData.bedrooms} bedroom`);
    if (propertyData.bathrooms) sizeParts.push(`${propertyData.bathrooms} bathroom`);
    if (propertyData.garages) sizeParts.push(`${propertyData.garages} garage`);
    if (sizeParts.length > 0) {
      parts.push(`featuring ${sizeParts.join(', ')}`);
    }

    // Location
    if (propertyData.suburb && propertyData.city) {
      parts.push(`located in the desirable ${propertyData.suburb} area of ${propertyData.city}`);
    } else if (propertyData.city) {
      parts.push(`located in ${propertyData.city}`);
    }

    // Price
    if (propertyData.price && propertyData.includePricing) {
      parts.push(`priced at ${propertyData.price}`);
    }

    // Features
    if (propertyData.features) {
      parts.push(`This exceptional property offers ${propertyData.features}`);
    }

    return parts.join('. ') + '.';
  };

  const generateShortDescription = (base: string): string => {
    return `${base} Perfect for modern living. Contact us today!`;
  };

  const generateMediumDescription = (base: string): string => {
    let description = base;

    if (propertyData.neighborhoodHighlights && propertyData.includeNeighborhood) {
      description += ` ${propertyData.neighborhoodHighlights}`;
    }

    if (propertyData.keySellingPoints) {
      description += ` ${propertyData.keySellingPoints}`;
    }

    description += ' Don\'t miss this incredible opportunity!';

    return description;
  };

  const generateLongDescription = (base: string): string => {
    let description = base;

    // Add detailed features
    if (propertyData.kitchenFeatures) {
      description += ` The modern kitchen features ${propertyData.kitchenFeatures}.`;
    }

    if (propertyData.bathroomFeatures) {
      description += ` The bathrooms boast ${propertyData.bathroomFeatures}.`;
    }

    if (propertyData.outdoorFeatures) {
      description += ` Outside, you'll find ${propertyData.outdoorFeatures}.`;
    }

    // Add neighborhood info
    if (propertyData.nearbyAmenities && propertyData.includeNeighborhood) {
      description += ` Located near ${propertyData.nearbyAmenities}.`;
    }

    if (propertyData.schools) {
      description += ` Excellent schools in the area include ${propertyData.schools}.`;
    }

    // Add agent info
    if (propertyData.includeAgentInfo && propertyData.agentName) {
      description += ` Contact ${propertyData.agentName} at ${propertyData.agencyName} for more information.`;
    }

    description += ' This property represents an outstanding opportunity in today\'s market.';

    return description;
  };

  const generateSocialDescription = (base: string): string => {
    const emojis = ['🏠', '✨', '🌟', '💫', '🔥'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    return `${randomEmoji} ${propertyData.title || 'Amazing Property'} ${randomEmoji}

${base}

${propertyData.price ? `💰 ${propertyData.price}` : ''}
${propertyData.bedrooms ? `🛏️ ${propertyData.bedrooms} Bedrooms` : ''}
${propertyData.bathrooms ? `🛁 ${propertyData.bathrooms} Bathrooms` : ''}

#RealEstate #Property #${propertyData.city?.replace(/\s+/g, '') || 'SouthAfrica'}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: '🏠' },
    { id: 'details', name: 'Property Details', icon: '📋' },
    { id: 'location', name: 'Location', icon: '📍' },
    { id: 'pricing', name: 'Pricing', icon: '💰' },
    { id: 'features', name: 'Features', icon: '⭐' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'agent', name: 'Agent Info', icon: '👤' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Property Description Generator
              </h1>
              <p className="text-lg text-gray-600">
                Create compelling, SEO-optimized property descriptions using artificial intelligence tailored for the South African real estate market.
              </p>
            </div>

            {/* Mode Selection */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('basic')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === 'basic'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setMode('advanced')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === 'advanced'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Only show in Advanced mode */}
        {mode === 'advanced' && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            {mode === 'basic' ? (
              /* Basic Mode */
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Property Description</h2>

                <div className="space-y-6">
                  {/* Basic Property Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Title *
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Luxury 3-Bedroom Apartment"
                        value={propertyData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={propertyData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Apartment">Apartment</option>
                      </select>
                    </div>
                  </div>

                  {/* Size & Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <select
                        value={propertyData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <select
                        value={propertyData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4+ Bathrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Garages
                      </label>
                      <select
                        value={propertyData.garages}
                        onChange={(e) => handleInputChange('garages', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="0">No Garage</option>
                        <option value="1">1 Garage</option>
                        <option value="2">2 Garages</option>
                        <option value="3">3+ Garages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Erf Size
                      </label>
                      <Input
                        type="text"
                        placeholder="500 m²"
                        value={propertyData.erfSize}
                        onChange={(e) => handleInputChange('erfSize', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        value={propertyData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select City</option>
                        <option value="Cape Town">Cape Town</option>
                        <option value="Johannesburg">Johannesburg</option>
                        <option value="Durban">Durban</option>
                        <option value="Pretoria">Pretoria</option>
                        <option value="Port Elizabeth">Port Elizabeth</option>
                        <option value="Bloemfontein">Bloemfontein</option>
                        <option value="East London">East London</option>
                        <option value="Kimberley">Kimberley</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suburb/Area
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Claremont"
                        value={propertyData.suburb}
                        onChange={(e) => handleInputChange('suburb', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <select
                        value={propertyData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Province</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asking Price (ZAR) *
                      </label>
                      <Input
                        type="text"
                        placeholder="R 2,500,000"
                        value={propertyData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <select
                        value={propertyData.priceRange}
                        onChange={(e) => handleInputChange('priceRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Range</option>
                        <option value="Budget">Budget (Under R 500K)</option>
                        <option value="Affordable">Affordable (R 500K - R 1M)</option>
                        <option value="Mid-Range">Mid-Range (R 1M - R 2M)</option>
                        <option value="Premium">Premium (R 2M - R 5M)</option>
                        <option value="Luxury">Luxury (Over R 5M)</option>
                      </select>
                    </div>
                  </div>

                  {/* Features Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Key Features (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Sea View', 'Mountain View', 'Garden', 'Pool', 'Braai Area',
                        'Study', 'Walk-in Closet', 'Solar Panels', 'Borehole', 'Alarm System',
                        'Electric Fencing', 'Air Conditioning', 'Built-in Cupboards', 'Open Plan'
                      ].map((feature) => (
                        <label key={feature} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={(e) => {
                              const currentFeatures = propertyData.features.split(', ').filter(f => f.trim());
                              if (e.target.checked) {
                                currentFeatures.push(feature);
                              } else {
                                const index = currentFeatures.indexOf(feature);
                                if (index > -1) currentFeatures.splice(index, 1);
                              }
                              handleInputChange('features', currentFeatures.join(', '));
                            }}
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Features or Special Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Any additional features, recent renovations, or special selling points..."
                      value={propertyData.keySellingPoints}
                      onChange={(e) => handleInputChange('keySellingPoints', e.target.value)}
                    />
                  </div>

                  {/* Agent Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agent Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={propertyData.agentName}
                        onChange={(e) => handleInputChange('agentName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agent Phone
                      </label>
                      <Input
                        type="tel"
                        placeholder="+27 21 555 0123"
                        value={propertyData.agentPhone}
                        onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <Button
                      onClick={generateDescription}
                      disabled={isGenerating || !propertyData.title || !propertyData.city || !propertyData.price}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Description...
                        </>
                      ) : (
                        'Generate Property Description'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              /* Advanced Mode - Tabbed Interface */
              <Card className="p-6">
                {/* Tab Content */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property Title *
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Luxury 3-Bedroom Apartment with Sea Views"
                          value={propertyData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property Type
                        </label>
                        <select
                          value={propertyData.propertyType}
                          onChange={(e) => handleInputChange('propertyType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Agricultural">Agricultural</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Property Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bedrooms
                        </label>
                        <Input
                          type="number"
                          placeholder="3"
                          value={propertyData.bedrooms}
                          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bathrooms
                        </label>
                        <Input
                          type="number"
                          placeholder="2"
                          value={propertyData.bathrooms}
                          onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Garages
                        </label>
                        <Input
                          type="number"
                          placeholder="1"
                          value={propertyData.garages}
                          onChange={(e) => handleInputChange('garages', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Erf Size (m²)
                        </label>
                        <Input
                          type="text"
                          placeholder="500"
                          value={propertyData.erfSize}
                          onChange={(e) => handleInputChange('erfSize', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Floor Size (m²)
                        </label>
                        <Input
                          type="text"
                          placeholder="250"
                          value={propertyData.floorSize}
                          onChange={(e) => handleInputChange('floorSize', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Levels
                        </label>
                        <Input
                          type="number"
                          placeholder="2"
                          value={propertyData.levels}
                          onChange={(e) => handleInputChange('levels', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year Built
                        </label>
                        <Input
                          type="number"
                          placeholder="2020"
                          value={propertyData.yearBuilt}
                          onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select
                          value={propertyData.condition}
                          onChange={(e) => handleInputChange('condition', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select condition</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Needs Work">Needs Work</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Roof Type
                        </label>
                        <Input
                          type="text"
                          placeholder="Tile"
                          value={propertyData.roofType}
                          onChange={(e) => handleInputChange('roofType', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Information</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <Input
                          type="text"
                          placeholder="123 Main Street"
                          value={propertyData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Suburb
                          </label>
                          <Input
                            type="text"
                            placeholder="Claremont"
                            value={propertyData.suburb}
                            onChange={(e) => handleInputChange('suburb', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <Input
                            type="text"
                            placeholder="Cape Town"
                            value={propertyData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Province
                          </label>
                          <select
                            value={propertyData.province}
                            onChange={(e) => handleInputChange('province', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select province</option>
                            <option value="Western Cape">Western Cape</option>
                            <option value="Gauteng">Gauteng</option>
                            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                            <option value="Eastern Cape">Eastern Cape</option>
                            <option value="Limpopo">Limpopo</option>
                            <option value="Mpumalanga">Mpumalanga</option>
                            <option value="North West">North West</option>
                            <option value="Northern Cape">Northern Cape</option>
                            <option value="Free State">Free State</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Neighborhood Highlights
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Describe what makes this neighborhood special..."
                          value={propertyData.neighborhoodHighlights}
                          onChange={(e) => handleInputChange('neighborhoodHighlights', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nearby Amenities
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Shopping centers, restaurants, parks..."
                            value={propertyData.nearbyAmenities}
                            onChange={(e) => handleInputChange('nearbyAmenities', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Schools & Education
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Nearby schools, universities..."
                            value={propertyData.schools}
                            onChange={(e) => handleInputChange('schools', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asking Price (ZAR) *
                        </label>
                        <Input
                          type="text"
                          placeholder="R 2,500,000"
                          value={propertyData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Range
                        </label>
                        <select
                          value={propertyData.priceRange}
                          onChange={(e) => handleInputChange('priceRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select range</option>
                          <option value="Budget">Budget (Under R 500K)</option>
                          <option value="Affordable">Affordable (R 500K - R 1M)</option>
                          <option value="Mid-Range">Mid-Range (R 1M - R 2M)</option>
                          <option value="Premium">Premium (R 2M - R 5M)</option>
                          <option value="Luxury">Luxury (Over R 5M)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Rates & Taxes
                        </label>
                        <Input
                          type="text"
                          placeholder="R 2,500"
                          value={propertyData.ratesAndTaxes}
                          onChange={(e) => handleInputChange('ratesAndTaxes', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Levies
                        </label>
                        <Input
                          type="text"
                          placeholder="R 3,200"
                          value={propertyData.levies}
                          onChange={(e) => handleInputChange('levies', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Amenities</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key Features *
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Sea views, modern kitchen, double garage, solar panels..."
                          value={propertyData.features}
                          onChange={(e) => handleInputChange('features', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kitchen Features
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Granite countertops, built-in oven, dishwasher..."
                            value={propertyData.kitchenFeatures}
                            onChange={(e) => handleInputChange('kitchenFeatures', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bathroom Features
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="En-suite bathrooms, heated towel rails..."
                            value={propertyData.bathroomFeatures}
                            onChange={(e) => handleInputChange('bathroomFeatures', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Security Features
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Alarm system, electric fencing, CCTV..."
                            value={propertyData.securityFeatures}
                            onChange={(e) => handleInputChange('securityFeatures', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Outdoor Features
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Garden, pool, braai area, patio..."
                            value={propertyData.outdoorFeatures}
                            onChange={(e) => handleInputChange('outdoorFeatures', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Features
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Solar panels, borehole, study, walk-in closet..."
                          value={propertyData.specialFeatures}
                          onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing Tab */}
                {activeTab === 'marketing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Marketing Preferences</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <select
                          value={propertyData.targetAudience}
                          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Families">Families</option>
                          <option value="Young Professionals">Young Professionals</option>
                          <option value="Investors">Investors</option>
                          <option value="Retirees">Retirees</option>
                          <option value="First-Time Buyers">First-Time Buyers</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tone
                        </label>
                        <select
                          value={propertyData.tone}
                          onChange={(e) => handleInputChange('tone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Professional">Professional</option>
                          <option value="Friendly">Friendly</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Casual">Casual</option>
                          <option value="Emotional">Emotional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key Selling Points
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="What makes this property special? Investment potential, lifestyle benefits..."
                          value={propertyData.keySellingPoints}
                          onChange={(e) => handleInputChange('keySellingPoints', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unique Features
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="What sets this property apart from others?"
                          value={propertyData.uniqueFeatures}
                          onChange={(e) => handleInputChange('uniqueFeatures', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Market Positioning
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="How should this property be positioned in the market?"
                          value={propertyData.marketPositioning}
                          onChange={(e) => handleInputChange('marketPositioning', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Info Tab */}
                {activeTab === 'agent' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agent Name
                        </label>
                        <Input
                          type="text"
                          placeholder="John Smith"
                          value={propertyData.agentName}
                          onChange={(e) => handleInputChange('agentName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agency Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Premier Properties"
                          value={propertyData.agencyName}
                          onChange={(e) => handleInputChange('agencyName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+27 21 555 0123"
                          value={propertyData.agentPhone}
                          onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="john@premierproperties.co.za"
                          value={propertyData.agentEmail}
                          onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Generation Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description Length
                        </label>
                        <select
                          value={propertyData.descriptionLength}
                          onChange={(e) => handleInputChange('descriptionLength', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Short">Short (50-100 words)</option>
                          <option value="Medium">Medium (100-200 words)</option>
                          <option value="Long">Long (200-400 words)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SEO Keywords
                        </label>
                        <Input
                          type="text"
                          placeholder="luxury, apartment, sea view, modern"
                          value={propertyData.seoKeywords}
                          onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="include-pricing"
                          checked={propertyData.includePricing}
                          onChange={(e) => handleInputChange('includePricing', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-pricing" className="ml-2 text-sm text-gray-700">
                          Include pricing information
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="include-agent"
                          checked={propertyData.includeAgentInfo}
                          onChange={(e) => handleInputChange('includeAgentInfo', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-agent" className="ml-2 text-sm text-gray-700">
                          Include agent contact information
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="include-neighborhood"
                          checked={propertyData.includeNeighborhood}
                          onChange={(e) => handleInputChange('includeNeighborhood', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-neighborhood" className="ml-2 text-sm text-gray-700">
                          Include neighborhood information
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button for Advanced Mode */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={generateDescription}
                    disabled={isGenerating || !propertyData.title}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Descriptions...
                      </>
                    ) : (
                      'Generate AI Descriptions'
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Generated Descriptions */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Generated Descriptions</h2>
                <div className="flex space-x-2">
                  {['short', 'medium', 'long', 'social'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveDescription(type as any)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        activeDescription === type
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Generating AI Descriptions</p>
                  <p className="text-sm text-gray-600">This may take a few moments...</p>
                </div>
              ) : generatedDescriptions[activeDescription] ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      {activeDescription} Description
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedDescriptions[activeDescription])}
                    >
                      Copy
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm leading-relaxed">
                      {generatedDescriptions[activeDescription]}
                    </pre>
                  </div>

                  <div className="text-xs text-gray-500">
                    Word count: {generatedDescriptions[activeDescription].split(' ').length} words
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <p className="text-lg font-medium mb-2">AI Description Generator</p>
                  <p className="text-sm">Fill in the property details and click "Generate AI Descriptions" to create compelling property descriptions.</p>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            {generatedDescriptions[activeDescription] && (
              <div className="mt-6 space-y-4">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Save to Templates
                    </Button>
                    <Button variant="outline" size="sm">
                      Export as PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      Share with Team
                    </Button>
                    <Button variant="outline" size="sm">
                      Use in Marketing
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Optimization</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Location keywords</span>
                      <span className="text-green-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Feature highlights</span>
                      <span className="text-green-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Call-to-action</span>
                      <span className="text-green-600">✓ Included</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Recent Generations */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Generations</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Luxury 3-Bedroom Apartment</h3>
                <p className="text-sm text-gray-600">Cape Town, Western Cape • R 2,850,000</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Medium</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">SEO Optimized</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">2 hours ago</span>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Modern Townhouse</h3>
                <p className="text-sm text-gray-600">Johannesburg, Gauteng • R 1,950,000</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Long</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Social Media</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">1 day ago</span>
                <Button variant="ghost" size="sm">Use</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}