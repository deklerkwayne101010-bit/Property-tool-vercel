'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function TemplateEditorPage() {
  const [templateName, setTemplateName] = useState('');
  const [selectedSize, setSelectedSize] = useState('A4');
  const [selectedTemplate, setSelectedTemplate] = useState('property-card');

  const templateSizes = [
    { id: 'A4', name: 'A4 Portrait', dimensions: '210 × 297 mm' },
    { id: 'letter', name: 'Letter', dimensions: '8.5 × 11 in' },
    { id: 'social', name: 'Social Media', dimensions: '1200 × 630 px' },
    { id: 'square', name: 'Square', dimensions: '1080 × 1080 px' }
  ];

  const templateTypes = [
    { id: 'property-card', name: 'Property Card', icon: '🏠' },
    { id: 'flyer', name: 'Marketing Flyer', icon: '📄' },
    { id: 'brochure', name: 'Brochure', icon: '📖' },
    { id: 'social-post', name: 'Social Media Post', icon: '📱' },
    { id: 'email', name: 'Email Template', icon: '📧' }
  ];

  const elements = [
    { id: 'text', name: 'Text', icon: '📝' },
    { id: 'image', name: 'Image', icon: '🖼️' },
    { id: 'shape', name: 'Shape', icon: '⬜' },
    { id: 'icon', name: 'Icon', icon: '⭐' },
    { id: 'button', name: 'Button', icon: '🔘' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Template Editor
          </h1>
          <p className="text-lg text-gray-600">
            Create stunning marketing materials with our drag-and-drop template editor designed for South African real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Template Settings */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <Input
                    type="text"
                    placeholder="My Property Template"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="space-y-2">
                    {templateSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          selectedSize === size.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{size.name}</div>
                        <div className="text-xs text-gray-500">{size.dimensions}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Template Types */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Type</h3>
              <div className="space-y-2">
                {templateTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTemplate(type.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg border transition-colors ${
                      selectedTemplate === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-3">{type.icon}</span>
                    <span className="text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Elements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Elements</h3>
              <div className="space-y-2">
                {elements.map((element) => (
                  <button
                    key={element.id}
                    className="w-full flex items-center px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <span className="mr-3">{element.icon}</span>
                    <span className="text-sm">{element.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Canvas</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Preview</Button>
                  <Button variant="outline" size="sm">Save</Button>
                  <Button size="sm">Export</Button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <div
                  className="bg-gray-50 flex items-center justify-center"
                  style={{
                    aspectRatio: selectedSize === 'A4' ? '210/297' :
                                selectedSize === 'letter' ? '8.5/11' :
                                selectedSize === 'social' ? '1200/630' : '1/1',
                    minHeight: '500px'
                  }}
                >
                  <div className="text-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <p className="text-lg font-medium mb-2">Start Creating</p>
                    <p className="text-sm">Drag elements from the sidebar to begin designing your template</p>
                  </div>
                </div>

                {/* Canvas Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    <span className="text-sm">🔍</span>
                  </button>
                  <button className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    <span className="text-sm">⚙️</span>
                  </button>
                </div>
              </div>

              {/* Canvas Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>
                  Size: {templateSizes.find(s => s.id === selectedSize)?.name} •
                  Template: {templateTypes.find(t => t.id === selectedTemplate)?.name}
                </div>
                <div>
                  Last saved: Never
                </div>
              </div>
            </Card>

            {/* Property Data Panel */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title
                  </label>
                  <Input placeholder="Enter property title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <Input placeholder="R 2,500,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <Input placeholder="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <Input placeholder="2" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter property description..."
                />
              </div>

              <div className="mt-4">
                <Button className="w-full">
                  Load from Property24
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}