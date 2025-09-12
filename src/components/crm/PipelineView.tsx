'use client';

import React from 'react';
import Card from '@/components/ui/Card';

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

interface PipelineViewProps {
  stages: PipelineStage[];
  onContactMove: (contactId: string, fromStageId: string, toStageId: string) => void;
  onContactClick: (contactId: string) => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({
  stages,
  onContactMove,
  onContactClick
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalValue = (stage: PipelineStage) => {
    return stage.contacts.reduce((sum, contact) => sum + contact.value, 0);
  };

  const getAverageDays = (stage: PipelineStage) => {
    if (stage.contacts.length === 0) return 0;
    const totalDays = stage.contacts.reduce((sum, contact) => sum + contact.daysInStage, 0);
    return Math.round(totalDays / stage.contacts.length);
  };

  return (
    <div className="pipeline-view">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stages.map((stage, stageIndex) => (
          <div key={stage.id} className="pipeline-stage">
            <Card variant="default" className="h-full">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {stage.contacts.length}
                </span>
              </div>

              {/* Stage Stats */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(getTotalValue(stage))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Days:</span>
                  <span className="font-semibold text-gray-900">
                    {getAverageDays(stage)}
                  </span>
                </div>
              </div>

              {/* Contacts List */}
              <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
                {stage.contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No contacts in this stage</p>
                  </div>
                ) : (
                  stage.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => onContactClick(contact.id)}
                      className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {contact.name}
                        </h4>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {contact.daysInStage}d
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(contact.value)}
                        </span>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {stageIndex < stages.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onContactMove(contact.id, stage.id, stages[stageIndex + 1].id);
                              }}
                              className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors duration-200"
                              title="Move to next stage"
                            >
                              →
                            </button>
                          )}
                          {stageIndex > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onContactMove(contact.id, stage.id, stages[stageIndex - 1].id);
                              }}
                              className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-600 transition-colors duration-200"
                              title="Move to previous stage"
                            >
                              ←
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Contact Button */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Contact
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Pipeline Summary */}
      <Card variant="gradient" className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Pipeline Summary</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">On Track</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Needs Attention</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">At Risk</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div key={stage.id} className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stage.contacts.length}
              </div>
              <div className="text-sm text-gray-600 mb-2">{stage.name}</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(getTotalValue(stage))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PipelineView;