'use client';

import React, { useState, useEffect } from 'react';
import Card, { Header as CardHeader, Content as CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'posted' | 'failed';
  image?: string;
  propertyId?: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
}

const SocialMediaScheduler: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const platforms: SocialPlatform[] = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', connected: true },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', connected: true },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5', connected: true },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', connected: false },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023', connected: true }
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: ScheduledPost[] = [
      {
        id: '1',
        content: '🏡 Beautiful 3BR/2BA home in downtown area! Perfect for first-time buyers. $425K #RealEstate #PropertyForSale',
        platforms: ['facebook', 'instagram'],
        scheduledDate: new Date('2024-01-20T10:00:00'),
        status: 'scheduled',
        image: '/property1.jpg'
      },
      {
        id: '2',
        content: 'Luxury waterfront condo now available! Stunning views and premium finishes. Schedule a private tour today! 🌊 #LuxuryRealEstate',
        platforms: ['facebook', 'linkedin'],
        scheduledDate: new Date('2024-01-18T14:30:00'),
        status: 'posted',
        image: '/property2.jpg'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
    }, 500);
  }, []);

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSchedulePost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0 || !newPost.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newScheduledPost: ScheduledPost = {
        id: Date.now().toString(),
        content: newPost.content,
        platforms: newPost.platforms,
        scheduledDate: new Date(newPost.scheduledDate),
        status: 'scheduled',
        image: newPost.image || undefined
      };

      setPosts(prev => [newScheduledPost, ...prev]);
      setNewPost({
        content: '',
        platforms: [],
        scheduledDate: '',
        image: ''
      });
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'posted': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return '⏰';
      case 'posted': return '✅';
      case 'failed': return '❌';
      default: return '📝';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="social-media-scheduler space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media Scheduler</h1>
          <p className="text-gray-600 mt-1">Automate your property marketing across all platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Button>
          <Button variant="primary" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{posts.length}</div>
          <div className="text-sm text-gray-600">Scheduled Posts</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {posts.filter(p => p.status === 'posted').length}
          </div>
          <div className="text-sm text-gray-600">Posts Published</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {platforms.filter(p => p.connected).length}
          </div>
          <div className="text-sm text-gray-600">Connected Platforms</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {posts.filter(p => p.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-600">Pending Posts</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Post Section */}
        <div className="lg:col-span-2">
          <Card variant="default">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">Create New Post</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your engaging property post here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{newPost.content.length}/280 characters</span>
                  <span>AI suggestions available</span>
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      disabled={!platform.connected}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                        newPost.platforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : platform.connected
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                      {!platform.connected && (
                        <span className="text-xs text-red-500 ml-auto">Not connected</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={newPost.scheduledDate}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={newPost.image}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  Save as Draft
                </Button>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSchedulePost}
                    loading={isLoading}
                  >
                    Schedule Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Posts Sidebar */}
        <div>
          <Card variant="default">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">Scheduled Posts</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">No scheduled posts yet</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(post.status)}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {post.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <span key={platformId} className="text-sm" title={platform.name}>
                                {platform.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.scheduledDate)}</span>
                        <div className="flex space-x-2">
                          <button className="hover:text-blue-600 transition-colors duration-200">
                            Edit
                          </button>
                          <button className="hover:text-red-600 transition-colors duration-200">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Connection Status */}
      <Card variant="default">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900">Platform Connections</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`text-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  platform.connected
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">{platform.name}</div>
                <div className={`text-xs ${platform.connected ? 'text-green-600' : 'text-gray-500'}`}>
                  {platform.connected ? 'Connected' : 'Not Connected'}
                </div>
                {!platform.connected && (
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaScheduler;