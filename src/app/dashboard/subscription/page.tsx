'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

interface Subscription {
  plan: string;
  status: string;
  expiresAt: string;
  features: string[];
}

interface User {
  id: string;
  name: string;
  subscription: Subscription;
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const router = useRouter();

  const loadSubscriptionData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch('/api/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          ...userData,
          subscription: data.currentPlan
        });
      } else {
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, [router, loadSubscriptionData]);

  const handleUpgradePlan = async (planId: string) => {
    setIsUpgrading(planId);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          // Redirect to Yoco payment page
          window.location.href = data.paymentUrl;
        } else {
          // Plan changed successfully
          alert(data.message);
          loadSubscriptionData(); // Refresh data
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upgrade plan');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to process upgrade');
    } finally {
      setIsUpgrading(null);
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPlan = SUBSCRIPTION_PLANS[user.subscription.plan];
  const daysRemaining = getDaysRemaining(user.subscription.expiresAt);

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
              <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Current Plan */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
                  <p className="text-gray-600 mt-1">
                    {user.subscription.status === 'trial' ? 'Trial Period' : 'Active Subscription'}
                  </p>
                  {daysRemaining > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {daysRemaining} days remaining
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    R{currentPlan.price}
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-6 ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${
                    user.subscription.plan === plan.id ? 'bg-blue-50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        R{plan.price}
                      </p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {plan.credits} AI credits per month</li>
                      <li>• {plan.limits.descriptions === -1 ? 'Unlimited' : plan.limits.descriptions} descriptions</li>
                      <li>• {plan.limits.templates === -1 ? 'Unlimited' : plan.limits.templates} templates</li>
                      <li>• {plan.limits.images === -1 ? 'Unlimited' : plan.limits.images} images</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  {user.subscription.plan === plan.id ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgradePlan(plan.id)}
                      disabled={isUpgrading === plan.id}
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {isUpgrading === plan.id
                        ? 'Processing...'
                        : plan.price === 0
                        ? 'Downgrade to Free'
                        : `Upgrade to ${plan.name}`
                      }
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost</span>
                  <span className="font-medium">R{currentPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing Date</span>
                  <span className="font-medium">
                    {new Date(user.subscription.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">Yoco (Secure)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Plan Changes</h4>
                  <p className="text-sm text-gray-600">
                    Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Security</h4>
                  <p className="text-sm text-gray-600">
                    All payments are processed securely through Yoco with PCI DSS compliance.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cancel Anytime</h4>
                  <p className="text-sm text-gray-600">
                    You can cancel or change your plan at any time from your account settings.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}