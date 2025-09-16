'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
  notes?: string;
  propertyType?: string;
  location?: string;
}

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    status: 'lead',
    source: 'website',
    budget: { min: 0, max: 0 },
    tags: [],
    notes: '',
    propertyType: '',
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData({
        ...contact,
        budget: contact.budget || { min: 0, max: 0 }
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'lead',
        source: 'website',
        budget: { min: 0, max: 0 },
        tags: [],
        notes: '',
        propertyType: '',
        location: ''
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+27|0)[6-8][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid South African phone number';
    }

    if (formData.budget?.min && formData.budget?.max && formData.budget.min > formData.budget.max) {
      newErrors.budget = 'Minimum budget cannot be greater than maximum budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const contactData: Contact = {
      id: contact?.id || Date.now().toString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      status: formData.status as Contact['status'] || 'lead',
      source: formData.source || 'website',
      budget: formData.budget,
      lastContact: contact?.lastContact || new Date(),
      nextFollowUp: formData.nextFollowUp,
      tags: formData.tags || [],
      notes: formData.notes,
      propertyType: formData.propertyType,
      location: formData.location
    };

    onSave(contactData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onCancel}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+27 82 123 4567"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'lead'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Contact['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="lead">🌱 Lead</option>
                  <option value="prospect">🎯 Prospect</option>
                  <option value="client">✅ Client</option>
                </select>
              </div>
            </div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">🏢 Apartment</option>
                  <option value="house">🏠 House</option>
                  <option value="townhouse">🏘️ Townhouse</option>
                  <option value="duplex">🏘️ Duplex</option>
                  <option value="vacant-land">🌳 Vacant Land</option>
                  <option value="commercial">🏢 Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Location
                </label>
                <select
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select location</option>
                  <option value="sandton">Sandton</option>
                  <option value="johannesburg">Johannesburg</option>
                  <option value="cape-town">Cape Town</option>
                  <option value="pretoria">Pretoria</option>
                  <option value="durban">Durban</option>
                  <option value="east-london">East London</option>
                  <option value="port-elizabeth">Port Elizabeth</option>
                </select>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (ZAR)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    value={formData.budget?.min || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budget: { ...prev.budget!, min: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="Minimum budget"
                    min="0"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={formData.budget?.max || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budget: { ...prev.budget!, max: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="Maximum budget"
                    min="0"
                  />
                </div>
              </div>
              {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
              {(formData.budget?.min || 0) > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Budget: {formatCurrency(formData.budget?.min || 0)} - {formatCurrency(formData.budget?.max || 0)}
                </p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Source
              </label>
              <select
                value={formData.source || 'website'}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="website">🌐 Website</option>
                <option value="referral">🤝 Referral</option>
                <option value="social">📱 Social Media</option>
                <option value="open-house">🏠 Open House</option>
                <option value="advertisement">📢 Advertisement</option>
                <option value="cold-call">📞 Cold Call</option>
                <option value="property24">🏠 Property24</option>
                <option value="private-property">🏘️ Private Property</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this contact..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {contact ? 'Update Contact' : 'Save Contact'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;