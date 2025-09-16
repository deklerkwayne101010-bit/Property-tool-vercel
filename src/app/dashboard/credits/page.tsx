'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CREDIT_PACKAGES } from '@/lib/subscription-plans';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  creditsGranted: number;
  status: string;
  createdAt: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  credits: number;
}

export default function CreditsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCreditsData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch('/api/credits', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser({ ...userData, credits: data.credits });
          setTransactions(data.transactions);
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Error loading credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreditsData();
  }, [router]);

  const handlePurchaseCredits = async (packageId: string) => {
    setIsPurchasing(packageId);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ packageId })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Yoco payment page
        window.location.href = data.paymentUrl;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process purchase');
    } finally {
      setIsPurchasing(null);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Credits & Billing</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Current Balance */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.credits}</h2>
                  <p className="text-gray-600">Available Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Credits are used for:</p>
                  <ul className="text-sm text-gray-600 mt-1">
                    <li>• AI property descriptions</li>
                    <li>• Template creation</li>
                    <li>• Image processing</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Credit Packages */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Purchase Credits</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <Card key={pkg.id} className={`p-6 ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {pkg.popular && (
                    <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      R{pkg.price}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {pkg.credits} credits
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{pkg.description}</p>
                    <Button
                      onClick={() => handlePurchaseCredits(pkg.id)}
                      disabled={isPurchasing === pkg.id}
                      className="w-full mt-4"
                      size="sm"
                    >
                      {isPurchasing === pkg.id ? 'Processing...' : 'Purchase'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>
            <Card className="p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit_purchase'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {transaction.type === 'credit_purchase' ? '💰' : '⭐'}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.status === 'completed'
                            ? 'text-green-600'
                            : transaction.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                        {transaction.amount > 0 && (
                          <p className="text-sm text-gray-600">
                            R{transaction.amount}
                          </p>
                        )}
                        {transaction.creditsGranted > 0 && (
                          <p className="text-sm text-green-600">
                            +{transaction.creditsGranted} credits
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Credit Usage</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 1 credit per AI description</li>
                    <li>• 2 credits per template creation</li>
                    <li>• 1 credit per image processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Support</h4>
                  <p className="text-sm text-gray-600">
                    All payments are processed securely through Yoco.
                    Contact support if you need assistance with your purchase.
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