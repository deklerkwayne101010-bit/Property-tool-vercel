'use client';

import React, { useState } from 'react';

const CRMDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'contacts' | 'pipeline'>('overview');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'lead' as 'lead' | 'prospect' | 'client',
    source: 'website',
    budgetMin: '',
    budgetMax: ''
  });
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+27 82 123 4567',
      status: 'lead',
      source: 'website',
      budget: { min: 2500000, max: 4000000 },
      lastContact: new Date('2024-01-15'),
      tags: ['first-time-buyer', 'sandton']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+27 83 987 6543',
      status: 'prospect',
      source: 'referral',
      budget: { min: 5000000, max: 7000000 },
      lastContact: new Date('2024-01-10'),
      tags: ['luxury', 'cape-town']
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+27 84 456 7890',
      status: 'client',
      source: 'open-house',
      budget: { min: 3500000, max: 4500000 },
      lastContact: new Date('2024-01-12'),
      tags: ['family', 'johannesburg']
    }
  ]);

  const totalContacts = contacts.length;
  const closedDeals = contacts.filter(c => c.status === 'client').length;

  const handleAddContact = () => {
    setShowAddContact(true);
  };

  const handleSaveContact = () => {
    if (newContact.name && newContact.email) {
      const contact = {
        id: Date.now().toString(),
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        status: newContact.status,
        source: newContact.source,
        budget: {
          min: parseInt(newContact.budgetMin) || 0,
          max: parseInt(newContact.budgetMax) || 0
        },
        lastContact: new Date(),
        tags: []
      };

      setContacts(prev => [...prev, contact]);
      setShowAddContact(false);
      setNewContact({
        name: '',
        email: '',
        phone: '',
        status: 'lead',
        source: 'website',
        budgetMin: '',
        budgetMax: ''
      });
    }
  };

  const handleCancelAdd = () => {
    setShowAddContact(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      status: 'lead',
      source: 'website',
      budgetMin: '',
      budgetMax: ''
    });
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
    }
  };

  const handleEditContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setNewContact({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: contact.status as 'lead' | 'prospect' | 'client',
        source: contact.source,
        budgetMin: contact.budget?.min?.toString() || '',
        budgetMax: contact.budget?.max?.toString() || ''
      });
      setShowAddContact(true);
      // Note: In a real app, you'd want to track which contact is being edited
    }
  };

  return (
    <div className="crm-dashboard space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">CRM Dashboard</h1>
              <p className="text-xl text-blue-100 mb-4">Manage your leads, track your sales pipeline, and close more deals</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time updates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span>🇿🇦</span>
                  <span>ZAR Currency</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalContacts}</div>
                  <div className="text-sm text-blue-100">Total Contacts</div>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{closedDeals}</div>
                  <div className="text-sm text-blue-100">Closed Deals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeView === 'overview'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveView('contacts')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeView === 'contacts'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Contacts
            </button>
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeView === 'pipeline'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Key metrics and insights for your sales performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Contacts</p>
                    <p className="text-3xl font-bold">{totalContacts}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Closed Deals</p>
                    <p className="text-3xl font-bold">{closedDeals}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Active Leads</p>
                    <p className="text-3xl font-bold">{contacts.filter(c => c.status === 'lead').length}</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Prospects</p>
                    <p className="text-3xl font-bold">{contacts.filter(c => c.status === 'prospect').length}</p>
                  </div>
                  <div className="text-4xl">🚀</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {contacts.slice(0, 3).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">Last contact: {contact.lastContact.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'client' ? 'bg-green-100 text-green-800' :
                      contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'contacts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Management</h3>
                <p className="text-gray-600">Manage your leads and prospects</p>
              </div>
              <button
                onClick={handleAddContact}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Contact
              </button>
            </div>

            {/* Contact List */}
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-gray-600 text-sm">{contact.email}</p>
                        <p className="text-gray-600 text-sm">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'client' ? 'bg-green-100 text-green-800' :
                        contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.status}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          R{(contact.budget?.max || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Budget</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Source: {contact.source}</span>
                      <span>Last contact: {contact.lastContact.toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditContact(contact.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'pipeline' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sales Pipeline</h3>
              <p className="text-gray-600">Track your deals through the sales process</p>
            </div>

            {/* Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* New Leads */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">New Leads</h4>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {contacts.filter(c => c.status === 'lead').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {contacts.filter(c => c.status === 'lead').map((contact) => (
                    <div key={contact.id} className="bg-yellow-50 rounded p-3 border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">R{(contact.budget?.max || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualified */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Qualified</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {contacts.filter(c => c.status === 'prospect').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {contacts.filter(c => c.status === 'prospect').map((contact) => (
                    <div key={contact.id} className="bg-blue-50 rounded p-3 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">R{(contact.budget?.max || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposal */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Proposal</h4>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">0</span>
                </div>
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No proposals</p>
                </div>
              </div>

              {/* Negotiation */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Negotiation</h4>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">0</span>
                </div>
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No negotiations</p>
                </div>
              </div>

              {/* Closed Won */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Closed Won</h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {contacts.filter(c => c.status === 'client').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {contacts.filter(c => c.status === 'client').map((contact) => (
                    <div key={contact.id} className="bg-green-50 rounded p-3 border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">R{(contact.budget?.max || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCancelAdd}></div>

            <div className="relative z-[1500] inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Contact</h2>
                  <p className="text-gray-600 mt-1">Enter contact information</p>
                </div>
                <button
                  onClick={handleCancelAdd}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (R)</label>
                    <input
                      type="number"
                      value={newContact.budgetMin}
                      onChange={(e) => setNewContact(prev => ({ ...prev, budgetMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget (R)</label>
                    <input
                      type="number"
                      value={newContact.budgetMax}
                      onChange={(e) => setNewContact(prev => ({ ...prev, budgetMax: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newContact.status}
                    onChange={(e) => setNewContact(prev => ({ ...prev, status: e.target.value as 'lead' | 'prospect' | 'client' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={newContact.source}
                    onChange={(e) => setNewContact(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="open-house">Open House</option>
                    <option value="social-media">Social Media</option>
                    <option value="cold-call">Cold Call</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  disabled={!newContact.name || !newContact.email}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMDashboard;