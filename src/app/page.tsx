'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const features = [
    {
      title: 'Property24 Smart Import',
      description: 'Automatically import property listings from Property24 with AI-powered data extraction and validation.',
      icon: '🏠',
      href: '/property24-import',
      color: 'bg-blue-500'
    },
    {
      title: 'Automated Follow-up Sequences',
      description: 'Create intelligent email and SMS sequences to nurture leads and convert prospects.',
      icon: '📧',
      href: '/sequences',
      color: 'bg-green-500'
    },
    {
      title: 'One-Click Social Media',
      description: 'Post to multiple social platforms simultaneously with AI-generated content.',
      icon: '📱',
      href: '/social-media',
      color: 'bg-purple-500'
    },
    {
      title: 'South African Templates',
      description: 'Pre-built templates designed specifically for the South African real estate market.',
      icon: '🇿🇦',
      href: '/templates/sa-library',
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting for all your marketing campaigns.',
      icon: '📊',
      href: '/analytics',
      color: 'bg-red-500'
    },
    {
      title: 'CRM Integration',
      description: 'Manage your contacts, leads, and customer relationships in one place.',
      icon: '👥',
      href: '/crm',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PropertyPro</h1>
              <p className="text-gray-600 mt-1">AI-Powered Real Estate Marketing Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">South African Edition</span>
              <div className="flex items-center space-x-1">
                <span className="text-lg">🇿🇦</span>
                <span className="text-sm font-medium">ZA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Real Estate Marketing
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate your property marketing with AI-powered tools designed specifically for the South African real estate market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/property24-import">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/templates/sa-library">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate and optimize your real estate marketing campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white text-xl`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Get Started</span>
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Real Estate Professionals</h3>
            <p className="text-lg text-gray-600">Join hundreds of agents using PropertyPro to grow their business</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Properties Imported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Messages Sent</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Delivery Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Automation</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Real Estate Marketing?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Start automating your property marketing today with AI-powered tools designed for South African real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/property24-import">
              <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50">
                Try Property24 Import
              </Button>
            </Link>
            <Link href="/templates/sa-library">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">PropertyPro</h4>
              <p className="text-gray-400">
                AI-powered real estate marketing platform for South African professionals.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/property24-import" className="hover:text-white">Property24 Import</Link></li>
                <li><Link href="/sequences" className="hover:text-white">Follow-up Sequences</Link></li>
                <li><Link href="/social-media" className="hover:text-white">Social Media</Link></li>
                <li><Link href="/templates/sa-library" className="hover:text-white">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>support@propertypro.co.za</li>
                <li>+27 21 555 0123</li>
                <li>Cape Town, South Africa 🇿🇦</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyPro. Built for South African real estate professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
