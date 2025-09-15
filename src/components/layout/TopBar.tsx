'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TopBarProps {
  onMenuClick: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/signin');
  };

  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/payment');

  if (isAuthPage) {
    return null; // Don't show topbar on auth pages
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo/Brand */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">PropertyPro</h1>
      </div>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Credits Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
              <span className="text-sm text-blue-600 font-medium">{user.credits}</span>
              <span className="text-xs text-blue-500">credits</span>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l3.5-3.5L9 14l4-4 4 4 1.5 1.5L21 5z" />
              </svg>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </a>

                  <a
                    href="/dashboard/credits"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Credits & Billing
                  </a>

                  <a
                    href="/dashboard/subscription"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Subscription
                  </a>

                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile Settings
                  </a>

                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Auth buttons for non-authenticated users */}
            <a
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;