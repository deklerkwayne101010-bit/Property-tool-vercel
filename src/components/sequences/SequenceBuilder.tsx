'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface SequenceStep {
  id: string;
  stepNumber: number;
  delayDays: number;
  delayHours: number;
  delayMinutes: number;
  channel: 'email' | 'sms' | 'whatsapp';
  templateId: string;
  templateName: string;
  conditions: {
    openRate?: number;
    clickRate?: number;
    responseReceived?: boolean;
  };
  isActive: boolean;
}

interface Sequence {
  id?: string;
  name: string;
  description: string;
  trigger: {
    type: 'manual' | 'property_import' | 'contact_added' | 'scheduled';
    propertyId?: string;
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      dayOfWeek?: number;
      dayOfMonth?: number;
      time: string;
    };
  };
  targetAudience: {
    tags: string[];
    propertyTypes: string[];
    priceRange: {
      min?: number;
      max?: number;
    };
    locations: string[];
  };
  steps: SequenceStep[];
  isActive: boolean;
  settings: {
    respectDoNotDisturb: boolean;
    maxMessagesPerDay: number;
    timezone: string;
    businessHours: {
      start: string;
      end: string;
      daysOfWeek: number[];
    };
  };
}

interface SequenceBuilderProps {
  sequence?: Sequence;
  onSave?: (sequence: Sequence) => void;
  onCancel?: () => void;
  templates?: Array<{
    id: string;
    name: string;
    channel: 'email' | 'sms' | 'whatsapp';
    category: string;
  }>;
}

