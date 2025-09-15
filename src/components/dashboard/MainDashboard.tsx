'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
  subscription: {
    plan: string;
    status: string;
  };
}

interface DashboardStats {
  totalTemplates: number;
  totalScrapes: number;
  creditsUsed: number;
  creditsRemaining: number;
  recentActivity: Array<{
    id: string;
    type: 'scrape' | 'template' | 'generation';
    description: string;
    timestamp: string;
  }>;
}

export default function MainDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    totalScrapes: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/signin');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);

      // Load dashboard statistics
      const statsResponse = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent activity
      const activityResponse = await fetch('/api/dashboard/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setStats(prev => ({ ...prev, recentActivity: activityData.activities }));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Scrape Property',
      description: 'Extract data from property websites',
      icon: '🕷️',
      action: () => router.push('/property/scraper'),
      color: 'bg-blue-500'
    },
    {
      title: 'Create Template',
      description: 'Design marketing templates',
      icon: '🎨',
      action: () => router.push('/templates/editor'),
      color: 'bg-purple-500'
    },
    {
      title: 'Browse Templates',
      description: 'Use pre-made templates',
      icon: '📚',
      action: () => router.push('/templates/sa-library'),
      color: 'bg-green-500'
    },
    {
      title: 'Generate Description',
      description: 'AI-powered property descriptions',
      icon: '🤖',
      action: () => router.push('/property/description'),
      color: 'bg-orange-500'
    },
    {
      title: 'Manage Contacts',
      description: 'CRM for property contacts',
      icon: '👥',
      action: () => router.push('/crm'),
      color: 'bg-indigo-500'
    },
    {
      title: 'Buy Credits',
      description: 'Purchase scraping credits',
      icon: '💎',
      action: () => router.push('/dashboard/credits'),
      color: 'bg-yellow-500'
    }
  ];

  const features = [
    {
      title: 'Web Scraping',
      description: 'Extract property data from major South African real estate websites',
      benefits: ['Property24', 'Private Property', 'Gumtree', 'Seeff & more'],
      icon: '🕷️'
    },
    {
      title: 'Template Editor',
      description: 'Create professional marketing materials with drag-and-drop editing',
      benefits: ['Custom templates', 'Live preview', 'Variable replacement', 'Version control'],
      icon: '🎨'
    },
    {
      title: 'AI Descriptions',
      description: 'Generate compelling property descriptions using artificial intelligence',
      benefits: ['SEO optimized', 'South African focus', 'Multiple formats', 'Agent integration'],
      icon: '🤖'
    },
    {
      title: 'CRM System',
      description: 'Manage property contacts, leads, and communication history',
      benefits: ['Contact management', 'Lead tracking', 'Communication logs', 'Performance analytics'],
      icon: '👥'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to enhance your property marketing workflow?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.credits || 0}</div>
                <div className="text-sm text-blue-100">Credits Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</div>
              <div className="text-sm text-gray-600">Templates Created</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🕷️</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalScrapes}</div>
              <div className="text-sm text-gray-600">Properties Scraped</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💎</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.creditsRemaining}</div>
              <div className="text-sm text-gray-600">Credits Left</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.creditsUsed}</div>
              <div className="text-sm text-gray-600">Credits Used</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={action.action}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No recent activity</p>
              <p className="text-sm">Start by scraping a property or creating a template</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg">
                    {activity.type === 'scrape' && '🕷️'}
                    {activity.type === 'template' && '🎨'}
                    {activity.type === 'generation' && '🤖'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Getting Started Guide */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Scrape Property Data</h3>
                <p className="text-sm text-gray-600">Extract data from property websites using our web scraper</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create or Choose Template</h3>
                <p className="text-sm text-gray-600">Use our template editor or browse pre-made templates</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Generate Marketing Materials</h3>
                <p className="text-sm text-gray-600">Create flyers, brochures, and social media posts</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Your Contacts</h3>
                <p className="text-sm text-gray-600">Use our CRM to track leads and communications</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">PropertyPro Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* South African Focus */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🇿🇦 Built for South African Property Professionals
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            PropertyPro is specifically designed for the South African real estate market,
            with support for local websites, ZAR currency, regional terminology, and compliance with POPI Act requirements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Major Websites</div>
              <div className="text-gray-600">Property24, Private Property, Gumtree</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Local Currency</div>
              <div className="text-gray-600">ZAR formatting (R 2,500,000)</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Regional Areas</div>
              <div className="text-gray-600">Cape Town, JHB, Durban, Pretoria</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">POPI Compliant</div>
              <div className="text-gray-600">Data protection compliant</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}