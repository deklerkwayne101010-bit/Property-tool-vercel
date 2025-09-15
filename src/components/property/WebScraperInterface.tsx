'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

interface WebScraperInterfaceProps {
  onDataScraped?: (data: ScrapedProperty) => void;
  creditsRemaining?: number;
}

export default function WebScraperInterface({ onDataScraped, creditsRemaining = 0 }: WebScraperInterfaceProps) {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedProperty | null>(null);
  const [error, setError] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [batchResults, setBatchResults] = useState<any[]>([]);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a property listing URL');
      return;
    }

    if (creditsRemaining < 1) {
      setError('Insufficient credits. Please purchase more credits to use web scraping.');
      return;
    }

    setIsScraping(true);
    setError('');
    setScrapedData(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please sign in.');
      setIsScraping(false);
      return;
    }

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setScrapedData(data.data);
        if (onDataScraped) {
          onDataScraped(data.data);
        }
      } else {
        setError(data.error || 'Failed to scrape property data');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setError('Failed to scrape property data. Please try again.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleBatchScrape = async () => {
    const urls = batchUrls.split('\n').map(u => u.trim()).filter(u => u);
    if (urls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    if (urls.length > 10) {
      setError('Maximum 10 URLs allowed per batch');
      return;
    }

    if (creditsRemaining < urls.length) {
      setError(`Insufficient credits. You need ${urls.length} credits but only have ${creditsRemaining}.`);
      return;
    }

    setIsScraping(true);
    setError('');
    setBatchResults([]);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please sign in.');
      setIsScraping(false);
      return;
    }

    try {
      const response = await fetch('/api/scrape', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ urls })
      });

      const data = await response.json();

      if (response.ok) {
        setBatchResults(data.results);
      } else {
        setError(data.error || 'Failed to scrape properties');
      }
    } catch (error) {
      console.error('Batch scraping error:', error);
      setError('Failed to scrape properties. Please try again.');
    } finally {
      setIsScraping(false);
    }
  };

  const supportedSites = [
    { name: 'Property24', domain: 'property24.com', logo: '🏠' },
    { name: 'Private Property', domain: 'privateproperty.co.za', logo: '🏢' },
    { name: 'Gumtree', domain: 'gumtree.co.za', logo: '📄' },
    { name: 'Property.co.za', domain: 'property.co.za', logo: '🏘️' },
    { name: 'Seeff', domain: 'seeff.com', logo: '🏡' },
    { name: 'RE/MAX', domain: 'remax.co.za', logo: '🏠' },
    { name: 'Pam Golding', domain: 'pamgolding.co.za', logo: '🏛️' }
  ];

  return (
    <div className="space-y-6">
      {/* Credits Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">💎</span>
            <span className="text-sm font-medium text-blue-900">
              {creditsRemaining} credits remaining
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/dashboard/credits', '_blank')}
          >
            Buy Credits
          </Button>
        </div>
      </Card>

      {/* Single URL Scraper */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Scrape Property Data</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Listing URL
            </label>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="https://www.property24.com/for-sale/cape-town/western-cape/12345"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleScrape}
                disabled={isScraping || !url.trim()}
              >
                {isScraping ? 'Scraping...' : 'Scrape Data'}
              </Button>
            </div>
          </div>

          {/* Supported Sites */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Supported property websites:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {supportedSites.map((site, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>{site.logo}</span>
                  <span>{site.name}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Scraped Data Display */}
      {scrapedData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scraped Property Data</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{scrapedData.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{scrapedData.price}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{scrapedData.location}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded text-center">{scrapedData.bedrooms}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded text-center">{scrapedData.bathrooms}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Garages</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded text-center">{scrapedData.garages}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                  {scrapedData.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <div className="flex flex-wrap gap-1">
                  {scrapedData.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Agent Information</label>
                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded space-y-1">
                  <div><strong>{scrapedData.agentName}</strong></div>
                  <div>{scrapedData.agentPhone}</div>
                  <div>{scrapedData.agentEmail}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{scrapedData.source}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => onDataScraped && onDataScraped(scrapedData)}
              className="w-full"
            >
              Use This Data in Template
            </Button>
          </div>
        </Card>
      )}

      {/* Batch Scraper */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Property Scraping</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property URLs (one per line, max 10)
            </label>
            <textarea
              value={batchUrls}
              onChange={(e) => setBatchUrls(e.target.value)}
              placeholder={`https://www.property24.com/for-sale/cape-town/western-cape/12345
https://www.privateproperty.co.za/for-sale/western-cape/cape-town/67890
https://www.gumtree.co.za/property/abc123`}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button
            onClick={handleBatchScrape}
            disabled={isScraping || !batchUrls.trim()}
            variant="outline"
          >
            {isScraping ? 'Scraping...' : 'Scrape Multiple Properties'}
          </Button>
        </div>
      </Card>

      {/* Batch Results */}
      {batchResults.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Scraping Results</h3>

          <div className="space-y-4">
            {batchResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    Property {index + 1}
                  </h4>
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>

                {result.success && result.data ? (
                  <div className="text-sm text-gray-600">
                    <p><strong>Title:</strong> {result.data.title}</p>
                    <p><strong>Price:</strong> {result.data.price}</p>
                    <p><strong>Location:</strong> {result.data.location}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}