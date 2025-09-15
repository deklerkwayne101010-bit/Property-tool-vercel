'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface TemplateVariable {
  name: string;
  description: string;
  required: boolean;
  defaultValue: string;
}

interface Template {
  id?: string;
  name: string;
  description: string;
  category: 'welcome' | 'follow_up' | 'property_update' | 'market_report' | 'custom';
  channel: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  content: string;
  variables: TemplateVariable[];
  tags: string[];
  isActive: boolean;
  isDefault: boolean;
}

interface TemplateEditorProps {
  template?: Template;
  onSave?: (template: Template) => void;
  onCancel?: () => void;
  onPreview?: (template: Template) => void;
}

export default function TemplateEditor({
  template,
  onSave,
  onCancel,
  onPreview
}: TemplateEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(
    template || {
      name: '',
      description: '',
      category: 'custom',
      channel: 'email',
      subject: '',
      content: '',
      variables: [],
      tags: [],
      isActive: true,
      isDefault: false
    }
  );

  const [previewMode, setPreviewMode] = useState(false);
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});

  // Initialize preview variables when template changes
  useEffect(() => {
    const initialVars: Record<string, string> = {};
    currentTemplate.variables.forEach(variable => {
      initialVars[variable.name] = variable.defaultValue || '';
    });
    setPreviewVariables(initialVars);
  }, [currentTemplate.variables]);

  const addVariable = useCallback(() => {
    const newVariable: TemplateVariable = {
      name: '',
      description: '',
      required: false,
      defaultValue: ''
    };

    setCurrentTemplate(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable]
    }));
  }, []);

  const updateVariable = useCallback((index: number, updates: Partial<TemplateVariable>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      variables: prev.variables.map((variable, i) =>
        i === index ? { ...variable, ...updates } : variable
      )
    }));
  }, []);

  const removeVariable = useCallback((index: number) => {
    setCurrentTemplate(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  }, []);

  const insertVariable = useCallback((variableName: string) => {
    const placeholder = `{{${variableName}}}`;
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);

      setCurrentTemplate(prev => ({
        ...prev,
        content: before + placeholder + after
      }));

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  }, []);

  const renderPreview = useCallback(() => {
    let content = currentTemplate.content;

    // Replace variables with preview values
    currentTemplate.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const value = previewVariables[variable.name] || variable.defaultValue || `[${variable.name}]`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }, [currentTemplate.content, currentTemplate.variables, previewVariables]);

  const handleSave = useCallback(() => {
    if (!currentTemplate.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (!currentTemplate.content.trim()) {
      alert('Please enter template content');
      return;
    }

    if (currentTemplate.channel === 'email' && !currentTemplate.subject?.trim()) {
      alert('Please enter an email subject');
      return;
    }

    // Validate variables
    for (const variable of currentTemplate.variables) {
      if (!variable.name.trim()) {
        alert('All variables must have a name');
        return;
      }
    }

    if (onSave) {
      onSave(currentTemplate);
    }
  }, [currentTemplate, onSave]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(currentTemplate);
    } else {
      setPreviewMode(!previewMode);
    }
  }, [currentTemplate, onPreview, previewMode]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h1>
          <p className="text-gray-600 mt-1">
            Create reusable templates for your automated communications
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePreview}>
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <Input
                  value={currentTemplate.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Welcome Email"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                  value={currentTemplate.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentTemplate(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of this template"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={currentTemplate.category}
                    onChange={(e) =>
                      setCurrentTemplate(prev => ({ ...prev, category: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="welcome">Welcome</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="property_update">Property Update</option>
                    <option value="market_report">Market Report</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel *
                  </label>
                  <select
                    value={currentTemplate.channel}
                    onChange={(e) =>
                      setCurrentTemplate(prev => ({ ...prev, channel: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>

              {currentTemplate.channel === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject *
                  </label>
                  <Input
                    value={currentTemplate.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentTemplate(prev => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Email subject line"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Content Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Content</h3>
              {!previewMode && (
                <div className="text-sm text-gray-500">
                  Use {'{{variable_name}}'} for dynamic content
                </div>
              )}
            </div>

            {previewMode ? (
              <div className="space-y-4">
                {currentTemplate.channel === 'email' && currentTemplate.subject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Preview
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      {(() => {
                        let subject = currentTemplate.subject!;
                        currentTemplate.variables.forEach(variable => {
                          const placeholder = `{{${variable.name}}}`;
                          const value = previewVariables[variable.name] || variable.defaultValue || `[${variable.name}]`;
                          subject = subject.replace(new RegExp(placeholder, 'g'), value);
                        });
                        return subject;
                      })()}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Preview
                  </label>
                  <div className="p-4 bg-gray-50 rounded border min-h-[200px] whitespace-pre-wrap">
                    {renderPreview()}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  id="template-content"
                  value={currentTemplate.content}
                  onChange={(e) =>
                    setCurrentTemplate(prev => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Enter your template content here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px] resize-vertical"
                  rows={15}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Variables */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Variables</h3>
              <Button size="sm" onClick={addVariable}>
                Add Variable
              </Button>
            </div>

            {currentTemplate.variables.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No variables defined. Add variables to make your template dynamic.
              </p>
            ) : (
              <div className="space-y-3">
                {currentTemplate.variables.map((variable, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={variable.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateVariable(index, { name: e.target.value })
                        }
                        placeholder="Variable name"
                        className="flex-1 mr-2"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => insertVariable(variable.name)}
                        disabled={!variable.name.trim()}
                      >
                        Insert
                      </Button>
                    </div>

                    <Input
                      value={variable.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateVariable(index, { description: e.target.value })
                      }
                      placeholder="Description (optional)"
                      className="w-full"
                    />

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={variable.required}
                        onChange={(e) =>
                          updateVariable(index, { required: e.target.checked })
                        }
                      />
                      <label htmlFor={`required-${index}`} className="text-sm text-gray-700">
                        Required
                      </label>
                    </div>

                    <Input
                      value={variable.defaultValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateVariable(index, { defaultValue: e.target.value })
                      }
                      placeholder="Default value"
                      className="w-full"
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeVariable(index)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Remove Variable
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Preview Variables */}
          {previewMode && currentTemplate.variables.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preview Variables</h3>
              <div className="space-y-3">
                {currentTemplate.variables.map((variable, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.name}
                      {variable.required && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      value={previewVariables[variable.name] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPreviewVariables(prev => ({
                          ...prev,
                          [variable.name]: e.target.value
                        }))
                      }
                      placeholder={variable.defaultValue || `Enter ${variable.name}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={currentTemplate.isActive}
                  onChange={(e) =>
                    setCurrentTemplate(prev => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="mr-2"
                />
                <label htmlFor="is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={currentTemplate.isDefault}
                  onChange={(e) =>
                    setCurrentTemplate(prev => ({ ...prev, isDefault: e.target.checked }))
                  }
                  className="mr-2"
                />
                <label htmlFor="is-default" className="text-sm text-gray-700">
                  Default for category
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <Input
                  value={currentTemplate.tags.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentTemplate(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))
                  }
                  placeholder="tag1, tag2, tag3"
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}