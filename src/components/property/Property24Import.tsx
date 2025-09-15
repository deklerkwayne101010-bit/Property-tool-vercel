'use client';

import React, { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface Property24Data {
  title: string;
  price: string;
  address: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  propertyType: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agencyName: string;
  features: string[];
  images: string[];
  listingDate: string;
  propertyId: string;
  suburb: string;
  city: string;
  province: string;
}

interface ValidationInfo {
  warnings: string[];
  hasWarnings: boolean;
}

interface ImportProgress {
  stage: 'idle' | 'validating' | 'scraping' | 'processing' | 'saving' | 'completed' | 'error';
  message: string;
  progress: number;
}

interface Property24ImportProps {
  onPropertyImported?: (property: Property24Data) => void;
  onPropertySaved?: (propertyId: string) => void;
}

export default function Property24Import({ onPropertyImported, onPropertySaved }: Property24ImportProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    stage: 'idle',
    message: '',
    progress: 0
  });
  const [scrapedData, setScrapedData] = useState<Property24Data | null>(null);
  const [validationInfo, setValidationInfo] = useState<ValidationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveToDatabase, setSaveToDatabase] = useState(false);

  const updateProgress = useCallback((stage: ImportProgress['stage'], message: string, progressPercent: number = 0) => {
    setProgress({ stage, message, progress: progressPercent });
  }, []);

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please enter a Property24 URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      updateProgress('validating', 'Validating Property24 URL...', 10);

      // Validate URL format first
      const validateResponse = await fetch(`/api/property24/scrape?url=${encodeURIComponent(url)}`);
      const validateData = await validateResponse.json();

      if (!validateData.isValid) {
        throw new Error('Invalid Property24 URL format. Please check the URL and try again.');
      }

      updateProgress('scraping', 'Scraping property data from Property24...', 30);

      // Scrape the property data
      const scrapeResponse = await fetch('/api/property24/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          url: url.trim(),
          saveToDatabase
        })
      });

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json();
        throw new Error(errorData.error || 'Failed to scrape property data');
      }

      updateProgress('processing', 'Processing scraped data...', 70);

      const result = await scrapeResponse.json();

      if (saveToDatabase) {
        updateProgress('saving', 'Saving property to database...', 90);
      }

      updateProgress('completed', 'Property import completed successfully!', 100);

      setScrapedData(result.property24Data);
      setValidationInfo(result.validation);

      // Call callbacks
      if (onPropertyImported) {
        onPropertyImported(result.property24Data);
      }

      if (saveToDatabase && result.savedProperty && onPropertySaved) {
        onPropertySaved(result.savedProperty._id);
      }

    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      updateProgress('error', errorMessage, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setScrapedData(null);
    setValidationInfo(null);
    setError(null);
    setProgress({ stage: 'idle', message: '', progress: 0 });
  };

  const getProgressColor = () => {
    switch (progress.stage) {
      case 'error': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Import from Property24</h3>
            <p className="text-gray-600 text-sm">
              Paste a Property24 property URL to automatically import all property details, images, and agent information.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="property24-url" className="block text-sm font-medium text-gray-700 mb-1">
                Property24 URL
              </label>
              <Input
                id="property24-url"
                type="url"
                placeholder="https://www.property24.com/for-sale/cape-town/western-cape/12345"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="save-to-database"
                checked={saveToDatabase}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveToDatabase(e.target.checked)}
                className="rounded border-gray-300"
                disabled={isLoading}
              />
              <label htmlFor="save-to-database" className="text-sm text-gray-700">
                Save property to my database
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.message}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleImport}
              disabled={isLoading || !url.trim()}
              className="flex-1"
            >
              {isLoading ? 'Importing...' : 'Import Property'}
            </Button>

            {(scrapedData || error) && (
              <Button
                onClick={resetForm}
                variant="outline"
                disabled={isLoading}
              >
                Import Another
              </Button>
            )}
          </div>
        </div>
      </Card>

      {scrapedData && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Imported Property Data</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Successfully Imported
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">{scrapedData.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">{scrapedData.price}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{scrapedData.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type</label>
                  <p className="text-sm text-gray-900">{scrapedData.propertyType}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                    <p className="text-sm text-gray-900">{scrapedData.bedrooms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                    <p className="text-sm text-gray-900">{scrapedData.bathrooms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Garages</label>
                    <p className="text-sm text-gray-900">{scrapedData.garages}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Agent Information</label>
                  <div className="text-sm text-gray-900">
                    <p><strong>Name:</strong> {scrapedData.agentName}</p>
                    <p><strong>Phone:</strong> {scrapedData.agentPhone}</p>
                    <p><strong>Email:</strong> {scrapedData.agentEmail}</p>
                    <p><strong>Agency:</strong> {scrapedData.agencyName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="text-sm text-gray-900">
                    <p><strong>Suburb:</strong> {scrapedData.suburb}</p>
                    <p><strong>City:</strong> {scrapedData.city}</p>
                    <p><strong>Province:</strong> {scrapedData.province}</p>
                  </div>
                </div>

                {scrapedData.features.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features</label>
                    <div className="flex flex-wrap gap-1">
                      {scrapedData.features.slice(0, 5).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {scrapedData.features.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{scrapedData.features.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Images Found</label>
                  <p className="text-sm text-gray-900">{scrapedData.images.length} images</p>
                </div>
              </div>
            </div>

            {scrapedData.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{scrapedData.description}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {validationInfo && validationInfo.hasWarnings && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="text-lg font-semibold text-yellow-800">Data Validation Warnings</h4>
            </div>

            <p className="text-sm text-yellow-700">
              The following issues were detected and automatically corrected during import:
            </p>

            <ul className="space-y-1">
              {validationInfo.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-sm text-yellow-800">{warning}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-yellow-600 mt-2">
              These warnings don't prevent the import but you may want to review the data for accuracy.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}