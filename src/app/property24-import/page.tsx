'use client';

import React from 'react';
import Property24Import from '@/components/property/Property24Import';

export default function Property24ImportPage() {
  const handlePropertyImported = (property: any) => {
    console.log('Property imported:', property);
    // You can add additional logic here, like showing a success message
    // or redirecting to the property details page
  };

  const handlePropertySaved = (propertyId: string) => {
    console.log('Property saved with ID:', propertyId);
    // You can add logic here to redirect to the property details page
    // or show a success message
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Property24 Smart Import
          </h1>
          <p className="text-lg text-gray-600">
            Import property listings from Property24 with just a URL. Automatically extract all property details,
            images, agent information, and features.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-gray-900">Lightning Fast Import</h2>
              <p className="text-sm text-gray-500">Extract complete property data in seconds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Property Details
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Agent Information
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              High-Quality Images
            </div>
          </div>
        </div>

        <Property24Import
          onPropertyImported={handlePropertyImported}
          onPropertySaved={handlePropertySaved}
        />

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How it works</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Paste any Property24 property URL in the field above</li>
                  <li>Click &ldquo;Import Property&rdquo; to automatically extract all data</li>
                  <li>Review the imported information and save to your database</li>
                  <li>Use the data for marketing materials, CRM, or property listings</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Check our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              documentation
            </a>{' '}
            or{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}