'use client';

import React from 'react';

interface CRMQuickActionsProps {
  onAddContact: () => void;
  onSendEmail: () => void;
  onScheduleCall: () => void;
  onCreateTask: () => void;
  onViewCalendar: () => void;
  onGenerateReport: () => void;
  onImportContacts: () => void;
  onExportContacts: () => void;
}

const CRMQuickActions: React.FC<CRMQuickActionsProps> = ({
  onAddContact,
  onSendEmail,
  onScheduleCall,
  onCreateTask,
  onViewCalendar,
  onGenerateReport,
  onImportContacts,
  onExportContacts
}) => {
  const quickActions = [
    {
      id: 'add-contact',
      label: 'Add Contact',
      icon: '👤',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: onAddContact,
      description: 'Add new lead or client'
    },
    {
      id: 'send-email',
      label: 'Send Email',
      icon: '📧',
      color: 'bg-green-500 hover:bg-green-600',
      action: onSendEmail,
      description: 'Send bulk email campaign'
    },
    {
      id: 'schedule-call',
      label: 'Schedule Call',
      icon: '📞',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: onScheduleCall,
      description: 'Schedule follow-up calls'
    },
    {
      id: 'create-task',
      label: 'Create Task',
      icon: '✅',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: onCreateTask,
      description: 'Add follow-up tasks'
    },
    {
      id: 'view-calendar',
      label: 'Calendar',
      icon: '📅',
      color: 'bg-teal-500 hover:bg-teal-600',
      action: onViewCalendar,
      description: 'View appointments & meetings'
    },
    {
      id: 'generate-report',
      label: 'Reports',
      icon: '📊',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: onGenerateReport,
      description: 'Generate performance reports'
    },
    {
      id: 'import-contacts',
      label: 'Import',
      icon: '📥',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: onImportContacts,
      description: 'Import contacts from CSV'
    },
    {
      id: 'export-contacts',
      label: 'Export',
      icon: '📤',
      color: 'bg-red-500 hover:bg-red-600',
      action: onExportContacts,
      description: 'Export contacts to CSV'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`group relative p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${action.color}`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-center leading-tight">
                {action.label}
              </span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {action.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Add Contact:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + N</kbd>
          </div>
          <div className="flex justify-between">
            <span>Search:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + F</kbd>
          </div>
          <div className="flex justify-between">
            <span>Export:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + E</kbd>
          </div>
          <div className="flex justify-between">
            <span>Bulk Actions:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + A</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMQuickActions;