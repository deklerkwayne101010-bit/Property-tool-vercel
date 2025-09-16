'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'offer' | 'sale';
  description: string;
  date: Date;
  outcome?: string;
  value?: number;
}

interface PerformanceAnalyticsProps {
  contacts: Contact[];
  activities: Activity[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  contacts,
  activities,
  dateRange,
  onDateRangeChange
}) => {

  // Calculate key metrics
  const totalContacts = contacts.length;
  const totalLeads = contacts.filter(c => c.status === 'lead').length;
  const totalProspects = contacts.filter(c => c.status === 'prospect').length;
  const totalClients = contacts.filter(c => c.status === 'client').length;

  const conversionRate = totalContacts > 0 ? Math.round((totalClients / totalContacts) * 100) : 0;

  const totalPipelineValue = contacts.reduce((sum, c) => sum + (c.budget?.max || 0), 0);
  const avgDealSize = totalClients > 0 ? Math.round(totalPipelineValue / totalClients) : 0;

  // Activity metrics
  const totalActivities = activities.length;

  const successfulActivities = activities.filter(a =>
    a.outcome && (a.outcome.toLowerCase().includes('successful') ||
                  a.outcome.toLowerCase().includes('closed') ||
                  a.outcome.toLowerCase().includes('won'))
  ).length;

  const activitySuccessRate = totalActivities > 0 ? Math.round((successfulActivities / totalActivities) * 100) : 0;

  // Source performance
  const sourcePerformance = contacts.reduce((acc, contact) => {
    acc[contact.source] = (acc[contact.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSource = Object.entries(sourcePerformance).sort(([,a], [,b]) => b - a)[0];

  // Monthly trends (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', leads: 12, prospects: 8, clients: 3 },
    { month: 'Feb', leads: 15, prospects: 10, clients: 5 },
    { month: 'Mar', leads: 18, prospects: 12, clients: 7 },
    { month: 'Apr', leads: 22, prospects: 15, clients: 9 },
    { month: 'May', leads: 25, prospects: 18, clients: 12 },
    { month: 'Jun', leads: 20, prospects: 16, clients: 10 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };


  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return '🌐';
      case 'referral': return '🤝';
      case 'social': return '📱';
      case 'open-house': return '🏠';
      case 'advertisement': return '📢';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-600 mt-1">Track your sales performance and conversion metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                <div className="text-xs text-gray-500">vs last month</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Conversion Rate</h3>
            <p className="text-sm text-gray-600">Leads to clients</p>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(avgDealSize)}</div>
                <div className="text-xs text-gray-500">average deal</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Deal Size</h3>
            <p className="text-sm text-gray-600">Per closed client</p>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{activitySuccessRate}%</div>
                <div className="text-xs text-gray-500">success rate</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Activity Success</h3>
            <p className="text-sm text-gray-600">Successful interactions</p>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{totalActivities}</div>
                <div className="text-xs text-gray-500">this month</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Activities</h3>
            <p className="text-sm text-gray-600">Interactions logged</p>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <Card variant="default" className="shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
            <p className="text-sm text-gray-600 mt-1">Contact distribution by status</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Leads</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{totalLeads}</div>
                  <div className="text-sm text-gray-600">{totalContacts > 0 ? Math.round((totalLeads / totalContacts) * 100) : 0}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Prospects</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{totalProspects}</div>
                  <div className="text-sm text-gray-600">{totalContacts > 0 ? Math.round((totalProspects / totalContacts) * 100) : 0}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Clients</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{totalClients}</div>
                  <div className="text-sm text-gray-600">{totalContacts > 0 ? Math.round((totalClients / totalContacts) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalPipelineValue)}</div>
                <div className="text-sm text-gray-600">Total Pipeline Value</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Source Performance */}
        <Card variant="default" className="shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
            <p className="text-sm text-gray-600 mt-1">Performance by acquisition channel</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(sourcePerformance)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getSourceIcon(source)}</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {source.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">
                        {totalContacts > 0 ? Math.round((count / totalContacts) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {topSource && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg mb-1">🏆 Top Source</div>
                  <div className="font-bold text-gray-900 capitalize">
                    {topSource[0].replace('-', ' ')}
                  </div>
                  <div className="text-sm text-gray-600">{topSource[1]} contacts</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Trends Chart (Simplified) */}
      <Card variant="default" className="shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          <p className="text-sm text-gray-600 mt-1">Contact acquisition and conversion over time</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-6 gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{data.month}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{data.leads}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{data.prospects}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{data.clients}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Leads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Prospects</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Clients</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;