export default function SequenceBuilder({
  sequence,
  onSave,
  onCancel,
  templates = []
}: SequenceBuilderProps) {
  const [currentSequence, setCurrentSequence] = useState<Sequence>(
    sequence || {
      name: '',
      description: '',
      trigger: { type: 'manual' },
      targetAudience: {
        tags: [],
        propertyTypes: [],
        priceRange: {},
        locations: []
      },
      steps: [],
      isActive: true,
      settings: {
        respectDoNotDisturb: true,
        maxMessagesPerDay: 50,
        timezone: 'Africa/Johannesburg',
        businessHours: {
          start: '08:00',
          end: '18:00',
          daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
        }
      }
    }
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'steps' | 'audience' | 'settings'>('basic');
  const [draggedStep, setDraggedStep] = useState<SequenceStep | null>(null);

  const addStep = useCallback(() => {
    const newStep: SequenceStep = {
      id: `step_${Date.now()}`,
      stepNumber: currentSequence.steps.length + 1,
      delayDays: 0,
      delayHours: 0,
      delayMinutes: 0,
      channel: 'email',
      templateId: '',
      templateName: '',
      conditions: {},
      isActive: true
    };

    setCurrentSequence(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  }, [currentSequence.steps.length]);

  const updateStep = useCallback((stepId: string, updates: Partial<SequenceStep>) => {
    setCurrentSequence(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setCurrentSequence(prev => ({
      ...prev,
      steps: prev.steps
        .filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, stepNumber: index + 1 }))
    }));
  }, []);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    setCurrentSequence(prev => {
      const newSteps = [...prev.steps];
      const [movedStep] = newSteps.splice(fromIndex, 1);
      newSteps.splice(toIndex, 0, movedStep);

      // Update step numbers
      return {
        ...prev,
        steps: newSteps.map((step, index) => ({ ...step, stepNumber: index + 1 }))
      };
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!currentSequence.name.trim()) {
      alert('Please enter a sequence name');
      return;
    }

    if (currentSequence.steps.length === 0) {
      alert('Please add at least one step to the sequence');
      return;
    }

    // Validate steps
    for (const step of currentSequence.steps) {
      if (!step.templateId) {
        alert(`Step ${step.stepNumber}: Please select a template`);
        return;
      }
    }

    if (onSave) {
      onSave(currentSequence);
    }
  }, [currentSequence, onSave]);

  const filteredTemplates = templates.filter(template =>
    !currentSequence.steps.some(step => step.templateId === template.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {sequence ? 'Edit Sequence' : 'Create New Sequence'}
          </h1>
          <p className="text-gray-600 mt-1">
            Build automated follow-up sequences for your contacts
          </p>
        </div>
        <div className="flex space-x-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>
            {sequence ? 'Update Sequence' : 'Create Sequence'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'steps', label: 'Sequence Steps' },
            { id: 'audience', label: 'Target Audience' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'basic' && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sequence Name *
                </label>
                <Input
                  value={currentSequence.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentSequence(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., New Property Follow-up"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={currentSequence.description}
                  onChange={(e) =>
                    setCurrentSequence(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe what this sequence is for..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'manual', label: 'Manual - Start when I choose' },
                    { value: 'property_import', label: 'Property Import - When I import a property' },
                    { value: 'contact_added', label: 'Contact Added - When I add a new contact' },
                    { value: 'scheduled', label: 'Scheduled - Run on a schedule' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={currentSequence.trigger.type === option.value}
                        onChange={(e) =>
                          setCurrentSequence(prev => ({
                            ...prev,
                            trigger: { ...prev.trigger, type: e.target.value as any }
                          }))
                        }
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sequence Steps</h3>
              <Button onClick={addStep}>
                Add Step
              </Button>
            </div>

            {currentSequence.steps.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-lg mb-2">No steps added yet</p>
                  <p className="text-sm">Add your first step to start building the sequence</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentSequence.steps.map((step, index) => (
                  <Card key={step.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {step.stepNumber}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Delay
                            </label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                value={step.delayDays}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })
                                }
                                placeholder="Days"
                                className="w-20"
                              />
                              <Input
                                type="number"
                                value={step.delayHours}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateStep(step.id, { delayHours: parseInt(e.target.value) || 0 })
                                }
                                placeholder="Hours"
                                className="w-20"
                              />
                              <Input
                                type="number"
                                value={step.delayMinutes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateStep(step.id, { delayMinutes: parseInt(e.target.value) || 0 })
                                }
                                placeholder="Minutes"
                                className="w-20"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Channel
                            </label>
                            <select
                              value={step.channel}
                              onChange={(e) =>
                                updateStep(step.id, { channel: e.target.value as any })
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                              <option value="whatsapp">WhatsApp</option>
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Template
                            </label>
                            <select
                              value={step.templateId}
                              onChange={(e) => {
                                const template = templates.find(t => t.id === e.target.value);
                                updateStep(step.id, {
                                  templateId: e.target.value,
                                  templateName: template?.name || ''
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select a template...</option>
                              {[...templates, ...currentSequence.steps
                                .filter(s => s.id !== step.id && s.templateId)
                                .map(s => ({ id: s.templateId, name: s.templateName, channel: s.channel, category: '' }))
                              ].map((template) => (
                                <option key={template.id} value={template.id}>
                                  {template.name} ({template.channel})
                                </option>
                              ))}
                            </select>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>

                        {step.templateId && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            Template: {step.templateName}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audience' && (
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Target Audience</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Tags
                </label>
                <Input
                  value={currentSequence.targetAudience.tags.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentSequence(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      }
                    }))
                  }
                  placeholder="buyer, investor, first-time (comma separated)"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Types
                </label>
                <Input
                  value={currentSequence.targetAudience.propertyTypes.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentSequence(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        propertyTypes: e.target.value.split(',').map(type => type.trim()).filter(type => type)
                      }
                    }))
                  }
                  placeholder="apartment, house, townhouse (comma separated)"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price (R)
                  </label>
                  <Input
                    type="number"
                    value={currentSequence.targetAudience.priceRange.min || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentSequence(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          priceRange: {
                            ...prev.targetAudience.priceRange,
                            min: parseInt(e.target.value) || undefined
                          }
                        }
                      }))
                    }
                    placeholder="500000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price (R)
                  </label>
                  <Input
                    type="number"
                    value={currentSequence.targetAudience.priceRange.max || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentSequence(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          priceRange: {
                            ...prev.targetAudience.priceRange,
                            max: parseInt(e.target.value) || undefined
                          }
                        }
                      }))
                    }
                    placeholder="2000000"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations
                </label>
                <Input
                  value={currentSequence.targetAudience.locations.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentSequence(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        locations: e.target.value.split(',').map(loc => loc.trim()).filter(loc => loc)
                      }
                    }))
                  }
                  placeholder="Cape Town, Johannesburg, Durban (comma separated)"
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Sequence Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="respect-do-not-disturb"
                    checked={currentSequence.settings.respectDoNotDisturb}
                    onChange={(e) =>
                      setCurrentSequence(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          respectDoNotDisturb: e.target.checked
                        }
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="respect-do-not-disturb" className="text-sm text-gray-700">
                    Respect business hours and do-not-disturb settings
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Messages Per Day
                  </label>
                  <Input
                    type="number"
                    value={currentSequence.settings.maxMessagesPerDay}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentSequence(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          maxMessagesPerDay: parseInt(e.target.value) || 50
                        }
                      }))
                    }
                    className="w-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <Input
                        type="time"
                        value={currentSequence.settings.businessHours.start}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCurrentSequence(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              businessHours: {
                                ...prev.settings.businessHours,
                                start: e.target.value
                              }
                            }
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <Input
                        type="time"
                        value={currentSequence.settings.businessHours.end}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCurrentSequence(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              businessHours: {
                                ...prev.settings.businessHours,
                                end: e.target.value
                              }
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 1, label: 'Mon' },
                      { value: 2, label: 'Tue' },
                      { value: 3, label: 'Wed' },
                      { value: 4, label: 'Thu' },
                      { value: 5, label: 'Fri' },
                      { value: 6, label: 'Sat' },
                      { value: 0, label: 'Sun' }
                    ].map((day) => (
                      <label key={day.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={currentSequence.settings.businessHours.daysOfWeek.includes(day.value)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...currentSequence.settings.businessHours.daysOfWeek, day.value]
                              : currentSequence.settings.businessHours.daysOfWeek.filter(d => d !== day.value);

                            setCurrentSequence(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                businessHours: {
                                  ...prev.settings.businessHours,
                                  daysOfWeek: days
                                }
                              }
                            }));
                          }}
                          className="mr-1"
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}