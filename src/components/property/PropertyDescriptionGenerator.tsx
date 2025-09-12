'use client';

import React, { useState } from 'react';

interface PropertyData {
  title: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  amenities: string[];
  uniqueFeatures: string[];
}

interface PropertyDescriptionGeneratorProps {
  onDescriptionGenerated?: (description: string) => void;
}

const PropertyDescriptionGenerator: React.FC<PropertyDescriptionGeneratorProps> = ({
  onDescriptionGenerated
}) => {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    title: '',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    location: {
      address: '',
      city: '',
      state: ''
    },
    amenities: [],
    uniqueFeatures: []
  });

  const [tone, setTone] = useState<string>('professional');
  const [platform, setPlatform] = useState<string>('Property24');
  const [keywords, setKeywords] = useState<string>('');
  const [length, setLength] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDescription, setGeneratedDescription] = useState<string>('');

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Formal and trustworthy' },
    { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and exciting' },
    { value: 'luxury', label: 'Luxury', description: 'Premium and sophisticated' }
  ];

  const platforms = [
    { value: 'Property24', label: 'Property24' },
    { value: 'Zillow', label: 'Zillow' },
    { value: 'Rightmove', label: 'Rightmove' },
    { value: 'Facebook Marketplace', label: 'Facebook Marketplace' },
    { value: 'Craigslist', label: 'Craigslist' }
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short (50-100 words)', words: '50-100' },
    { value: 'medium', label: 'Medium (100-200 words)', words: '100-200' },
    { value: 'long', label: 'Long (200-300 words)', words: '200-300' }
  ];

  const commonAmenities = [
    'Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Security System',
    'Walk-in Closet', 'Hardwood Floors', 'Stainless Steel Appliances', 'Granite Countertops',
    'Fireplace', 'Balcony', 'Gym', 'Parking', 'Laundry Room'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPropertyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PropertyData] as any,
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

  const handleGenerate = async () => {
    if (!propertyData.title || !propertyData.location.city) {
      alert('Please fill in at least the property title and city.');
      return;
    }

    setIsGenerating(true);

    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);

      const response = await fetch('/api/property/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyData,
          tone,
          platform,
          keywords: keywordArray,
          length: lengthOptions.find(opt => opt.value === length)?.words || '100-200'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const result = await response.json();
      setGeneratedDescription(result.description);

      if (onDescriptionGenerated) {
        onDescriptionGenerated(result.description);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    alert('Description copied to clipboard!');
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
                    value={propertyData.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State/Province"
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
                  onClick={copyToClipboard}
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