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
            <Card variant="default" className="h-full hover:shadow-lg transition-shadow duration-200">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <h3 className="font-bold text-gray-900 text-lg">{stage.name}</h3>
                </div>
                <span className="text-sm font-semibold text-white bg-gray-600 px-3 py-1.5 rounded-full shadow-sm">
                  {stage.contacts.length}
                </span>
              </div>

              {/* Stage Stats */}
              <div className="mb-6 space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Total Value:</span>
                    <span className="font-bold text-green-900 text-lg">
                      {formatCurrency(getTotalValue(stage))}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Avg. Days:</span>
                    <span className="font-bold text-blue-900 text-lg">
                      {getAverageDays(stage)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacts List */}
              <div className="space-y-3 flex-1 min-h-0 overflow-y-auto max-h-80">
                {stage.contacts.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No contacts in this stage</p>
                    <p className="text-xs text-gray-500 mt-1">Contacts will appear here when moved to this stage</p>
                  </div>
                ) : (
                  stage.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => onContactClick(contact.id)}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm truncate flex-1">
                          {contact.name}
                        </h4>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md ml-2 flex-shrink-0">
                          {contact.daysInStage}d
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(contact.value)}
                        </span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {stageIndex > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onContactMove(contact.id, stage.id, stages[stageIndex - 1].id);
                              }}
                              className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                              title="Move to previous stage"
                            >
                              ←
                            </button>
                          )}
                          {stageIndex < stages.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onContactMove(contact.id, stage.id, stages[stageIndex + 1].id);
                              }}
                              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                              title="Move to next stage"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Contact Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-200 transition-all duration-200 shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <Card variant="gradient" className="mt-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Pipeline Summary</h3>
            <p className="text-gray-600 mt-1">Real-time overview of your sales pipeline performance</p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">On Track</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Needs Attention</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">At Risk</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {stages.map((stage, index) => (
            <div key={stage.id} className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-center mb-4">
                <div
                  className="w-5 h-5 rounded-full shadow-md"
                  style={{ backgroundColor: stage.color }}
                ></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stage.contacts.length}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-3">{stage.name}</div>
              <div className="text-xl font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                {formatCurrency(getTotalValue(stage))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {getAverageDays(stage)} avg days
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stages.reduce((sum, stage) => sum + stage.contacts.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(stages.reduce((sum, stage) => sum + getTotalValue(stage), 0))}
            </div>
            <div className="text-sm text-gray-600">Total Pipeline Value</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.round(stages.reduce((sum, stage) => sum + getAverageDays(stage), 0) / stages.length) || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Days in Pipeline</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PipelineView;