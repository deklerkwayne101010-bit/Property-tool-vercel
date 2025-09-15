'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Note {
  id: string;
  content: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'follow-up';
  createdAt: Date;
  createdBy: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'offer' | 'sale';
  description: string;
  date: Date;
  outcome?: string;
  value?: number;
}

interface ContactNotesProps {
  contactId: string;
  notes: Note[];
  activities: Activity[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'createdBy'>) => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onDeleteNote: (noteId: string) => void;
}

const ContactNotes: React.FC<ContactNotesProps> = ({
  contactId,
  notes,
  activities,
  onAddNote,
  onAddActivity,
  onDeleteNote
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'activities'>('notes');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('note');
  const [showAddNote, setShowAddNote] = useState(false);

  const [newActivity, setNewActivity] = useState({
    type: 'call' as Activity['type'],
    description: '',
    date: new Date().toISOString().split('T')[0],
    outcome: '',
    value: ''
  });
  const [showAddActivity, setShowAddActivity] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote({
        content: newNote.trim(),
        type: noteType
      });
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.description.trim()) {
      onAddActivity({
        ...newActivity,
        date: new Date(newActivity.date),
        value: newActivity.value ? parseFloat(newActivity.value) : undefined
      });
      setNewActivity({
        type: 'call',
        description: '',
        date: new Date().toISOString().split('T')[0],
        outcome: '',
        value: ''
      });
      setShowAddActivity(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNoteTypeIcon = (type: Note['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'follow-up': return '⏰';
      default: return '📝';
    }
  };

  const getActivityTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'viewing': return '🏠';
      case 'offer': return '💰';
      case 'sale': return '✅';
      default: return '📝';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'notes'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'activities'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Activities ({activities.length})
        </button>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <Card variant="default" className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact Notes</h3>
              <Button
                onClick={() => setShowAddNote(!showAddNote)}
                variant="outline"
                size="sm"
              >
                {showAddNote ? 'Cancel' : '+ Add Note'}
              </Button>
            </div>

            {/* Add Note Form */}
            {showAddNote && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note Type
                    </label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as Note['type'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="note">📝 General Note</option>
                      <option value="call">📞 Call</option>
                      <option value="email">📧 Email</option>
                      <option value="meeting">🤝 Meeting</option>
                      <option value="follow-up">⏰ Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note Content
                    </label>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter your note..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setShowAddNote(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNote}
                      variant="primary"
                      size="sm"
                      disabled={!newNote.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-4">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-lg font-medium">No notes yet</p>
                  <p className="text-sm">Add your first note to start tracking interactions</p>
                </div>
              ) : (
                notes
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((note) => (
                    <div key={note.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-lg">{getNoteTypeIcon(note.type)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {note.type.replace('-', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              by {note.createdBy}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(note.createdAt)}
                            </span>
                            <button
                              onClick={() => onDeleteNote(note.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <Card variant="default" className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
              <Button
                onClick={() => setShowAddActivity(!showAddActivity)}
                variant="outline"
                size="sm"
              >
                {showAddActivity ? 'Cancel' : '+ Add Activity'}
              </Button>
            </div>

            {/* Add Activity Form */}
            {showAddActivity && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type
                    </label>
                    <select
                      value={newActivity.type}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as Activity['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    >
                      <option value="call">📞 Call</option>
                      <option value="email">📧 Email</option>
                      <option value="meeting">🤝 Meeting</option>
                      <option value="viewing">🏠 Property Viewing</option>
                      <option value="offer">💰 Offer Made</option>
                      <option value="sale">✅ Sale Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the activity..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outcome
                    </label>
                    <input
                      type="text"
                      value={newActivity.outcome}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, outcome: e.target.value }))}
                      placeholder="Result of activity..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value (ZAR)
                    </label>
                    <input
                      type="number"
                      value={newActivity.value}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-2">
                    <Button
                      onClick={() => setShowAddActivity(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddActivity}
                      variant="primary"
                      size="sm"
                      disabled={!newActivity.description.trim()}
                    >
                      Add Activity
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Activities Timeline */}
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-lg font-medium">No activities yet</p>
                  <p className="text-sm">Track calls, meetings, and other interactions</p>
                </div>
              ) : (
                activities
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{getActivityTypeIcon(activity.type)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 capitalize">
                            {activity.type.replace('-', ' ')}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                        {activity.outcome && (
                          <p className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md inline-block mb-2">
                            Outcome: {activity.outcome}
                          </p>
                        )}
                        {activity.value && (
                          <p className="text-sm font-medium text-blue-700">
                            Value: {formatCurrency(activity.value)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContactNotes;