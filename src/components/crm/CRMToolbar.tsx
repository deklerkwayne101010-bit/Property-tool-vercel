'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CRMToolbarProps {
  onAddContact: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onBulkActions: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedSource: string;
  onSourceChange: (value: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (value: string) => void;
  totalContacts: number;
  selectedContacts: number;
}

const CRMToolbar: React.FC<CRMToolbarProps> = ({
  onAddContact,
  onExportData,
  onImportData,
  onBulkActions,
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedSource,
  onSourceChange,
  selectedDateRange,
  onDateRangeChange,
  totalContacts,
  selectedContacts
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section - Search & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search contacts by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="lead">🌱 Leads</option>
              <option value="prospect">🎯 Prospects</option>
              <option value="client">✅ Clients</option>
            </select>

            <select
              value={selectedSource}
              onChange={(e) => onSourceChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Sources</option>
              <option value="website">🌐 Website</option>
              <option value="referral">🤝 Referral</option>
              <option value="social">📱 Social Media</option>
              <option value="open-house">🏠 Open House</option>
              <option value="advertisement">📢 Advertisement</option>
            </select>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Selection Info */}
          {selectedContacts > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                {selectedContacts} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkActions}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Bulk Actions
              </Button>
            </div>
          )}

          {/* Advanced Filters Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2 ${showAdvancedFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </Button>

          {/* Import/Export */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImportData}
              className="px-3 py-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="px-3 py-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
          </div>

          {/* Add Contact */}
          <Button
            variant="primary"
            size="lg"
            onClick={onAddContact}
            className="px-6 py-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (ZAR)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Ranges</option>
                <option value="0-1000000">R0 - R1M</option>
                <option value="1000000-3000000">R1M - R3M</option>
                <option value="3000000-5000000">R3M - R5M</option>
                <option value="5000000+">R5M+</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Tags</option>
                <option value="first-time-buyer">First Time Buyer</option>
                <option value="luxury">Luxury</option>
                <option value="family">Family</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            {/* Activity Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Activities</option>
                <option value="hot">🔥 Hot Leads</option>
                <option value="warm">🌡️ Warm</option>
                <option value="cold">❄️ Cold</option>
                <option value="inactive">💤 Inactive</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing {totalContacts} contacts
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All Filters
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Close Filters
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-6">
          <span>Total: <strong className="text-gray-900">{totalContacts}</strong></span>
          <span>Leads: <strong className="text-yellow-600">{Math.floor(totalContacts * 0.4)}</strong></span>
          <span>Prospects: <strong className="text-blue-600">{Math.floor(totalContacts * 0.35)}</strong></span>
          <span>Clients: <strong className="text-green-600">{Math.floor(totalContacts * 0.25)}</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live updates</span>
        </div>
      </div>
    </div>
  );
};

export default CRMToolbar;