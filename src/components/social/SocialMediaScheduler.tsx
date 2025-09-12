'use client';

import React, { useState, useEffect, useRef } from 'react';
import Card, { Header as CardHeader, Content as CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'posted' | 'failed';
  image?: string;
  propertyId?: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
}

interface PostTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  thumbnail: string;
  hashtags: string[];
  description: string;
}

interface GridGuide {
  show: boolean;
  type: 'rule-of-thirds' | 'golden-ratio' | 'custom';
  spacing: number;
}

const SocialMediaScheduler: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced features state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'templates' | 'preview'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [gridGuide, setGridGuide] = useState<GridGuide>({
    show: false,
    type: 'rule-of-thirds',
    spacing: 20
  });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platforms: SocialPlatform[] = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2', connected: true },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', connected: true },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5', connected: true },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', connected: false },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023', connected: true }
  ];

  const postTemplates: PostTemplate[] = [
    {
      id: 'luxury-listing',
      name: 'Luxury Property Listing',
      category: 'Property Listings',
      content: '🏡 STUNNING Luxury Home Available! \n\n✨ Premium finishes throughout\n🏊‍♂️ Resort-style pool & spa\n🏌️‍♂️ Golf course community\n📍 Prime location with mountain views\n\n$2,500,000 | Schedule your private tour today!\n\n#LuxuryRealEstate #DreamHome #PropertyForSale',
      thumbnail: '/templates/luxury.jpg',
      hashtags: ['LuxuryRealEstate', 'DreamHome', 'PropertyForSale'],
      description: 'Perfect for high-end property listings'
    },
    {
      id: 'open-house',
      name: 'Open House Announcement',
      category: 'Events',
      content: '🚪 OPEN HOUSE THIS WEEKEND! \n\n🏡 Beautiful 4BR/3BA family home\n🕐 Saturday & Sunday: 12-4 PM\n📍 123 Maple Street\n\nFeatures:\n• Updated kitchen with granite counters\n• Spacious backyard with deck\n• 2-car garage\n• Award-winning schools\n\nDon\'t miss this opportunity! #OpenHouse #RealEstate #FamilyHome',
      thumbnail: '/templates/open-house.jpg',
      hashtags: ['OpenHouse', 'RealEstate', 'FamilyHome'],
      description: 'Announce your open house events'
    },
    {
      id: 'market-update',
      name: 'Market Update',
      category: 'Market Insights',
      content: '📊 Local Real Estate Market Update\n\n🏠 Average home price: $485,000 (+5.2% YoY)\n📈 Days on market: 18 days (-12% YoY)\n🏆 Top-selling neighborhoods this month\n\nMarket is HOT! Buyers are moving fast.\n\nReady to sell? Let\'s discuss your strategy! 📞\n\n#RealEstateMarket #MarketUpdate #PropertyValues',
      thumbnail: '/templates/market-update.jpg',
      hashtags: ['RealEstateMarket', 'MarketUpdate', 'PropertyValues'],
      description: 'Share market insights and trends'
    },
    {
      id: 'first-time-buyer',
      name: 'First-Time Buyer Tips',
      category: 'Buyer Education',
      content: '🎯 First-Time Homebuyer? Here\'s What You Need to Know:\n\n✅ Save for 20% down payment\n✅ Get pre-approved for a mortgage\n✅ Shop around for the best rates\n✅ Consider all closing costs\n✅ Work with an experienced agent\n\nI\'m here to guide you through every step! 🏡\n\n#FirstTimeHomebuyer #HomeBuyingTips #RealEstate',
      thumbnail: '/templates/first-time-buyer.jpg',
      hashtags: ['FirstTimeHomebuyer', 'HomeBuyingTips', 'RealEstate'],
      description: 'Help first-time buyers understand the process'
    },
    {
      id: 'just-sold',
      name: 'Just Sold Celebration',
      category: 'Success Stories',
      content: '🎉 JUST SOLD! Another Happy Client! 🎉\n\n🏡 3BR/2BA charming bungalow\n💰 Sold for $425,000 in just 14 days!\n⭐️ 15% above asking price\n\nThank you for trusting me with your biggest investment! 🏆\n\nReady to sell your home? Let\'s make it happen! 📞\n\n#JustSold #RealEstateSuccess #HomeSeller',
      thumbnail: '/templates/just-sold.jpg',
      hashtags: ['JustSold', 'RealEstateSuccess', 'HomeSeller'],
      description: 'Celebrate successful transactions'
    },
    {
      id: 'seasonal-tip',
      name: 'Seasonal Real Estate Tip',
      category: 'Tips & Advice',
      content: '🌸 Spring Home Buying Season is HERE! 🌸\n\n📈 More inventory becomes available\n💰 Buyers have more negotiating power\n🏡 Fresh listings hit the market daily\n\nSpring is the perfect time to buy! \n\nNeed help finding your dream home? I\'m here to help! 🏠\n\n#SpringRealEstate #HomeBuying #RealEstateTips',
      thumbnail: '/templates/spring-tips.jpg',
      hashtags: ['SpringRealEstate', 'HomeBuying', 'RealEstateTips'],
      description: 'Seasonal real estate advice and tips'
    }
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: ScheduledPost[] = [
      {
        id: '1',
        content: '🏡 Beautiful 3BR/2BA home in downtown area! Perfect for first-time buyers. $425K #RealEstate #PropertyForSale',
        platforms: ['facebook', 'instagram'],
        scheduledDate: new Date('2024-01-20T10:00:00'),
        status: 'scheduled',
        image: '/property1.jpg'
      },
      {
        id: '2',
        content: 'Luxury waterfront condo now available! Stunning views and premium finishes. Schedule a private tour today! 🌊 #LuxuryRealEstate',
        platforms: ['facebook', 'linkedin'],
        scheduledDate: new Date('2024-01-18T14:30:00'),
        status: 'posted',
        image: '/property2.jpg'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
    }, 500);
  }, []);

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSchedulePost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0 || !newPost.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newScheduledPost: ScheduledPost = {
        id: Date.now().toString(),
        content: newPost.content,
        platforms: newPost.platforms,
        scheduledDate: new Date(newPost.scheduledDate),
        status: 'scheduled',
        image: newPost.image || undefined
      };

      setPosts(prev => [newScheduledPost, ...prev]);
      setNewPost({
        content: '',
        platforms: [],
        scheduledDate: '',
        image: ''
      });
      setIsLoading(false);
    }, 1000);
  };

  // Enhanced features functions
  const selectTemplate = (template: PostTemplate) => {
    setSelectedTemplate(template);
    setNewPost(prev => ({
      ...prev,
      content: template.content
    }));
    setActiveTab('create');
  };

  const toggleGridGuide = () => {
    setGridGuide(prev => ({ ...prev, show: !prev.show }));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25;
      return Math.max(50, Math.min(200, newZoom));
    });
  };

  const saveToHistory = (content: string) => {
    setHistory(prev => {
      const newHistory = [...prev, content];
      if (newHistory.length > 50) newHistory.shift(); // Keep only last 50 entries
      return newHistory;
    });
    setHistoryIndex(history.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNewPost(prev => ({ ...prev, content: history[newIndex] }));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNewPost(prev => ({ ...prev, content: history[newIndex] }));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            } else {
              e.preventDefault();
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            // Save draft
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              handleSchedulePost();
            }
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
        }
      }

      // Other shortcuts
      if (e.key === 'Escape') {
        setShowKeyboardShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Save content to history when it changes
  useEffect(() => {
    if (newPost.content) {
      saveToHistory(newPost.content);
    }
  }, [newPost.content]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'posted': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return '⏰';
      case 'posted': return '✅';
      case 'failed': return '❌';
      default: return '📝';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="social-media-scheduler space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Media Scheduler</h1>
            <p className="text-lg text-gray-600">Automate your property marketing across all platforms with AI-powered content</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time scheduling</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI content suggestions</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="lg" className="shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Button>
            <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Post
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{posts.length}</div>
            <div className="text-sm font-medium text-gray-600 mb-1">Scheduled Posts</div>
            <div className="text-xs text-gray-500">Ready to publish</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {posts.filter(p => p.status === 'posted').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Posts Published</div>
            <div className="text-xs text-gray-500">Successfully shared</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {platforms.filter(p => p.connected).length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Connected Platforms</div>
            <div className="text-xs text-gray-500">Active integrations</div>
          </div>
        </Card>

        <Card variant="default" className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {posts.filter(p => p.status === 'scheduled').length}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Pending Posts</div>
            <div className="text-xs text-gray-500">Awaiting publication</div>
          </div>
        </Card>
      </div>

      {/* Enhanced Editor Layout */}
      <div className="flex h-screen bg-gray-50">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'create'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Create
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'templates'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'preview'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>
                </div>

                {/* Selected Template Indicator */}
                {selectedTemplate && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-lg">
                    <span className="text-sm text-purple-700 font-medium">Using:</span>
                    <span className="text-sm text-purple-900">{selectedTemplate.name}</span>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Editor Controls */}
              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 hover:bg-white rounded transition-colors"
                    title="Zoom Out (Ctrl+-)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">{zoomLevel}%</span>
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 hover:bg-white rounded transition-colors"
                    title="Zoom In (Ctrl++)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>

                {/* Grid Toggle */}
                <button
                  onClick={toggleGridGuide}
                  className={`p-2 rounded-lg transition-colors ${
                    gridGuide.show ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                  title="Toggle Grid Guide"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>

                {/* Undo/Redo */}
                <div className="flex space-x-1">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                    title="Undo (Ctrl+Z)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                    title="Redo (Ctrl+Y)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Keyboard Shortcuts */}
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Keyboard Shortcuts (?)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'create' && (
              <div className="h-full p-6">
                <Card variant="default" className="h-full shadow-lg">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
                        <p className="text-gray-600 mt-1">Craft engaging content for your property listings</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 h-full overflow-y-auto">
                    {/* Content Input */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-lg font-semibold text-gray-900">
                          Post Content
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">AI Assist</span>
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors duration-200">
                            ✨ Generate
                          </button>
                        </div>
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your engaging property post here... 🏡✨ #RealEstate #PropertyForSale"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 shadow-sm"
                        rows={8}
                        style={{ fontSize: `${zoomLevel / 100}rem` }}
                      />
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center space-x-2 text-sm ${newPost.content.length > 250 ? 'text-red-600' : 'text-gray-600'}`}>
                            <span className="font-medium">{newPost.content.length}</span>
                            <span>/ 280</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${newPost.content.length > 250 ? 'bg-red-500' : 'bg-purple-500'}`}
                              style={{ width: `${Math.min((newPost.content.length / 280) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>AI suggestions available</span>
                        </div>
                      </div>

                      {/* Grid Guide Overlay */}
                      {gridGuide.show && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-full h-full relative">
                            {Array.from({ length: Math.floor(100 / gridGuide.spacing) }).map((_, i) => (
                              <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-purple-300 opacity-30" style={{ left: `${i * gridGuide.spacing}%` }} />
                            ))}
                            {Array.from({ length: Math.floor(100 / gridGuide.spacing) }).map((_, i) => (
                              <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-purple-300 opacity-30" style={{ top: `${i * gridGuide.spacing}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Platform Selection */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-lg font-semibold text-gray-900">
                          Select Platforms
                        </label>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {newPost.platforms.length} selected
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {platforms.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => handlePlatformToggle(platform.id)}
                            disabled={!platform.connected}
                            className={`group relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                              newPost.platforms.includes(platform.id)
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : platform.connected
                                ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              newPost.platforms.includes(platform.id)
                                ? 'bg-purple-500 text-white'
                                : platform.connected
                                ? 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              <span className="text-lg">{platform.icon}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <span className={`text-sm font-semibold block ${
                                newPost.platforms.includes(platform.id) ? 'text-purple-900' : 'text-gray-900'
                              }`}>
                                {platform.name}
                              </span>
                              {!platform.connected && (
                                <span className="text-xs text-red-500 block">Not connected</span>
                              )}
                            </div>
                            {newPost.platforms.includes(platform.id) && (
                              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      {newPost.platforms.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm text-yellow-800">Select at least one platform to schedule your post</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scheduling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Date & Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={newPost.scheduledDate}
                          onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL (Optional)
                        </label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={newPost.image}
                          onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Button variant="outline" size="sm">
                        Save as Draft
                      </Button>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSchedulePost}
                          loading={isLoading}
                        >
                          Schedule Post
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="h-full p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => selectTemplate(template)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-purple-300"
                    >
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-xl flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl">📄</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.hashtags.slice(0, 3).map((hashtag, index) => (
                            <span key={index} className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              {hashtag}
                            </span>
                          ))}
                          {template.hashtags.length > 3 && (
                            <span className="text-xs text-gray-500">+{template.hashtags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full p-6">
                <div className="max-w-md mx-auto">
                  <Card variant="default" className="shadow-lg">
                    <CardHeader>
                      <h3 className="text-lg font-bold text-gray-900">Post Preview</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {newPost.image && (
                          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Image Preview</span>
                          </div>
                        )}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{newPost.content || 'Your post content will appear here...'}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Platforms:</span>
                          {newPost.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <span key={platformId} className="text-lg">{platform.icon}</span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-l border-gray-200 transition-all duration-300 ease-in-out`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Scheduled Posts</h3>
                    <p className="text-xs text-gray-600">Your content queue</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4">
            {!sidebarCollapsed && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">No scheduled posts yet</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-200 transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            post.status === 'posted' ? 'bg-green-100' :
                            post.status === 'scheduled' ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            <span className="text-sm">{getStatusIcon(post.status)}</span>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)} shadow-sm`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {post.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <div key={platformId} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center" title={platform.name}>
                                <span className="text-sm">{platform.icon}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{formatDate(post.scheduledDate)}</span>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Undo</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Redo</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Y</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Save Draft</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Schedule Post</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Enter</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaScheduler;