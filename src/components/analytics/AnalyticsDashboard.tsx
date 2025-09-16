'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { AnalyticsService, SequenceAnalytics, ChannelAnalytics, TemplateAnalytics } from '@/lib/analytics-service';

interface AnalyticsDashboardProps {
  agentId?: string;
}

export default function AnalyticsDashboard({ agentId }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0]
  });

  const [dashboardMetrics, setDashboardMetrics] = useState<Record<string, any>>({});
  const [sequenceAnalytics, setSequenceAnalytics] = useState<SequenceAnalytics[]>([]);
  const [channelAnalytics, setChannelAnalytics] = useState<ChannelAnalytics[]>([]);
  const [templateAnalytics, setTemplateAnalytics] = useState<TemplateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sequences' | 'channels' | 'templates'>('overview');

  const loadAnalytics = useCallback(async () => {
    if (!agentId) return;

    setLoading(true);
    try {
      const periodObj = {
        start: new Date(period.start),
        end: new Date(period.end)
      };

      const [metrics, sequences, channels, templates] = await Promise.all([
        AnalyticsService.getDashboardMetrics(agentId, periodObj),
        AnalyticsService.getAllSequencesAnalytics(agentId, periodObj),
        AnalyticsService.getChannelAnalytics(agentId, periodObj),
        AnalyticsService.getTemplateAnalytics(agentId, periodObj)
      ]);

      setDashboardMetrics(metrics);
      setSequenceAnalytics(sequences);
      setChannelAnalytics(channels);
      setTemplateAnalytics(templates);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [agentId, period]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">From:</label>
            <Input
              type="date"
              value={period.start}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPeriod(prev => ({ ...prev, start: e.target.value }))
              }
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">To:</label>
            <Input
              type="date"
              value={period.end}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPeriod(prev => ({ ...prev, end: e.target.value }))
              }
              className="w-40"
            />
          </div>
          <Button onClick={loadAnalytics}>Refresh</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sequences', label: 'Sequences' },
            { id: 'channels', label: 'Channels' },
            { id: 'templates', label: 'Templates' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'sequences' | 'channels' | 'templates')}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardMetrics.totalMessages || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPercentage(dashboardMetrics.deliveryRate || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPercentage(dashboardMetrics.openRate || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboardMetrics.totalCost || 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sequences Tab */}
      {activeTab === 'sequences' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Sequence Performance</h2>
          <div className="grid gap-4">
            {sequenceAnalytics.map((sequence) => (
              <Card key={sequence.sequenceId} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{sequence.sequenceName}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {sequence.totalContacts} contacts
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Completion Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(sequence.completionRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(sequence.deliveryRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Open Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(sequence.openRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Response Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(sequence.responseRate)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Channel Performance</h2>
          <div className="grid gap-4">
            {channelAnalytics.map((channel) => (
              <Card key={channel.channel} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium capitalize">{channel.channel}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {channel.totalSent} sent
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Delivery Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(channel.deliveryRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Open Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(channel.openRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Click Rate</p>
                    <p className="text-lg font-semibold">{formatPercentage(channel.clickRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Cost</p>
                    <p className="text-lg font-semibold">{formatCurrency(channel.averageCost)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Template Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templateAnalytics.map((template) => (
                  <tr key={template.templateId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{template.templateName}</div>
                      <div className="text-sm text-gray-500">{template.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {template.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {template.totalSent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(template.openRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(template.clickRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(template.responseRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}