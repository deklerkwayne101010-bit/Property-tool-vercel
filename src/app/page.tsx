'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Card, { Header as CardHeader, Content as CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Dynamically import components to avoid SSR issues
const CanvasEditor = dynamic(() => import('@/components/editor/CanvasEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      <p className="text-gray-600 animate-pulse">Loading Template Editor...</p>
    </div>
  )
});

const PropertyDescriptionGenerator = dynamic(() => import('@/components/property/PropertyDescriptionGenerator'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      <p className="text-gray-600 animate-pulse">Loading AI Description Generator...</p>
    </div>
  )
});

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<'editor' | 'description' | null>(null);

  const handleSave = (canvas: unknown) => {
    console.log('Canvas saved:', canvas);
    // TODO: Implement save functionality
  };

  const handleDescriptionGenerated = (description: string) => {
    console.log('Description generated:', description);
    // TODO: Handle generated description (maybe copy to clipboard or save)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-red-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            PropertyPro
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Transform your property marketing with AI-powered tools designed for real estate professionals
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setActiveFeature('description')}
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🚀 Generate AI Description
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setActiveFeature('editor')}
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🎨 Open Template Editor
            </Button>
          </div>
        </div>

        {/* Main Features Grid */}
        {!activeFeature && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* AI Description Generator Card */}
            <Card
              variant="gradient"
              hover
              className="h-full animate-slide-in cursor-pointer group"
              onClick={() => setActiveFeature('description')}
            >
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    AI Powered
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Description Generator</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Create compelling, SEO-optimized property descriptions in seconds using advanced AI technology.
                  Perfect for real estate listings, social media, and marketing materials.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Multiple tone options (Professional, Casual, Luxury)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Platform-specific optimization (Zillow, Realtor.com, etc.)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Custom keywords and length control</span>
                  </div>
                </div>
                <Button variant="primary" size="lg" className="w-full group-hover:bg-red-700 transition-colors duration-200">
                  Start Generating →
                </Button>
              </CardContent>
            </Card>

            {/* Template Editor Card */}
            <Card
              variant="gradient"
              hover
              className="h-full animate-slide-in cursor-pointer group"
              style={{ animationDelay: '0.2s' }}
              onClick={() => setActiveFeature('editor')}
            >
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                    Design Studio
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Editor</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Design stunning property marketing materials with our intuitive drag-and-drop editor.
                  Includes virtual staging, image filters, and professional templates.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Drag-and-drop interface with professional templates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">AI-powered image enhancement and filters</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Virtual staging and background removal</span>
                  </div>
                </div>
                <Button variant="secondary" size="lg" className="w-full group-hover:bg-teal-700 transition-colors duration-200">
                  Start Designing →
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Feature Display */}
        {activeFeature && (
          <div className="animate-fade-in">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setActiveFeature(null)}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Features</span>
              </Button>
            </div>

            {/* Feature Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-8">
                {activeFeature === 'editor' && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Template Editor</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create professional property marketing materials with our intuitive design studio
                      </p>
                    </div>
                    <CanvasEditor
                      width={1000}
                      height={600}
                      onSave={handleSave}
                    />
                  </div>
                )}

                {activeFeature === 'description' && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Description Generator</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Generate compelling property descriptions optimized for any platform
                      </p>
                    </div>
                    <PropertyDescriptionGenerator
                      onDescriptionGenerated={handleDescriptionGenerated}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Features Preview */}
        {!activeFeature && (
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">More Powerful Features</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover additional tools to supercharge your property marketing workflow
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-gray-600 text-sm">Generate content in seconds with our optimized AI</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                <p className="text-gray-600 text-sm">Work together in real-time on property campaigns</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h4>
                <p className="text-gray-600 text-sm">Track performance and optimize your marketing</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
