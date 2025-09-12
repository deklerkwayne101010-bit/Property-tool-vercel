'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Card, { Header as CardHeader, Content as CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Dynamically import components to avoid SSR issues
const CanvasEditor = dynamic(() => import('@/components/editor/CanvasEditor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">Loading editor...</div>
});

const PropertyDescriptionGenerator = dynamic(() => import('@/components/property/PropertyDescriptionGenerator'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">Loading generator...</div>
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'editor' | 'description'>('editor');

  const handleSave = (canvas: unknown) => {
    console.log('Canvas saved:', canvas);
    // TODO: Implement save functionality
  };

  const handleDescriptionGenerated = (description: string) => {
    console.log('Description generated:', description);
    // TODO: Handle generated description (maybe copy to clipboard or save)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">
              Welcome to PropertyPro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create stunning property marketing materials with our AI-powered Canva-style editor.
              Generate SEO-optimized descriptions, enhance images, and manage your real estate business all in one place.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="gradient" hover className="animate-slide-in">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI Description Generator</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Generate compelling, SEO-optimized property descriptions with AI</p>
                <Button variant="primary" size="sm" className="mt-4">
                  Try Now
                </Button>
              </CardContent>
            </Card>

            <Card variant="gradient" hover className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Image Enhancement</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Upscale, remove backgrounds, and enhance property photos with AI</p>
                <Button variant="secondary" size="sm" className="mt-4">
                  Enhance Now
                </Button>
              </CardContent>
            </Card>

            <Card variant="gradient" hover className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">CRM & Calendar</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage contacts, schedule showings, and track leads efficiently</p>
                <Button variant="ghost" size="sm" className="mt-4">
                  Manage CRM
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('editor')}
                className={`pb-2 font-medium text-sm ${
                  activeTab === 'editor'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎨 Canva-Style Editor
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📝 AI Description Generator
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'editor' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Property Image Editor</h3>
                  <p className="text-gray-600 mt-1">Create stunning property marketing materials with drag-and-drop tools, AI enhancements, and real-time collaboration</p>
                </div>
                <CanvasEditor
                  width={1000}
                  height={600}
                  onSave={handleSave}
                />
              </div>
            )}

            {activeTab === 'description' && (
              <PropertyDescriptionGenerator
                onDescriptionGenerated={handleDescriptionGenerated}
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Generate Property Description
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Enhance Property Images
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Create Virtual Staging
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Schedule Property Showing
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Property description generated for 123 Main St</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Image enhanced for Downtown Condo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New contact added to CRM</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
