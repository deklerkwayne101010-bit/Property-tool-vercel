'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyPayment = useCallback(async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      // In a real implementation, you would call your backend to verify the payment
      // For now, we'll simulate success and log the payment ID for debugging
      console.log('Verifying payment with ID:', paymentId);
      setTimeout(() => {
        setStatus('success');
        setMessage('Payment processed successfully! Your credits have been added to your account.');
      }, 2000);

    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('Failed to verify payment. Please contact support.');
    }
  }, [router]);

  useEffect(() => {
    const paymentId = searchParams.get('id');

    if (paymentId) {
      // Verify payment with backend
      verifyPayment(paymentId);
    } else {
      setStatus('error');
      setMessage('Payment ID not found');
    }
  }, [searchParams, verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600">Please wait while we verify your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/credits')}
                    className="w-full"
                  >
                    View Credits
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-red-600">✕</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
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
              </>
            )}
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="mailto:support@propertypro.co.za" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}