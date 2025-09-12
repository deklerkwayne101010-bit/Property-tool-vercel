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
    <div className="social-media-scheduler space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Media Scheduler</h1>
            <p className="text-lg text-gray-600">Automate your property marketing across all platforms with AI-powered content</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time scheduling</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI content suggestions</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="lg" className="shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Button>
            <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Post
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{posts.length}</div>
            <div className="text-sm font-medium text-gray-600 mb-1">Scheduled Posts</div>
            <div className="text-xs text-gray-500">Ready to publish</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {posts.filter(p => p.status === 'posted').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Posts Published</div>
            <div className="text-xs text-gray-500">Successfully shared</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {platforms.filter(p => p.connected).length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Connected Platforms</div>
            <div className="text-xs text-gray-500">Active integrations</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {posts.filter(p => p.status === 'scheduled').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Pending Posts</div>
            <div className="text-xs text-gray-500">Awaiting publication</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Post Section */}
        <div className="lg:col-span-2">
          <Card variant="default" className="shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
                  <p className="text-gray-600 mt-1">Craft engaging content for your property listings</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Content Input */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-900">
                    Post Content
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">AI Assist</span>
                    <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors duration-200">
                      ✨ Generate
                    </button>
                  </div>
                </div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your engaging property post here... 🏡✨ #RealEstate #PropertyForSale"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 shadow-sm"
                  rows={5}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 text-sm ${newPost.content.length > 250 ? 'text-red-600' : 'text-gray-600'}`}>
                      <span className="font-medium">{newPost.content.length}</span>
                      <span>/ 280</span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${newPost.content.length > 250 ? 'bg-red-500' : 'bg-purple-500'}`}
                        style={{ width: `${Math.min((newPost.content.length / 280) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>AI suggestions available</span>
                  </div>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-900">
                    Select Platforms
                  </label>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {newPost.platforms.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      disabled={!platform.connected}
                      className={`group relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        newPost.platforms.includes(platform.id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : platform.connected
                          ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        newPost.platforms.includes(platform.id)
                          ? 'bg-purple-500 text-white'
                          : platform.connected
                          ? 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <span className="text-lg">{platform.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`text-sm font-semibold block ${
                          newPost.platforms.includes(platform.id) ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {platform.name}
                        </span>
                        {!platform.connected && (
                          <span className="text-xs text-red-500 block">Not connected</span>
                        )}
                      </div>
                      {newPost.platforms.includes(platform.id) && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {newPost.platforms.length === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm text-yellow-800">Select at least one platform to schedule your post</span>
                    </div>
                  </div>
                )}
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
          <Card variant="default" className="shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Scheduled Posts</h3>
                  <p className="text-gray-600 text-sm mt-1">Your content queue</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">No scheduled posts yet</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-200 transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            post.status === 'posted' ? 'bg-green-100' :
                            post.status === 'scheduled' ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            <span className="text-sm">{getStatusIcon(post.status)}</span>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)} shadow-sm`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {post.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <div key={platformId} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center" title={platform.name}>
                                <span className="text-sm">{platform.icon}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{formatDate(post.scheduledDate)}</span>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200">
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
      <Card variant="default" className="shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Platform Connections</h3>
              <p className="text-gray-600 text-sm mt-1">Manage your social media integrations</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`relative text-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  platform.connected
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  platform.connected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  <span className="text-xl">{platform.icon}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 mb-2">{platform.name}</div>
                <div className={`text-xs font-medium mb-3 ${
                  platform.connected ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {platform.connected ? '✓ Connected' : '○ Not Connected'}
                </div>
                {!platform.connected && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs py-2 hover:shadow-md transition-all duration-200"
                  >
                    Connect
                  </Button>
                )}
                {platform.connected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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