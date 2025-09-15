'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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

interface BulkActionsProps {
  selectedContacts: Contact[];
  onClose: () => void;
  onUpdateStatus: (contactIds: string[], newStatus: Contact['status']) => void;
  onUpdateTags: (contactIds: string[], tags: string[]) => void;
  onSendEmail: (contactIds: string[]) => void;
  onScheduleCall: (contactIds: string[]) => void;
  onDeleteContacts: (contactIds: string[]) => void;
  onExportContacts: (contactIds: string[]) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedContacts,
  onClose,
  onUpdateStatus,
  onUpdateTags,
  onSendEmail,
  onScheduleCall,
  onDeleteContacts,
  onExportContacts
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Contact['status']>('lead');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const contactIds = selectedContacts.map(c => c.id);

  const handleStatusUpdate = () => {
    onUpdateStatus(contactIds, newStatus);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim())) {
      setNewTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagUpdate = () => {
    onUpdateTags(contactIds, newTags);
    onClose();
  };

  const bulkActions = [
    {
      id: 'status',
      label: 'Update Status',
      icon: '🔄',
      description: 'Change status for all selected contacts',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'tags',
      label: 'Add Tags',
      icon: '🏷️',
      description: 'Add tags to selected contacts',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: '📧',
      description: 'Send bulk email campaign',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'call',
      label: 'Schedule Call',
      icon: '📞',
      description: 'Schedule follow-up calls',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'export',
      label: 'Export Data',
      icon: '📤',
      description: 'Export selected contacts to CSV',
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      id: 'delete',
      label: 'Delete Contacts',
      icon: '🗑️',
      description: 'Remove selected contacts',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk Actions</h2>
              <p className="text-gray-600 mt-1">
                Perform actions on {selectedContacts.length} selected contact{selectedContacts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected Contacts Preview */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Selected Contacts:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{contact.name}</span>
                </div>
              ))}
              {selectedContacts.length > 5 && (
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-blue-200">
                  <span className="text-sm text-gray-500">+{selectedContacts.length - 5} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Selection */}
          {!activeAction && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {bulkActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveAction(action.id)}
                  className={`p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105 ${action.color} text-left`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Status Update Form */}
          {activeAction === 'status' && (
            <Card variant="default" className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Contact Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Contact['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="lead">🌱 Lead</option>
                      <option value="prospect">🎯 Prospect</option>
                      <option value="client">✅ Client</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button onClick={() => setActiveAction(null)} variant="ghost">
                      Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate} variant="primary">
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tags Update Form */}
          {activeAction === 'tags' && (
            <Card variant="default" className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Tags to Contacts</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags to Add
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Enter tag name"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button onClick={() => setActiveAction(null)} variant="ghost">
                      Cancel
                    </Button>
                    <Button onClick={handleTagUpdate} variant="primary" disabled={newTags.length === 0}>
                      Add Tags
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          {activeAction && activeAction !== 'status' && activeAction !== 'tags' && (
            <Card variant="default" className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {bulkActions.find(a => a.id === activeAction)?.label}
                </h3>
                <p className="text-gray-600 mb-6">
                  {bulkActions.find(a => a.id === activeAction)?.description}
                </p>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setActiveAction(null)} variant="ghost">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      switch (activeAction) {
                        case 'email':
                          onSendEmail(contactIds);
                          break;
                        case 'call':
                          onScheduleCall(contactIds);
                          break;
                        case 'export':
                          onExportContacts(contactIds);
                          break;
                        case 'delete':
                          onDeleteContacts(contactIds);
                          break;
                      }
                      onClose();
                    }}
                    className={activeAction === 'delete' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                  >
                    {activeAction === 'delete' ? 'Delete Contacts' :
                     activeAction === 'export' ? 'Export Data' :
                     `Send ${bulkActions.find(a => a.id === activeAction)?.label}`}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;