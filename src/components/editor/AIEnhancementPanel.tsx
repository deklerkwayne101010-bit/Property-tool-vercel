'use client';

import React, { useState } from 'react';

interface AIEnhancementPanelProps {
  onEnhanceImage: (action: string) => Promise<void>;
  isProcessing?: boolean;
}

const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  onEnhanceImage,
  isProcessing = false
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');

  const enhancements = [
    {
      id: 'upscale',
      name: 'Upscale Image',
      description: 'Enhance resolution and quality using AI',
      icon: '🔍',
      processingTime: '~10 seconds'
    },
    {
      id: 'remove-bg',
      name: 'Remove Background',
      description: 'Automatically remove image background',
      icon: '✂️',
      processingTime: '~5 seconds'
    },
    {
      id: 'enhance-colors',
      name: 'Color Enhancement',
      description: 'Improve colors and contrast',
      icon: '🎨',
      processingTime: '~8 seconds'
    },
    {
      id: 'denoise',
      name: 'Remove Noise',
      description: 'Clean up image noise and artifacts',
      icon: '🧹',
      processingTime: '~6 seconds'
    }
  ];

  const handleEnhancement = async (action: string) => {
    setSelectedAction(action);
    try {
      await onEnhanceImage(action);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setSelectedAction('');
    }
  };

  return (
    <div className="ai-enhancement-panel bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">🤖</span>
        AI Enhancements
      </h3>

      <div className="space-y-3">
        {enhancements.map((enhancement) => (
          <div
            key={enhancement.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{enhancement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{enhancement.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{enhancement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Processing time: {enhancement.processingTime}</p>
                </div>
              </div>
              <button
                onClick={() => handleEnhancement(enhancement.id)}
                disabled={isProcessing || selectedAction === enhancement.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedAction === enhancement.id
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                    : isProcessing
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedAction === enhancement.id ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Mode Notice */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">🚀 Demo Mode</h4>
        <p className="text-sm text-yellow-800">
          Currently showing demo effects. Full AI integration with OpenAI and Hugging Face coming soon!
        </p>
      </div>

      {/* Usage Tips */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select an image on the canvas before applying enhancements</li>
          <li>• Demo effects will apply visual changes to your images</li>
          <li>• Real AI processing will be available after API setup</li>
          <li>• You can undo changes using Ctrl+Z</li>
        </ul>
      </div>

      {/* API Status */}
      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-orange-800">Status</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-orange-700">Demo Mode</span>
          </div>
        </div>
        <p className="text-xs text-orange-600 mt-1">API integration pending</p>
      </div>
    </div>
  );
};

export default AIEnhancementPanel;