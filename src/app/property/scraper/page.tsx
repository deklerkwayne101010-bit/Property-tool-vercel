'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WebScraperInterface from '@/components/property/WebScraperInterface';
import TemplateEditor from '@/components/templates/TemplateEditor';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ScrapedProperty {
  title: string;
  price: string;
  description: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  features: string[];
  images: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  listingUrl: string;
  source: string;
}

export default function PropertyScraperPage() {
  const [scrapedData, setScrapedData] = useState<ScrapedProperty | null>(null);
  const [userCredits, setUserCredits] = useState(5); // Default credits
  const [activeTab, setActiveTab] = useState<'scraper' | 'editor'>('scraper');
  const router = useRouter();

  // Load user credits on component mount
  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserCredits(user.credits || 0);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleDataScraped = (data: ScrapedProperty) => {
    setScrapedData(data);
    setActiveTab('editor');

    // Update credits after successful scrape
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        user.credits = (user.credits || 0) - 1;
        localStorage.setItem('user', JSON.stringify(user));
        setUserCredits(user.credits);
      } catch (error) {
        console.error('Error updating user credits:', error);
      }
    }
  };

  const convertScrapedDataToPropertyData = (data: ScrapedProperty) => {
    return {
      title: data.title,
      price: data.price,
      location: data.location,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      garages: data.garages,
      erfSize: data.erfSize,
      floorSize: data.floorSize,
      features: data.features,
      agentName: data.agentName,
      agentPhone: data.agentPhone,
      agentEmail: data.agentEmail
    };
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Property Web Scraper</h1>
                <p className="text-gray-600 mt-1">
                  Extract property data from websites and create marketing templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'scraper', name: 'Web Scraper', icon: '🕷️' },
                  { id: 'editor', name: 'Template Editor', icon: '🎨' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'scraper' && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    🕷️ Property Web Scraper
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Extract property data from South African real estate websites and use it to create professional marketing templates.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">📊 Smart Extraction</div>
                      <div className="text-gray-600">Automatically extracts property details, pricing, and agent information</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">🎯 Template Integration</div>
                      <div className="text-gray-600">Seamlessly import scraped data into marketing templates</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">💰 Credit System</div>
                      <div className="text-gray-600">Cost-effective scraping with our credit-based system</div>
                    </div>
                  </div>
                </div>
              </Card>

              <WebScraperInterface
                onDataScraped={handleDataScraped}
                creditsRemaining={userCredits}
              />

              {scrapedData && (
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 text-xl">✅</span>
                      <div>
                        <h3 className="font-medium text-green-900">Data Successfully Scraped!</h3>
                        <p className="text-sm text-green-700">
                          {scrapedData.title} - Ready to use in template editor
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setActiveTab('editor')}>
                      Open Template Editor
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-6">
              {!scrapedData ? (
                <Card className="p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Property Data Available</h3>
                    <p className="text-gray-600 mb-6">
                      Please scrape property data first, or load sample data to get started with template creation.
                    </p>
                    <div className="space-y-3">
                      <Button onClick={() => setActiveTab('scraper')}>
                        Go to Web Scraper
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/templates/editor')}
                      >
                        Create Blank Template
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <TemplateEditor
                  initialData={convertScrapedDataToPropertyData(scrapedData)}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}