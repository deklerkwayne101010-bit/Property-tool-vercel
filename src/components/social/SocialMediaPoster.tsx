'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { SocialMediaService, SocialPost } from '@/lib/social-media-service';
import { SocialContentGenerator, PropertyData, GeneratedContent } from '@/lib/social-content-generator';

interface SocialMediaPosterProps {
  property?: PropertyData;
  onPostSuccess?: (results: any) => void;
  onPostError?: (error: string) => void;
}

export default function SocialMediaPoster({
  property,
  onPostSuccess,
  onPostError
}: SocialMediaPosterProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postResults, setPostResults] = useState<any>(null);

  // Content generation options
  const [contentOptions, setContentOptions] = useState({
    platform: 'facebook' as const,
    tone: 'professional' as const,
    length: 'medium' as const,
    includeHashtags: true,
    includeEmojis: true,
    targetAudience: 'families' as const,
    callToAction: true
  });

  const availablePlatforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', connected: SocialMediaService.isPlatformConfigured('facebook') },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: SocialMediaService.isPlatformConfigured('linkedin') },
    { id: 'twitter', name: 'Twitter', icon: '🐦', connected: SocialMediaService.isPlatformConfigured('twitter') },
    { id: 'instagram', name: 'Instagram', icon: '📷', connected: SocialMediaService.isPlatformConfigured('instagram') }
  ];

  // Generate content when property or options change
  useEffect(() => {
    if (property) {
      generateContent();
    }
  }, [property, contentOptions]);

  const generateContent = async () => {
    if (!property) return;

    setIsGenerating(true);
    try {
      const generated = await SocialContentGenerator.generateContent(property, contentOptions);
      setGeneratedContent(generated);
      setContent(generated.text);
    } catch (error) {
      console.error('Content generation error:', error);
      if (onPostError) {
        onPostError('Failed to generate content');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlatformToggle = useCallback((platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);

  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!content.trim()) {
      alert('Please enter content to post');
      return;
    }

    setIsPosting(true);
    setPostResults(null);

    try {
      const post: SocialPost = {
        agentId: 'current-user-id', // TODO: Get from auth context
        platform: selectedPlatforms[0] as any, // Will be overridden for multi-platform
        content: content.trim(),
        mediaUrls: customImages.length > 0 ? customImages : (property?.images || []),
        status: 'posting',
        tags: generatedContent?.hashtags || []
      };

      const results = await SocialMediaService.postToMultiplePlatforms(post, selectedPlatforms);

      setPostResults(results);

      // Check if all posts were successful
      const allSuccessful = Object.values(results).every((result: any) => result.success);

      if (allSuccessful && onPostSuccess) {
        onPostSuccess(results);
      } else if (!allSuccessful && onPostError) {
        const errors = Object.entries(results)
          .filter(([, result]: [string, any]) => !result.success)
          .map(([platform, result]: [string, any]) => `${platform}: ${result.error}`)
          .join(', ');
        onPostError(`Some posts failed: ${errors}`);
      }

    } catch (error) {
      console.error('Posting error:', error);
      if (onPostError) {
        onPostError(error instanceof Error ? error.message : 'Posting failed');
      }
    } finally {
      setIsPosting(false);
    }
  };

  const addCustomImage = useCallback((url: string) => {
    if (url && !customImages.includes(url)) {
      setCustomImages(prev => [...prev, url]);
    }
  }, [customImages]);

  const removeCustomImage = useCallback((url: string) => {
    setCustomImages(prev => prev.filter(img => img !== url));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Platform Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availablePlatforms.map((platform) => (
            <div
              key={platform.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!platform.connected ? 'opacity-50' : ''}`}
              onClick={() => platform.connected && handlePlatformToggle(platform.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="text-sm font-medium">{platform.name}</div>
                {!platform.connected && (
                  <div className="text-xs text-red-500 mt-1">Not connected</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedPlatforms.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-700 text-sm">
              Please select at least one platform to post to.
            </p>
          </div>
        )}
      </Card>

      {/* Content Generation */}
      {property && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Content Generation</h3>
            <Button
              onClick={generateContent}
              disabled={isGenerating}
              size="sm"
            >
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={contentOptions.tone}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  tone: e.target.value as any
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="exciting">Exciting</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                value={contentOptions.targetAudience}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  targetAudience: e.target.value as any
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="families">Families</option>
                <option value="professionals">Professionals</option>
                <option value="investors">Investors</option>
                <option value="first-time-buyers">First-time Buyers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <select
                value={contentOptions.length}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  length: e.target.value as any
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={contentOptions.includeHashtags}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  includeHashtags: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm">Include hashtags</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={contentOptions.includeEmojis}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  includeEmojis: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm">Include emojis</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={contentOptions.callToAction}
                onChange={(e) => setContentOptions(prev => ({
                  ...prev,
                  callToAction: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm">Include call-to-action</span>
            </label>
          </div>

          {generatedContent && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                <span>Estimated engagement:</span>
                <span>
                  ❤️ {generatedContent.estimatedEngagement.likes} •
                  🔄 {generatedContent.estimatedEngagement.shares} •
                  💬 {generatedContent.estimatedEngagement.comments}
                </span>
              </div>
              {generatedContent.hashtags.length > 0 && (
                <div className="text-sm text-blue-600">
                  Suggested hashtags: {generatedContent.hashtags.join(' ')}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Content Editor */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Post Content</h3>

        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your social media post content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[120px] resize-vertical"
            rows={6}
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{content.length} characters</span>
            {generatedContent && (
              <span>Hashtags: {generatedContent.hashtags.join(' ')}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Image Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Images</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom Image URL
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="https://example.com/image.jpg"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    addCustomImage(input.value);
                    input.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="image.jpg"]') as HTMLInputElement;
                  if (input?.value) {
                    addCustomImage(input.value);
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Display selected images */}
          {(customImages.length > 0 || (property?.images && property.images.length > 0)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...customImages, ...(property?.images || [])].slice(0, 8).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Selected image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    {customImages.includes(url) && (
                      <button
                        onClick={() => removeCustomImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Post Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePost}
          disabled={isPosting || selectedPlatforms.length === 0 || !content.trim()}
          className="px-8 py-3 text-lg"
        >
          {isPosting ? 'Posting...' : `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
        </Button>
      </div>

      {/* Results */}
      {postResults && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Post Results</h3>
          <div className="space-y-3">
            {Object.entries(postResults).map(([platform, result]: [string, any]) => (
              <div
                key={platform}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{platform}</span>
                  <span className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? '✅ Posted' : '❌ Failed'}
                  </span>
                </div>
                {result.success && result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    View post →
                  </a>
                )}
                {!result.success && result.error && (
                  <p className="text-sm text-red-700 mt-1">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}