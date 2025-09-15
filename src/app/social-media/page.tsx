'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SocialMediaPage() {
  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: '📘',
      description: 'Post to Facebook pages and groups',
      connected: true,
      posts: 45
    },
    {
      name: 'Instagram',
      icon: '📷',
      description: 'Share images and stories',
      connected: true,
      posts: 32
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      description: 'Professional networking posts',
      connected: false,
      posts: 0
    },
    {
      name: 'Twitter',
      icon: '🐦',
      description: 'Quick updates and engagement',
      connected: false,
      posts: 0
    }
  ];

  const recentPosts = [
    {
      platform: 'Facebook',
      content: 'Beautiful 3-bedroom home in Cape Town available now! 🏠',
      time: '2 hours ago',
      engagement: '12 likes, 3 shares'
    },
    {
      platform: 'Instagram',
      content: 'Luxury apartment with ocean views in Camps Bay',
      time: '5 hours ago',
      engagement: '28 likes, 5 comments'
    },
    {
      platform: 'Facebook',
      content: 'Investment opportunity: Commercial property in Johannesburg CBD',
      time: '1 day ago',
      engagement: '8 likes, 2 shares'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Media Management
          </h1>
          <p className="text-lg text-gray-600">
            Post to multiple social platforms simultaneously with AI-generated content tailored for South African real estate.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Post</h3>
              <p className="text-gray-600 text-sm mb-4">
                Generate engaging social media content from your property data
              </p>
              <Button className="w-full">
                Create New Post
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schedule Posts</h3>
              <p className="text-gray-600 text-sm mb-4">
                Plan and schedule your social media content in advance
              </p>
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">
                Track engagement and performance across all platforms
              </p>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </div>
          </Card>
        </div>

        {/* Connected Platforms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialPlatforms.map((platform) => (
              <Card key={platform.name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.posts} posts</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                <Button
                  variant={platform.connected ? "outline" : "primary"}
                  size="sm"
                  className="w-full"
                >
                  {platform.connected ? 'Manage' : 'Connect'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">
                        {post.platform === 'Facebook' ? '📘' :
                         post.platform === 'Instagram' ? '📷' : '🐦'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{post.platform}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{post.content}</p>
                    <p className="text-xs text-gray-600">{post.engagement}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Content Generation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Content Generation</h2>
          <Card className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Generate Social Media Content</h3>
              <p className="text-gray-600">
                Use AI to create engaging social media posts from your property listings
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">🏠</span>
                <span className="text-sm">Property Showcase</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">💰</span>
                <span className="text-sm">Investment Opportunity</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">🏘️</span>
                <span className="text-sm">Neighborhood Highlight</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}