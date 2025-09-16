'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDemoLogin = async () => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user data
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'admin',
        credits: 100,
        subscription: {
          plan: 'premium',
          status: 'active',
          features: ['All features unlocked', 'Unlimited usage']
        },
        profile: {
          agency: 'Demo Real Estate Agency',
          phone: '+27 12 345 6789'
        },
        isDemo: true
      };

      // Store user data in localStorage (simulating authentication)
      localStorage.setItem('demoUser', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            PropertyPro Demo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Experience all features with our demo account
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Demo Features
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Unlimited property descriptions</li>
                      <li>All premium templates</li>
                      <li>Full CRM functionality</li>
                      <li>Social media integration</li>
                      <li>Property24 scraping</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting Demo...
                </div>
              ) : (
                '🚀 Start Demo'
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                No registration required • All data is simulated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}