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
    <div className="crm-dashboard space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your leads and track your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
          <Button variant="primary" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{contacts.length}</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {contacts.filter(c => c.status === 'lead').length}
          </div>
          <div className="text-sm text-gray-600">New Leads</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {contacts.filter(c => c.status === 'prospect').length}
          </div>
          <div className="text-sm text-gray-600">Active Prospects</div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {contacts.filter(c => c.status === 'client').length}
          </div>
          <div className="text-sm text-gray-600">Closed Deals</div>
        </Card>
      </div>

      {/* View Toggle */}
      <Card variant="default">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeView === 'pipeline'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Pipeline View
            </button>
            <button
              onClick={() => setActiveView('contacts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeView === 'contacts'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Contacts View
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="lead">Leads</option>
              <option value="prospect">Prospects</option>
              <option value="client">Clients</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {activeView === 'pipeline' ? (
          <PipelineView
            stages={pipelineStages}
            onContactMove={handleContactMove}
            onContactClick={handleContactClick}
          />
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
      </Card>
    </div>
  );
};

export default CRMDashboard;