'use client';

import React from 'react';

interface FilterPanelProps {
  onApplyFilter: (filterType: string, value?: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter }) => {
  const filters = [
    { name: 'Brightness', type: 'brightness', min: -100, max: 100, default: 0 },
    { name: 'Contrast', type: 'contrast', min: -100, max: 100, default: 0 },
    { name: 'Saturation', type: 'saturation', min: -100, max: 100, default: 0 },
    { name: 'Hue', type: 'hue', min: -180, max: 180, default: 0 },
    { name: 'Blur', type: 'blur', min: 0, max: 10, default: 0 },
    { name: 'Sepia', type: 'sepia', min: 0, max: 100, default: 0 },
  ];

  const presetFilters = [
    { name: 'None', type: 'none' },
    { name: 'Vintage', type: 'vintage' },
    { name: 'BW', type: 'blackwhite' },
    { name: 'Cool', type: 'cool' },
    { name: 'Warm', type: 'warm' },
    { name: 'Dramatic', type: 'dramatic' },
  ];

  return (
    <div className="filter-panel bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Preset Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        <div className="grid grid-cols-3 gap-2">
          {presetFilters.map((filter) => (
            <button
              key={filter.type}
              onClick={() => onApplyFilter(filter.type)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Adjustments</h4>
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.type} className="flex items-center space-x-3">
              <label className="text-sm text-gray-600 w-20">{filter.name}</label>
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                defaultValue={filter.default}
                onChange={(e) => onApplyFilter(filter.type, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500 w-8 text-right">{filter.default}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6">
        <button
          onClick={() => onApplyFilter('reset')}
          className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;