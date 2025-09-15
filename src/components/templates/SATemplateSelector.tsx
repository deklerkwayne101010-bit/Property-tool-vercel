'use client';

import React, { useState, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { SATemplateManager, SATemplate } from '@/lib/south-african-templates';

interface SATemplateSelectorProps {
  onTemplateSelect?: (template: SATemplate) => void;
  onTemplatePreview?: (template: SATemplate) => void;
  selectedCategory?: string;
  selectedProvince?: string;
}

export default function SATemplateSelector({
  onTemplateSelect,
  onTemplatePreview,
  selectedCategory,
  selectedProvince
}: SATemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || 'all');
  const [provinceFilter, setProvinceFilter] = useState(selectedProvince || 'all');
  const [priceRangeFilter, setPriceRangeFilter] = useState('all');
  const [targetMarketFilter, setTargetMarketFilter] = useState('all');

  // Get filter options
  const categories = useMemo(() => ['all', ...SATemplateManager.getCategories()], []);
  const provinces = useMemo(() => ['all', ...SATemplateManager.getProvinces()], []);
  const priceRanges = useMemo(() => ['all', ...SATemplateManager.getPriceRanges()], []);
  const targetMarkets = useMemo(() => ['all', ...SATemplateManager.getTargetMarkets()], []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let templates = SATemplateManager.searchTemplates(searchQuery);

    if (categoryFilter !== 'all') {
      templates = templates.filter(t => t.category === categoryFilter);
    }

    if (provinceFilter !== 'all') {
      templates = templates.filter(t => t.province === provinceFilter || t.province === 'all');
    }

    if (priceRangeFilter !== 'all') {
      templates = templates.filter(t => t.priceRange === priceRangeFilter);
    }

    if (targetMarketFilter !== 'all') {
      templates = templates.filter(t => t.targetMarket === targetMarketFilter);
    }

    return templates;
  }, [searchQuery, categoryFilter, provinceFilter, priceRangeFilter, targetMarketFilter]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      residential: '🏠',
      commercial: '🏢',
      vacant_land: '🌱',
      student: '🎓',
      retirement: '👴',
      luxury: '💎'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  const getProvinceName = (province: string) => {
    const names = {
      western_cape: 'Western Cape',
      gauteng: 'Gauteng',
      kwazulu_natal: 'KwaZulu-Natal',
      eastern_cape: 'Eastern Cape',
      limpopo: 'Limpopo',
      mpumalanga: 'Mpumalanga',
      north_west: 'North West',
      northern_cape: 'Northern Cape',
      free_state: 'Free State',
      all: 'All Provinces'
    };
    return names[province as keyof typeof names] || province;
  };

  const getPriceRangeColor = (priceRange: string) => {
    const colors = {
      budget: 'bg-green-100 text-green-800',
      affordable: 'bg-blue-100 text-blue-800',
      mid_range: 'bg-yellow-100 text-yellow-800',
      premium: 'bg-purple-100 text-purple-800',
      luxury: 'bg-red-100 text-red-800'
    };
    return colors[priceRange as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTargetMarketIcon = (targetMarket: string) => {
    const icons = {
      families: '👨‍👩‍👧‍👦',
      professionals: '💼',
      investors: '📈',
      students: '🎓',
      retirees: '🏖️',
      expats: '✈️'
    };
    return icons[targetMarket as keyof typeof icons] || '👥';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Templates
            </label>
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or location..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {provinces.map(province => (
                  <option key={province} value={province}>
                    {getProvinceName(province)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                value={priceRangeFilter}
                onChange={(e) => setPriceRangeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    {range === 'all' ? 'All Ranges' : range.charAt(0).toUpperCase() + range.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Market
              </label>
              <select
                value={targetMarketFilter}
                onChange={(e) => setTargetMarketFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {targetMarkets.map(market => (
                  <option key={market} value={market}>
                    {market === 'all' ? 'All Markets' : market.charAt(0).toUpperCase() + market.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredTemplates.length} templates found</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setProvinceFilter('all');
                setPriceRangeFilter('all');
                setTargetMarketFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(template.category)}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-gray-600">{getProvinceName(template.province)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriceRangeColor(template.priceRange)}`}>
                  {template.priceRange.replace('_', ' ')}
                </span>
              </div>

              {/* Preview Image */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm">Template Preview</div>
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{template.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Target:</span>
                  <div className="flex items-center space-x-1">
                    <span>{getTargetMarketIcon(template.targetMarket)}</span>
                    <span className="font-medium capitalize">
                      {template.targetMarket.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium text-green-600">{template.preview.estimatedValue}</span>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-700 line-clamp-3">
                {template.template.description.substring(0, 120)}...
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {template.template.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {feature.length > 20 ? feature.substring(0, 17) + '...' : feature}
                  </span>
                ))}
                {template.template.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{template.template.features.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={() => onTemplatePreview?.(template)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Preview
                </Button>
                <Button
                  onClick={() => onTemplateSelect?.(template)}
                  size="sm"
                  className="flex-1"
                >
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more templates.
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setProvinceFilter('all');
              setPriceRangeFilter('all');
              setTargetMarketFilter('all');
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Template Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Template Library Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {SATemplateManager.getCategories().length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {SATemplateManager.getProvinces().length}
            </div>
            <div className="text-sm text-gray-600">Provinces</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {SATemplateManager.getPriceRanges().length}
            </div>
            <div className="text-sm text-gray-600">Price Ranges</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {SATemplateManager.getTargetMarkets().length}
            </div>
            <div className="text-sm text-gray-600">Target Markets</div>
          </div>
        </div>
      </Card>
    </div>
  );
}