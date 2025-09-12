'use client';

import React, { useState, useEffect } from 'react';
import Card, { Header as CardHeader, Content as CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ContactCard from './ContactCard';
import PipelineView from './PipelineView';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'prospect' | 'client';
  source: string;
  budget?: {
    min: number;
    max: number;
  };
  lastContact: Date;
  nextFollowUp?: Date;
  tags: string[];
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  contacts: Array<{
    id: string;
    name: string;
    value: number;
    daysInStage: number;
  }>;
}

const CRMDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'pipeline' | 'contacts'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        status: 'lead',
        source: 'website',
        budget: { min: 300000, max: 500000 },
        lastContact: new Date('2024-01-15'),
        nextFollowUp: new Date('2024-01-20'),
        tags: ['first-time-buyer', 'downtown']
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543',
        status: 'prospect',
        source: 'referral',
        budget: { min: 600000, max: 800000 },
        lastContact: new Date('2024-01-10'),
        nextFollowUp: new Date('2024-01-18'),
        tags: ['luxury', 'waterfront']
      },
      {
        id: '3',
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '+1 (555) 456-7890',
        status: 'client',
        source: 'open-house',
        budget: { min: 450000, max: 550000 },
        lastContact: new Date('2024-01-12'),
        tags: ['family', 'suburban']
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const pipelineStages: PipelineStage[] = [
    {
      id: 'new-leads',
      name: 'New Leads',
      color: '#fbbf24',
      contacts: contacts
        .filter(c => c.status === 'lead')
        .map(c => ({
          id: c.id,
          name: c.name,
          value: c.budget?.max || 0,
          daysInStage: Math.floor((Date.now() - c.lastContact.getTime()) / (1000 * 60 * 60 * 24))
        }))
    },
    {
      id: 'qualified',
      name: 'Qualified',
      color: '#3b82f6',
      contacts: contacts
        .filter(c => c.status === 'prospect')
        .map(c => ({
          id: c.id,
          name: c.name,
          value: c.budget?.max || 0,
          daysInStage: Math.floor((Date.now() - c.lastContact.getTime()) / (1000 * 60 * 60 * 24))
        }))
    },
    {
      id: 'proposal',
      name: 'Proposal',
      color: '#8b5cf6',
      contacts: [] // Empty for demo
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      color: '#f59e0b',
      contacts: [] // Empty for demo
    },
    {
      id: 'closed',
      name: 'Closed Won',
      color: '#10b981',
      contacts: contacts
        .filter(c => c.status === 'client')
        .map(c => ({
          id: c.id,
          name: c.name,
          value: c.budget?.max || 0,
          daysInStage: Math.floor((Date.now() - c.lastContact.getTime()) / (1000 * 60 * 60 * 24))
        }))
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleContactEdit = (contact: Contact) => {
    console.log('Edit contact:', contact);
    // TODO: Open edit modal
  };

  const handleContactDelete = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handleMoveToNextStage = (contactId: string) => {
    setContacts(contacts.map(contact => {
      if (contact.id === contactId) {
        const statusOrder = ['lead', 'prospect', 'client'];
        const currentIndex = statusOrder.indexOf(contact.status);
        if (currentIndex < statusOrder.length - 1) {
          return { ...contact, status: statusOrder[currentIndex + 1] as Contact['status'] };
        }
      }
      return contact;
    }));
  };

  const handleContactMove = (contactId: string, fromStageId: string, toStageId: string) => {
    console.log('Move contact:', contactId, 'from', fromStageId, 'to', toStageId);
    // TODO: Update contact status based on stage movement
  };

  const handleContactClick = (contactId: string) => {
    console.log('Contact clicked:', contactId);
    // TODO: Open contact detail modal
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-dashboard space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your leads, track your sales pipeline, and close more deals</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AI-powered insights</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="lg" className="shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </Button>
            <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{contacts.length}</div>
            <div className="text-sm font-medium text-gray-600 mb-1">Total Contacts</div>
            <div className="text-xs text-gray-500">All active leads & clients</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {contacts.filter(c => c.status === 'lead').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">New Leads</div>
            <div className="text-xs text-gray-500">Fresh inquiries & prospects</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {contacts.filter(c => c.status === 'prospect').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Active Prospects</div>
            <div className="text-xs text-gray-500">Qualified leads in pipeline</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {contacts.filter(c => c.status === 'client').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Closed Deals</div>
            <div className="text-xs text-gray-500">Successfully converted clients</div>
          </div>
        </Card>
      </div>

      {/* View Toggle & Filters */}
      <Card variant="default" className="shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 mr-4">View:</span>
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setActiveView('pipeline')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeView === 'pipeline'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Pipeline
                </button>
                <button
                  onClick={() => setActiveView('contacts')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeView === 'contacts'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Contacts
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="lead">Leads</option>
                  <option value="prospect">Prospects</option>
                  <option value="client">Clients</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeView === 'pipeline' ? (
            <PipelineView
              stages={pipelineStages}
              onContactMove={handleContactMove}
              onContactClick={handleContactClick}
            />
          ) : (
            <div className="space-y-6">
              {/* Contacts Grid */}
              {filteredContacts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <Button variant="primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Your First Contact
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={handleContactEdit}
                      onDelete={handleContactDelete}
                      onMoveToNextStage={handleMoveToNextStage}
                    />
                  ))}
                </div>
              )}

              {/* Summary Footer */}
              {filteredContacts.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Contact Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Showing {filteredContacts.length} of {contacts.length} contacts
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {filteredContacts.filter(c => c.status === 'lead').length} Leads
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {filteredContacts.filter(c => c.status === 'prospect').length} Prospects
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {filteredContacts.filter(c => c.status === 'client').length} Clients
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CRMDashboard;