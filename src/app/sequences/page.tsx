'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SequencesPage() {
  const [activeTab, setActiveTab] = useState('sequences');

  const sequences = [
    {
      id: 1,
      name: 'New Property Inquiry',
      description: 'Automated follow-up for new property inquiries',
      steps: 5,
      activeContacts: 12,
      status: 'active',
      lastModified: '2 days ago'
    },
    {
      id: 2,
      name: 'Viewing Follow-up',
      description: 'Nurture leads after property viewings',
      steps: 4,
      activeContacts: 8,
      status: 'active',
      lastModified: '1 week ago'
    },
    {
      id: 3,
      name: 'Price Reduction Alert',
      description: 'Notify contacts when prices drop',
      steps: 2,
      activeContacts: 15,
      status: 'draft',
      lastModified: '3 days ago'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Welcome Email',
      type: 'Email',
      category: 'Initial Contact',
      lastUsed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Property Details SMS',
      type: 'SMS',
      category: 'Information',
      lastUsed: '1 day ago'
    },
    {
      id: 3,
      name: 'Viewing Reminder',
      type: 'Email',
      category: 'Follow-up',
      lastUsed: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Sequences
          </h1>
          <p className="text-lg text-gray-600">
            Create intelligent email and SMS sequences to nurture leads and convert prospects automatically.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">➕</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Sequence</h3>
              <p className="text-gray-600 text-sm mb-4">
                Build a new automated sequence from scratch
              </p>
              <Link href="/sequences/builder">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Use Template</h3>
              <p className="text-gray-600 text-sm mb-4">
                Start with a pre-built sequence template
              </p>
              <Button variant="outline" className="w-full">
                Browse Templates
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
                View performance metrics and insights
              </p>
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'sequences', name: 'Sequences', count: 3 },
                { id: 'templates', name: 'Templates', count: 12 },
                { id: 'analytics', name: 'Analytics', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name} {tab.count && `(${tab.count})`}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sequences' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Sequences</h2>
              <Link href="/sequences/builder">
                <Button>Create New Sequence</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {sequences.map((sequence) => (
                <Card key={sequence.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {sequence.steps}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                        <p className="text-gray-600">{sequence.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{sequence.steps} steps</span>
                          <span>•</span>
                          <span>{sequence.activeContacts} active contacts</span>
                          <span>•</span>
                          <span>Modified {sequence.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sequence.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sequence.status}
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Duplicate</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Message Templates</h2>
              <Button>Create Template</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        template.type === 'Email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {template.type === 'Email' ? '📧' : '📱'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last used: {template.lastUsed}</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sequence Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">📧</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm font-semibold">📱</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                    <p className="text-2xl font-bold text-gray-900">389</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-semibold">👁️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-semibold">🎯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">12%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">New Property Inquiry</h4>
                    <p className="text-sm text-gray-600">5 steps • 12 active contacts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">78% completion</p>
                    <p className="text-sm text-gray-600">9 conversions</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Viewing Follow-up</h4>
                    <p className="text-sm text-gray-600">4 steps • 8 active contacts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600">65% completion</p>
                    <p className="text-sm text-gray-600">5 conversions</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}