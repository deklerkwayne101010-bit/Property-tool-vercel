'use client';

import React, { useState, useEffect } from 'react';

interface PropertyData {
  // Basic Information
  title: string;
  propertyType: string;
  listingType: 'sale' | 'rent';
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  erfSize: number;
  yearBuilt: number;

  // Location Details
  location: {
    address: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };

  // Property Features
  amenities: string[];
  uniqueFeatures: string[];
  propertyCondition: string;
  parking: string;
  garden: string;

  // Market Positioning
  marketPosition: string;
  targetBuyer: string;
  uniqueSellingPoints: string[];

  // Additional Details
  petFriendly: boolean;
  furnished: boolean;
  waterIncluded: boolean;
  electricityIncluded: boolean;
  internetIncluded: boolean;
}

interface PropertyDescriptionGeneratorProps {
  onDescriptionGenerated?: (description: string) => void;
}

const PropertyDescriptionGenerator: React.FC<PropertyDescriptionGeneratorProps> = ({
  onDescriptionGenerated
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    title: '',
    propertyType: '',
    listingType: 'sale',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    erfSize: 0,
    yearBuilt: 0,
    location: {
      address: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: ''
    },
    amenities: [],
    uniqueFeatures: [],
    propertyCondition: '',
    parking: '',
    garden: '',
    marketPosition: '',
    targetBuyer: '',
    uniqueSellingPoints: [],
    petFriendly: false,
    furnished: false,
    waterIncluded: false,
    electricityIncluded: false,
    internetIncluded: false
  });

  const [generationSettings, setGenerationSettings] = useState({
    tone: 'professional',
    platform: 'Property24',
    keywords: '',
    length: 'medium',
    includePrice: true,
    focusPoints: [] as string[],
    callToAction: true
  });

  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('Property24');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<GeneratedDescription[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<number>(0);
  const [savedDescriptions, setSavedDescriptions] = useState<GeneratedDescription[]>([]);

  interface GeneratedDescription {
    id: number;
    description: string;
    wordCount: number;
    platform: string;
    tone: string;
    timestamp: string;
    propertyData: PropertyData;
    settings: typeof generationSettings;
  }

  // Computed values
  const generatedDescription = generatedDescriptions[selectedDescription]?.description || '';

  // Property Types for South African Market
  const propertyTypes = [
    { value: 'house', label: 'House', icon: '🏠', description: 'Standalone family home' },
    { value: 'apartment', label: 'Apartment', icon: '🏢', description: 'Modern apartment living' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️', description: 'Townhouse complex' },
    { value: 'duplex', label: 'Duplex', icon: '🏘️', description: 'Dual living spaces' },
    { value: 'cottage', label: 'Cottage', icon: '🏡', description: 'Charming cottage' },
    { value: 'vacant-land', label: 'Vacant Land', icon: '🌳', description: 'Development opportunity' }
  ];

  const listingTypes = [
    { value: 'sale', label: 'For Sale', icon: '💰' },
    { value: 'rent', label: 'To Rent', icon: '🔑' }
  ];

  const southAfricanCities = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Pietermaritzburg', 'Benoni', 'Vereeniging'
  ];

  const provinces = [
    'Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape',
    'Free State', 'North West', 'Mpumalanga', 'Limpopo', 'Northern Cape'
  ];

  const commonAmenities = [
    'Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Security System',
    'Walk-in Closet', 'Hardwood Floors', 'Stainless Steel Appliances', 'Granite Countertops',
    'Fireplace', 'Balcony', 'Gym', 'Parking', 'Laundry Room', 'Study', 'Patio',
    'Built-in Cupboards', 'Solar Panels', 'Alarm System', 'Intercom', 'Braai Area'
  ];

  const propertyConditions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
    { value: 'good', label: 'Good', description: 'Well maintained' },
    { value: 'fair', label: 'Fair', description: 'Needs some updates' },
    { value: 'needs-work', label: 'Needs Work', description: 'Renovation opportunity' }
  ];

  const parkingOptions = [
    { value: 'double-garage', label: 'Double Garage' },
    { value: 'single-garage', label: 'Single Garage' },
    { value: 'carport', label: 'Carport' },
    { value: 'open-parking', label: 'Open Parking' },
    { value: 'no-parking', label: 'No Parking' }
  ];

  const gardenOptions = [
    { value: 'large-garden', label: 'Large Garden' },
    { value: 'medium-garden', label: 'Medium Garden' },
    { value: 'small-garden', label: 'Small Garden' },
    { value: 'courtyard', label: 'Courtyard' },
    { value: 'no-garden', label: 'No Garden' }
  ];

  const marketPositions = [
    { value: 'luxury', label: 'Luxury', description: 'High-end market positioning' },
    { value: 'premium', label: 'Premium', description: 'Upscale neighborhood' },
    { value: 'family', label: 'Family', description: 'Perfect for families' },
    { value: 'investment', label: 'Investment', description: 'Great investment opportunity' },
    { value: 'first-home', label: 'First Home', description: 'Affordable entry point' },
    { value: 'retirement', label: 'Retirement', description: 'Peaceful retirement living' }
  ];

  const targetBuyers = [
    { value: 'young-professional', label: 'Young Professional', description: 'Career-focused individuals' },
    { value: 'young-family', label: 'Young Family', description: 'Growing families' },
    { value: 'empty-nesters', label: 'Empty Nesters', description: 'Downsizing couples' },
    { value: 'investor', label: 'Investor', description: 'Property investors' },
    { value: 'retiree', label: 'Retiree', description: 'Retirement planning' },
    { value: 'expat', label: 'Expat', description: 'International buyers' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Formal and trustworthy', icon: '👔' },
    { value: 'warm', label: 'Warm & Inviting', description: 'Friendly and approachable', icon: '🤗' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and exciting', icon: '⚡' },
    { value: 'luxury', label: 'Luxury', description: 'Premium and sophisticated', icon: '💎' },
    { value: 'storytelling', label: 'Storytelling', description: 'Emotional connection', icon: '📖' }
  ];

  const platforms = [
    { value: 'Property24', label: 'Property24', description: 'South Africa\'s #1 property portal' },
    { value: 'PrivateProperty', label: 'Private Property', description: 'Luxury property specialist' },
    { value: 'Facebook', label: 'Facebook Marketplace', description: 'Local community reach' },
    { value: 'WhatsApp', label: 'WhatsApp Groups', description: 'Direct buyer communication' },
    { value: 'Email', label: 'Email Marketing', description: 'Targeted buyer outreach' }
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short (50-100 words)', words: '50-100', description: 'Quick overview' },
    { value: 'medium', label: 'Medium (100-200 words)', words: '100-200', description: 'Balanced detail' },
    { value: 'long', label: 'Long (200-300 words)', words: '200-300', description: 'Comprehensive description' },
    { value: 'detailed', label: 'Detailed (300-500 words)', words: '300-500', description: 'Complete property story' }
  ];

  const focusPoints = [
    { value: 'location', label: 'Location Benefits', description: 'Emphasize neighborhood advantages' },
    { value: 'lifestyle', label: 'Lifestyle Appeal', description: 'Highlight living experience' },
    { value: 'investment', label: 'Investment Potential', description: 'Focus on financial benefits' },
    { value: 'family', label: 'Family Friendly', description: 'Perfect for families' },
    { value: 'luxury', label: 'Luxury Features', description: 'Premium amenities' },
    { value: 'modern', label: 'Modern Living', description: 'Contemporary lifestyle' }
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPropertyData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyData] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setPropertyData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleUniqueFeatureAdd = () => {
    const feature = prompt('Enter a unique feature:');
    if (feature && feature.trim()) {
      setPropertyData(prev => ({
        ...prev,
        uniqueFeatures: [...prev.uniqueFeatures, feature.trim()]
      }));
    }
  };

  const handleUniqueFeatureRemove = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      uniqueFeatures: prev.uniqueFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleSellingPointAdd = () => {
    const point = prompt('Enter a unique selling point:');
    if (point && point.trim()) {
      setPropertyData(prev => ({
        ...prev,
        uniqueSellingPoints: [...prev.uniqueSellingPoints, point.trim()]
      }));
    }
  };

  const handleSellingPointRemove = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      uniqueSellingPoints: prev.uniqueSellingPoints.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    if (!propertyData.title || !propertyData.location.city) {
      alert('Please fill in at least the property title and city.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/property/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyData,
          ...generationSettings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const result = await response.json();

      const newDescription = {
        id: Date.now(),
        description: result.description,
        wordCount: result.wordCount,
        platform: result.platform,
        tone: result.tone,
        timestamp: new Date().toISOString(),
        propertyData: { ...propertyData },
        settings: { ...generationSettings }
      };

      setGeneratedDescriptions(prev => [newDescription, ...prev]);
      setSelectedDescription(0);

      if (onDescriptionGenerated) {
        onDescriptionGenerated(result.description);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (description?: string) => {
    const textToCopy = description || (generatedDescriptions[selectedDescription]?.description || '');
    navigator.clipboard.writeText(textToCopy);
    alert('Description copied to clipboard!');
  };

  const saveDescription = () => {
    const currentDescription = generatedDescriptions[selectedDescription];
    if (currentDescription) {
      setSavedDescriptions(prev => [currentDescription, ...prev]);
      alert('Description saved successfully!');
    }
  };

  const loadSavedDescription = (index: number) => {
    const saved = savedDescriptions[index];
    if (saved) {
      setPropertyData(saved.propertyData);
      setGenerationSettings(saved.settings);
      setGeneratedDescriptions([saved]);
      setSelectedDescription(0);
    }
  };

  const deleteSavedDescription = (index: number) => {
    setSavedDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="property-description-generator max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Property Description Generator</h2>
        <p className="text-gray-600">Create compelling, SEO-optimized property descriptions with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Basic Property Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input
                  type="text"
                  value={propertyData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Beautiful 3BR Home in Suburb"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propertyData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propertyData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
                  <input
                    type="number"
                    value={propertyData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={propertyData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={propertyData.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={propertyData.location.province}
                    onChange={(e) => handleInputChange('location.province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Province"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={propertyData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Unique Features */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Unique Features</h3>
              <button
                onClick={handleUniqueFeatureAdd}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {propertyData.uniqueFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                  <span className="text-sm">{feature}</span>
                  <button
                    onClick={() => handleUniqueFeatureRemove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Generation Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => (
                    <label key={t.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={t.value}
                        checked={tone === t.value}
                        onChange={(e) => setTone(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium">{t.label}</span>
                        <p className="text-xs text-gray-500">{t.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {platforms.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <div className="space-y-2">
                  {lengthOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={opt.value}
                        checked={length === opt.value}
                        onChange={(e) => setLength(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="modern, spacious, garden, parking (comma-separated)"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              'Generate Description'
            )}
          </button>
        </div>

        {/* Generated Description */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generated Description</h3>
              {generatedDescription && (
                <button
                  onClick={() => copyToClipboard()}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Copy
                </button>
              )}
            </div>

            {generatedDescription ? (
              <div className="bg-white p-4 rounded border">
                <p className="text-gray-800 whitespace-pre-wrap">{generatedDescription}</p>
              </div>
            ) : (
              <div className="bg-white p-8 rounded border border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Your generated description will appear here</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Better Descriptions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about property features and location</li>
              <li>• Include unique selling points</li>
              <li>• Use keywords relevant to your target audience</li>
              <li>• Choose the right tone for your platform</li>
              <li>• Highlight amenities that matter most to buyers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescriptionGenerator;