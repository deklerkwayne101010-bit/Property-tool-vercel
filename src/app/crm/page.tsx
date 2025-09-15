'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('contacts');

  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+27 21 555 0123',
      status: 'Hot Lead',
      lastContact: '2 hours ago',
      propertyInterest: '3 Bedroom Apartment'
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+27 21 555 0456',
      status: 'Qualified',
      lastContact: '1 day ago',
      propertyInterest: 'Commercial Property'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+27 21 555 0789',
      status: 'Cold Lead',
      lastContact: '1 week ago',
      propertyInterest: 'Townhouse'
    }
  ];

  const deals = [
    {
      id: 1,
      contact: 'Sarah Johnson',
      property: 'Ocean View Apartment',
      value: 'R 2,850,000',
      stage: 'Negotiation',
      probability: 75,
      closeDate: '2024-02-15'
    },
    {
      id: 2,
      contact: 'Michael Brown',
      property: 'CBD Office Space',
      value: 'R 5,200,000',
      stage: 'Proposal',
      probability: 60,
      closeDate: '2024-03-01'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot Lead': return 'bg-red-100 text-red-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Cold Lead': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal': return 'bg-blue-100 text-blue-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRM & Pipeline Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage your contacts, leads, and deals in one comprehensive dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-semibold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-semibold">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">24%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'contacts', name: 'Contacts', count: 247 },
                { id: 'deals', name: 'Deals', count: 12 },
                { id: 'activities', name: 'Activities', count: 89 }
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
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'contacts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
              <Button>Add Contact</Button>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{contact.propertyInterest}</p>
                        <p className="text-sm text-gray-600">Last contact: {contact.lastContact}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'deals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Deals Pipeline</h2>
              <Button>Add Deal</Button>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">💰</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{deal.contact}</h3>
                        <p className="text-sm text-gray-600">{deal.property}</p>
                        <p className="text-sm text-gray-600">Close date: {deal.closeDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{deal.value}</p>
                        <p className="text-sm text-gray-600">{deal.probability}% probability</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📧</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Sarah Johnson</span> opened your email about the Ocean View Apartment
                    </p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📞</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Michael Brown</span> called about the CBD office space
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
                      <span className="font-medium">Emma Davis</span> viewed your property listing on Facebook
                    </p>
                    <p className="text-xs text-gray-600">6 hours ago</p>
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