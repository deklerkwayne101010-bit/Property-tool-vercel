'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SequenceBuilder from '@/components/sequences/SequenceBuilder';

export default function SequenceBuilderPage() {
  const router = useRouter();

  const handleSave = async (sequence: unknown) => {
    try {
      const response = await fetch('/api/sequences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(sequence)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save sequence');
      }

      // Redirect to sequences list or show success message
      router.push('/sequences');

    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save sequence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    router.push('/sequences');
  };

  // Mock templates data - in real app this would come from API
  const mockTemplates = [
    { id: '1', name: 'Welcome Email', channel: 'email' as const, category: 'welcome' },
    { id: '2', name: 'Property Update', channel: 'email' as const, category: 'follow_up' },
    { id: '3', name: 'Market Report', channel: 'email' as const, category: 'market_report' },
    { id: '4', name: 'Welcome SMS', channel: 'sms' as const, category: 'welcome' },
    { id: '5', name: 'Follow-up SMS', channel: 'sms' as const, category: 'follow_up' },
    { id: '6', name: 'WhatsApp Welcome', channel: 'whatsapp' as const, category: 'welcome' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SequenceBuilder
        onSave={handleSave}
        onCancel={handleCancel}
        templates={mockTemplates}
      />
    </div>
  );
}