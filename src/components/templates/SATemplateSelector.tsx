'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  reviews: number;
  metadata: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    format: string;
  };
  author: {
    name: string;
  };
}

interface SATemplateSelectorProps {
  onSelectTemplate?: (template: Template) => void;
  showCreateNew?: boolean;
}

export default function SATemplateSelector({ onSelectTemplate, showCreateNew = true }: SATemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, selectedSort]);

  const loadTemplates = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch('/api/templates?public=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      } else {
        console.error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Sort templates
    switch (selectedSort) {
      case 'popular':
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      // Navigate to editor with template
      router.push(`/templates/editor?id=${template.id}`);
    }
  };

  const handleCreateNew = () => {
    router.push('/templates/editor');
  };

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'flyer', label: 'Flyers' },
    { value: 'brochure', label: 'Brochures' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'website', label: 'Website' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'name', label: 'Name A-Z' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Marketing Templates</h2>
          <p className="text-gray-600 mt-1">
            Choose from our collection of professionally designed templates tailored for the South African property market
          </p>
        </div>
        {showCreateNew && (
          <Button onClick={handleCreateNew} className="flex items-center space-x-2">
            <span>+</span>
            <span>Create New Template</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Templates
            </label>
            <Input
              type="text"
              placeholder="Search by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </Card>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Be the first to create a template for this category'
              }
            </p>
            {showCreateNew && (
              <Button onClick={handleCreateNew}>
                Create Your First Template
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
              {/* Template Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm">Preview</div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{template.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span>⭐ {template.rating.toFixed(1)}</span>
                    <span>👁️ {template.usageCount}</span>
                  </div>
                  <span className="capitalize">{template.category.replace('-', ' ')}</span>
                </div>

                {/* Author */}
                <div className="text-xs text-gray-500">
                  By {template.author.name}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full"
                  size="sm"
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* South African Specific Templates Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            🇿🇦 South African Property Templates
          </h3>
          <p className="text-gray-600 mb-4">
            Our templates are specifically designed for the South African property market,
            including local terminology, currency formatting, and regional preferences.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-900">ZAR Currency</div>
              <div className="text-gray-600">R 2,500,000 format</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-900">Local Areas</div>
              <div className="text-gray-600">Cape Town, JHB, Durban</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-900">Estate Terms</div>
              <div className="text-gray-600">Security estates, complexes</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-900">Legal Compliance</div>
              <div className="text-gray-600">POPI Act compliant</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}