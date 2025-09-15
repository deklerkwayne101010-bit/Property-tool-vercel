'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-yellow-600">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/dashboard/credits')}
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Having trouble with payments?{' '}
            <a href="mailto:support@propertypro.co.za" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}