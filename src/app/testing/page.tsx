'use client';

import React from 'react';
import TestDashboard from '@/components/testing/TestDashboard';

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Testing Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Test and validate all PropertyPro features
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <TestDashboard />
        </div>
      </main>
    </div>
  );
}