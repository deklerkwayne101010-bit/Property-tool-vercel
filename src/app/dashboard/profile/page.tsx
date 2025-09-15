'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    agency?: string;
    phone?: string;
    location?: string;
    website?: string;
    bio?: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (!user) return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUser({
        ...user,
        [parent]: {
          ...user[parent as keyof UserProfile] as any,
          [child]: value
        }
      });
    } else {
      setUser({
        ...user,
        [field]: value
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          profile: user.profile,
          settings: user.settings
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Profile updated successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successfully')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {(user.role === 'agent' || user.role === 'admin') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agency Name
                      </label>
                      <Input
                        type="text"
                        value={user.profile.agency || ''}
                        onChange={(e) => handleInputChange('profile.agency', e.target.value)}
                        placeholder="Enter your agency name"
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={user.profile.phone || ''}
                        onChange={(e) => handleInputChange('profile.phone', e.target.value)}
                        placeholder="+27 21 555 0123"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        type="text"
                        value={user.profile.location || ''}
                        onChange={(e) => handleInputChange('profile.location', e.target.value)}
                        placeholder="City, Province"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      type="url"
                      value={user.profile.website || ''}
                      onChange={(e) => handleInputChange('profile.website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={user.profile.bio || ''}
                      onChange={(e) => handleInputChange('profile.bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={user.settings.theme === 'light'}
                          onChange={(e) => handleInputChange('settings.theme', e.target.value)}
                          className="mr-2"
                        />
                        Light
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={user.settings.theme === 'dark'}
                          onChange={(e) => handleInputChange('settings.theme', e.target.value)}
                          className="mr-2"
                        />
                        Dark
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Notifications
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.settings.notifications}
                          onChange={(e) => handleInputChange('settings.notifications', e.target.checked)}
                          className="mr-3 rounded"
                        />
                        Email notifications for important updates
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={user.settings.emailUpdates}
                          onChange={(e) => handleInputChange('settings.emailUpdates', e.target.checked)}
                          className="mr-3 rounded"
                        />
                        Marketing emails and newsletters
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={user.settings.language}
                      onChange={(e) => handleInputChange('settings.language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="af">Afrikaans</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Account Summary */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Summary</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Email Verified</p>
                    <p className="font-medium text-green-600">✓ Verified</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>

              {/* Security */}
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>

                  <Button variant="outline" className="w-full">
                    Download My Data
                  </Button>

                  <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}