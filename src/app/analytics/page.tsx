'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    {
      title: 'Total Properties',
      value: '247',
      change: '+12%',
      changeType: 'positive',
      icon: '🏠'
    },
    {
      title: 'Property Views',
      value: '12,847',
      change: '+8%',
      changeType: 'positive',
      icon: '👁️'
    },
    {
      title: 'Inquiries Generated',
      value: '389',
      change: '+15%',
      changeType: 'positive',
      icon: '💬'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative',
      icon: '📈'
    }
  ];

  const topProperties = [
    {
      title: 'Luxury Apartment in Cape Town',
      views: 1247,
      inquiries: 23,
      price: 'R 3,200,000'
    },
    {
      title: 'Modern Townhouse in Johannesburg',
      views: 892,
      inquiries: 18,
      price: 'R 2,850,000'
    },
    {
      title: 'Beachfront Villa in Durban',
      views: 756,
      inquiries: 15,
      price: 'R 4,500,000'
    }
  ];

  const marketingChannels = [
    { name: 'Property24 Import', leads: 145, percentage: 37 },
    { name: 'Social Media', leads: 98, percentage: 25 },
    { name: 'Email Sequences', leads: 87, percentage: 22 },
    { name: 'Website Direct', leads: 59, percentage: 15 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive insights into your real estate marketing performance.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline">Export Report</Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{metric.icon}</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Properties */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Properties</h2>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{property.views.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{property.inquiries} inquiries</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Marketing Channels */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Sources</h2>
            <div className="space-y-4">
              {marketingChannels.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {channel.percentage}%
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{channel.leads}</span>
                    <span className="text-sm text-gray-600 ml-1">leads</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Views Over Time</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-lg font-medium mb-2">Chart Placeholder</p>
                <p className="text-sm">Interactive chart would display here</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Inquiry Conversion Funnel</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Property Views</span>
                <span className="text-lg font-semibold text-blue-600">12,847</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Inquiries</span>
                <span className="text-lg font-semibold text-green-600">389</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Viewings</span>
                <span className="text-lg font-semibold text-yellow-600">67</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Offers</span>
                <span className="text-lg font-semibold text-purple-600">12</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🏠</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Luxury Apartment in Cape Town</span> received 23 new views
                </p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">💬</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah Johnson</span> submitted an inquiry for Modern Townhouse
                </p>
                <p className="text-xs text-gray-600">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">📱</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Social media post for <span className="font-medium">Beachfront Villa</span> reached 1,200 impressions
                </p>
                <p className="text-xs text-gray-600">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">📧</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Email sequence <span className="font-medium">"New Property Inquiry"</span> completed for 3 contacts
                </p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}