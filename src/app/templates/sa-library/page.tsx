'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SATemplateSelector from '@/components/templates/SATemplateSelector';

export default function SALibraryPage() {
  const router = useRouter();

  const handleSelectTemplate = (template: unknown) => {
    // Navigate to editor with selected template
    const templateData = template as { id: string };
    router.push(`/templates/editor?id=${templateData.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">South African Template Library</h1>
                <p className="text-gray-600 mt-1">
                  Professional property marketing templates designed for the South African market
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SATemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>
      </main>
    </div>
  );
}