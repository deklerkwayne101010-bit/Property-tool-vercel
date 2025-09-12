'use client';

import React from 'react';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
}

interface TemplatePanelProps {
  onSelectTemplate: (templateId: string) => void;
}

const TemplatePanel: React.FC<TemplatePanelProps> = ({ onSelectTemplate }) => {
  const templates: Template[] = [
    {
      id: 'modern-living',
      name: 'Modern Living Room',
      category: 'Living Room',
      thumbnail: '/templates/modern-living.jpg',
      description: 'Contemporary furniture and clean lines'
    },
    {
      id: 'cozy-bedroom',
      name: 'Cozy Master Bedroom',
      category: 'Bedroom',
      thumbnail: '/templates/cozy-bedroom.jpg',
      description: 'Warm and inviting bedroom setup'
    },
    {
      id: 'luxury-kitchen',
      name: 'Luxury Kitchen',
      category: 'Kitchen',
      thumbnail: '/templates/luxury-kitchen.jpg',
      description: 'High-end appliances and finishes'
    },
    {
      id: 'minimalist-office',
      name: 'Home Office',
      category: 'Office',
      thumbnail: '/templates/minimalist-office.jpg',
      description: 'Productive workspace design'
    },
    {
      id: 'family-dining',
      name: 'Family Dining',
      category: 'Dining',
      thumbnail: '/templates/family-dining.jpg',
      description: 'Welcoming dining area setup'
    },
    {
      id: 'spa-bathroom',
      name: 'Spa Bathroom',
      category: 'Bathroom',
      thumbnail: '/templates/spa-bathroom.jpg',
      description: 'Relaxing bathroom oasis'
    }
  ];

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  return (
    <div className="template-panel bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Templates</h3>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="cursor-pointer group"
          >
            <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
              {/* Placeholder for template thumbnail */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h4>
            <p className="text-xs text-gray-500">{template.description}</p>
          </div>
        ))}
      </div>

      {/* Custom Template Upload */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Templates</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-500">Upload your own template</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;