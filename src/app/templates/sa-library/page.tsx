'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SATemplateSelector from '@/components/templates/SATemplateSelector';
import { SATemplate } from '@/lib/south-african-templates';

export default function SATemplateLibraryPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<SATemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (template: SATemplate) => {
    setSelectedTemplate(template);
    // Here you could navigate to a template editor or apply the template
    console.log('Selected template:', template);
  };

  const handleTemplatePreview = (template: SATemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to template editor with the selected template
      router.push(`/templates/editor?template=${selectedTemplate.id}`);
    }
  };

  const handleCreateCustom = () => {
    router.push('/templates/editor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                South African Template Library
              </h1>
              <p className="text-lg text-gray-600">
                Pre-built templates designed specifically for the South African real estate market
              </p>
            </div>
            <button
              onClick={handleCreateCustom}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Custom Template
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🇿🇦</div>
                <div>
                  <h3 className="font-semibold">Local Market Knowledge</h3>
                  <p className="text-sm text-gray-600">Templates built with South African real estate expertise</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📍</div>
                <div>
                  <h3 className="font-semibold">Province-Specific</h3>
                  <p className="text-sm text-gray-600">Optimized for different South African provinces</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🎯</div>
                <div>
                  <h3 className="font-semibold">Target Market Focus</h3>
                  <p className="text-sm text-gray-600">Tailored for families, investors, students, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Selector */}
        <SATemplateSelector
          onTemplateSelect={handleTemplateSelect}
          onTemplatePreview={handleTemplatePreview}
        />

        {/* Template Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Template Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Template Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium capitalize">{selectedTemplate.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{selectedTemplate.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Province:</span>
                          <span className="font-medium">
                            {selectedTemplate.province === 'all' ? 'All Provinces' :
                             selectedTemplate.province.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price Range:</span>
                          <span className="font-medium capitalize">
                            {selectedTemplate.priceRange.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Market:</span>
                          <span className="font-medium capitalize">
                            {selectedTemplate.targetMarket.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="text-sm space-y-1">
                        {selectedTemplate.template.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Highlights</h4>
                      <ul className="text-sm space-y-1">
                        {selectedTemplate.template.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Template Content Preview */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Content Preview</h3>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-96 overflow-y-auto">
                        <div className="font-medium mb-2">{selectedTemplate.template.title}</div>
                        <div className="whitespace-pre-line">
                          {selectedTemplate.template.description}
                        </div>
                        <div className="mt-4 font-medium text-blue-600">
                          {selectedTemplate.template.callToAction}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Sample Variables</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {Object.entries(selectedTemplate.variables).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1">
                            <span className="text-gray-600">{'{' + key + '}'}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Need a Custom Template?</h3>
            <p className="text-gray-600 mb-4">
              Our templates are designed for the South African market, but we can create custom templates
              for your specific needs and branding requirements.
            </p>
            <button
              onClick={handleCreateCustom}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Custom Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}