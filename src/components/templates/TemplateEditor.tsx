'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Template {
  id?: string;
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
  metadata: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    format: string;
  };
}

interface PropertyData {
  title: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  features: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

interface TemplateEditorProps {
  templateId?: string;
  initialData?: PropertyData;
}

export default function TemplateEditor({ templateId, initialData }: TemplateEditorProps) {
  const [template, setTemplate] = useState<Template>({
    name: '',
    description: '',
    category: 'residential',
    content: {
      html: '',
      css: '',
      variables: {}
    },
    tags: [],
    isPublic: false,
    metadata: {
      width: 800,
      height: 600,
      orientation: 'landscape',
      format: 'image'
    }
  });

  const [propertyData, setPropertyData] = useState<PropertyData>(initialData || {
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    garages: '',
    erfSize: '',
    floorSize: '',
    features: [],
    agentName: '',
    agentPhone: '',
    agentEmail: ''
  });

  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'preview'>('design');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      // Load default template
      loadDefaultTemplate();
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplate(data.template);
      } else {
        setMessage('Failed to load template');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      setMessage('Failed to load template');
    }
  };

  const loadDefaultTemplate = () => {
    // Default property marketing template
    const defaultTemplate: Template = {
      name: 'Modern Property Flyer',
      description: 'A clean, modern template for property marketing',
      category: 'flyer',
      content: {
        html: `
          <div class="property-flyer">
            <div class="header">
              <h1>{{title}}</h1>
              <div class="price">{{price}}</div>
            </div>
            <div class="image-gallery">
              <div class="main-image">
                <img src="{{mainImage}}" alt="Property" />
              </div>
              <div class="thumbnail-images">
                {{#each images}}
                <img src="{{this}}" alt="Property" />
                {{/each}}
              </div>
            </div>
            <div class="property-details">
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">{{location}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Bedrooms:</span>
                <span class="value">{{bedrooms}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Bathrooms:</span>
                <span class="value">{{bathrooms}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Garages:</span>
                <span class="value">{{garages}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Erf Size:</span>
                <span class="value">{{erfSize}} m²</span>
              </div>
              <div class="detail-row">
                <span class="label">Floor Size:</span>
                <span class="value">{{floorSize}} m²</span>
              </div>
            </div>
            <div class="features">
              <h3>Key Features</h3>
              <ul>
                {{#each features}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            <div class="agent-info">
              <h3>Contact Agent</h3>
              <div class="agent-details">
                <div class="agent-name">{{agentName}}</div>
                <div class="agent-contact">
                  <div>Phone: {{agentPhone}}</div>
                  <div>Email: {{agentEmail}}</div>
                </div>
              </div>
            </div>
          </div>
        `,
        css: `
          .property-flyer {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }

          .header h1 {
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }

          .price {
            font-size: 24px;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
          }

          .image-gallery {
            padding: 20px;
          }

          .main-image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
          }

          .thumbnail-images {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }

          .thumbnail-images img {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }

          .property-details {
            padding: 20px;
            background: #f8f9fa;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }

          .detail-row:last-child {
            border-bottom: none;
          }

          .label {
            font-weight: bold;
            color: #495057;
          }

          .value {
            color: #007bff;
            font-weight: 500;
          }

          .features {
            padding: 20px;
          }

          .features h3 {
            color: #495057;
            margin-bottom: 15px;
            font-size: 18px;
          }

          .features ul {
            list-style: none;
            padding: 0;
          }

          .features li {
            padding: 5px 0;
            position: relative;
            padding-left: 20px;
          }

          .features li:before {
            content: '✓';
            color: #28a745;
            font-weight: bold;
            position: absolute;
            left: 0;
          }

          .agent-info {
            background: #343a40;
            color: white;
            padding: 20px;
            text-align: center;
          }

          .agent-info h3 {
            margin-bottom: 15px;
            font-size: 18px;
          }

          .agent-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .agent-contact div {
            margin: 5px 0;
          }
        `,
        variables: {}
      },
      tags: ['modern', 'flyer', 'property'],
      isPublic: false,
      metadata: {
        width: 800,
        height: 600,
        orientation: 'portrait',
        format: 'image'
      }
    };

    setTemplate(defaultTemplate);
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePropertyDataChange = (field: string, value: string | string[]) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScrapeProperty = async () => {
    if (!propertyData.title && !propertyData.location) {
      setMessage('Please enter a property title or location to search');
      return;
    }

    setIsLoading(true);
    setMessage('');

    // For demo purposes, we'll simulate scraping
    // In a real implementation, this would search for properties
    setTimeout(() => {
      setPropertyData({
        title: 'Luxury 3-Bedroom Apartment',
        price: 'R 2,850,000',
        location: 'Cape Town, Western Cape',
        bedrooms: '3',
        bathrooms: '2',
        garages: '1',
        erfSize: '150',
        floorSize: '120',
        features: ['Sea View', 'Modern Kitchen', 'Solar Panels', 'Security Estate'],
        agentName: 'Sarah Johnson',
        agentPhone: '+27 21 555 0123',
        agentEmail: 'sarah@luxuryproperties.co.za'
      });
      setIsLoading(false);
      setMessage('Property data loaded successfully');
    }, 2000);
  };

  const saveTemplate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const method = template.id ? 'PUT' : 'POST';
      const url = template.id ? `/api/templates/${template.id}` : '/api/templates';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        const data = await response.json();
        if (!template.id) {
          setTemplate(prev => ({ ...prev, id: data.template.id }));
        }
        setMessage('Template saved successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (!previewRef.current) return;

    // Simple template rendering (in a real app, you'd use a proper template engine)
    let html = template.content.html;

    // Replace variables with property data
    Object.keys(propertyData).forEach(key => {
      const value = propertyData[key as keyof PropertyData];
      if (Array.isArray(value)) {
        // Handle arrays (like features)
        const regex = new RegExp(`{{#each ${key}}}(.*?){{/each}}`, 'gs');
        html = html.replace(regex, (match, content) => {
          return value.map(item => content.replace(/{{this}}/g, item)).join('');
        });
      } else {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    });

    // Add some default images if none provided
    html = html.replace(/{{mainImage}}/g, 'https://via.placeholder.com/800x400/667eea/white?text=Property+Image');
    html = html.replace(/{{#each images}}(.*?){{\/each}}/g, '');

    previewRef.current.innerHTML = html;

    // Add CSS
    const style = document.createElement('style');
    style.textContent = template.content.css;
    previewRef.current.appendChild(style);
  };

  useEffect(() => {
    if (activeTab === 'preview') {
      renderPreview();
    }
  }, [activeTab, template, propertyData]);

  const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'flyer', label: 'Flyer' },
    { value: 'brochure', label: 'Brochure' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'website', label: 'Website' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {template.id ? 'Edit Template' : 'Create Template'}
                </h1>
                <p className="text-gray-600">Design and customize your property marketing templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </Button>
              <Button
                onClick={saveTemplate}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Settings */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <Input
                    type="text"
                    value={template.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your template"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={template.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <Input
                    type="text"
                    value={template.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="modern, flyer, property"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={template.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                    Make template public
                  </label>
                </div>
              </div>
            </Card>

            {/* Property Data */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Data</h2>

              <div className="space-y-4">
                <Button
                  onClick={handleScrapeProperty}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? 'Loading...' : 'Load Sample Data'}
                </Button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title
                  </label>
                  <Input
                    type="text"
                    value={propertyData.title}
                    onChange={(e) => handlePropertyDataChange('title', e.target.value)}
                    placeholder="Luxury 3-Bedroom Apartment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <Input
                    type="text"
                    value={propertyData.price}
                    onChange={(e) => handlePropertyDataChange('price', e.target.value)}
                    placeholder="R 2,850,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={propertyData.location}
                    onChange={(e) => handlePropertyDataChange('location', e.target.value)}
                    placeholder="Cape Town, Western Cape"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Editor/Preview */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'design', name: 'Design' },
                    { id: 'content', name: 'Content' },
                    { id: 'preview', name: 'Preview' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'design' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Design</h2>
                <div className="text-center py-12 text-gray-500">
                  <p>Design tools will be available here</p>
                  <p className="text-sm mt-2">Drag and drop elements, customize colors, fonts, and layouts</p>
                </div>
              </Card>
            )}

            {activeTab === 'content' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Content</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HTML Template
                    </label>
                    <textarea
                      value={template.content.html}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          html: e.target.value
                        }
                      }))}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your HTML template..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSS Styles
                    </label>
                    <textarea
                      value={template.content.css}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          css: e.target.value
                        }
                      }))}
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your CSS styles..."
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'preview' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h2>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    ref={previewRef}
                    className="min-h-96 p-4"
                    style={{
                      width: template.metadata.width,
                      height: template.metadata.height,
                      margin: '0 auto'
                    }}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>Preview dimensions: {template.metadata.width} × {template.metadata.height}px</p>
                  <p>Use variables like {'{{title}}'}, {'{{price}}'}, {'{{location}}'} in your template</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Message */}
      {message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          message.includes('success')
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}