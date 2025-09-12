'use client';

import React from 'react';

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: LayoutElement[];
  category: string;
}

interface ElementProperties {
  // Rectangle properties
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number;
  opacity?: number;

  // Text properties
  text?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;

  // Common properties
  selectable?: boolean;
  evented?: boolean;
}

interface LayoutElement {
  type: 'rectangle' | 'text' | 'image' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: ElementProperties;
}

interface LayoutPresetsProps {
  onLayoutSelect: (layout: LayoutPreset) => void;
}

const LayoutPresets: React.FC<LayoutPresetsProps> = ({ onLayoutSelect }) => {
  const layoutCategories = ['all', 'business', 'events', 'real-estate', 'promotional', 'educational'];

  const layoutPresets: LayoutPreset[] = [
    // Business Card Layouts
    {
      id: 'business-card-standard',
      name: 'Standard Business Card',
      description: 'Classic 3.5" x 2" business card layout',
      thumbnail: '/layouts/business-card.jpg',
      category: 'business',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 350, height: 200, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'text', x: 20, y: 30, width: 310, height: 40, properties: { text: 'COMPANY NAME', fontSize: 18, fontWeight: 'bold' } },
        { type: 'text', x: 20, y: 80, width: 310, height: 30, properties: { text: 'John Doe', fontSize: 14 } },
        { type: 'text', x: 20, y: 115, width: 310, height: 25, properties: { text: 'Position Title', fontSize: 12, fill: '#6b7280' } },
        { type: 'text', x: 20, y: 145, width: 310, height: 20, properties: { text: '(555) 123-4567', fontSize: 11 } },
        { type: 'text', x: 20, y: 170, width: 310, height: 20, properties: { text: 'john@company.com', fontSize: 11 } }
      ]
    },

    // Flyer Layouts
    {
      id: 'flyer-a4-portrait',
      name: 'A4 Portrait Flyer',
      description: 'Standard A4 portrait flyer with header and content areas',
      thumbnail: '/layouts/flyer-a4.jpg',
      category: 'promotional',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 595, height: 842, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 0, y: 0, width: 595, height: 150, properties: { fill: '#3b82f6' } },
        { type: 'text', x: 30, y: 50, width: 535, height: 50, properties: { text: 'GRAND OPENING!', fontSize: 36, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
        { type: 'rectangle', x: 50, y: 200, width: 250, height: 200, properties: { fill: '#f3f4f6', stroke: '#d1d5db' } },
        { type: 'text', x: 70, y: 220, width: 210, height: 160, properties: { text: 'Your main content goes here. Describe your offer, event, or service in detail.', fontSize: 14, lineHeight: 1.5 } },
        { type: 'rectangle', x: 350, y: 200, width: 195, height: 150, properties: { fill: '#f3f4f6', stroke: '#d1d5db' } },
        { type: 'text', x: 370, y: 220, width: 155, height: 110, properties: { text: 'Key Benefits:\n• Benefit 1\n• Benefit 2\n• Benefit 3', fontSize: 12 } },
        { type: 'rectangle', x: 50, y: 450, width: 495, height: 100, properties: { fill: '#1f2937' } },
        { type: 'text', x: 70, y: 470, width: 455, height: 60, properties: { text: 'Call to Action: Contact us today at (555) 123-4567 or visit www.example.com', fontSize: 14, fill: '#ffffff', textAlign: 'center' } }
      ]
    },

    // Real Estate Layouts
    {
      id: 'property-listing-card',
      name: 'Property Listing Card',
      description: 'Eye-catching property listing with photo and details',
      thumbnail: '/layouts/property-card.jpg',
      category: 'real-estate',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 400, height: 300, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 20, y: 20, width: 360, height: 180, properties: { fill: '#f3f4f6', stroke: '#d1d5db' } },
        { type: 'text', x: 30, y: 210, width: 340, height: 30, properties: { text: 'Beautiful 3BR/2BA Home', fontSize: 16, fontWeight: 'bold' } },
        { type: 'text', x: 30, y: 245, width: 340, height: 20, properties: { text: '123 Main Street, Downtown', fontSize: 12, fill: '#6b7280' } },
        { type: 'text', x: 30, y: 270, width: 200, height: 25, properties: { text: '$425,000', fontSize: 18, fontWeight: 'bold', fill: '#059669' } },
        { type: 'rectangle', x: 300, y: 265, width: 80, height: 25, properties: { fill: '#3b82f6', rx: 12 } },
        { type: 'text', x: 310, y: 270, width: 60, height: 20, properties: { text: 'View Details', fontSize: 11, fill: '#ffffff', textAlign: 'center' } }
      ]
    },

    // Event Layouts
    {
      id: 'event-poster',
      name: 'Event Poster',
      description: 'Eye-catching event poster with date and details',
      thumbnail: '/layouts/event-poster.jpg',
      category: 'events',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 420, height: 594, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 0, y: 0, width: 420, height: 200, properties: { fill: '#7c3aed' } },
        { type: 'text', x: 30, y: 50, width: 360, height: 40, properties: { text: 'SUMMER FESTIVAL', fontSize: 28, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
        { type: 'text', x: 30, y: 100, width: 360, height: 30, properties: { text: '2024', fontSize: 20, fill: '#ffffff', textAlign: 'center' } },
        { type: 'rectangle', x: 60, y: 250, width: 300, height: 80, properties: { fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 2, rx: 8 } },
        { type: 'text', x: 80, y: 265, width: 260, height: 50, properties: { text: 'SATURDAY, JULY 15TH\n2:00 PM - 10:00 PM', fontSize: 16, fontWeight: 'bold', textAlign: 'center' } },
        { type: 'text', x: 60, y: 360, width: 300, height: 80, properties: { text: 'Live Music • Food Trucks • Games\nFamily Friendly • Free Admission', fontSize: 14, textAlign: 'center', lineHeight: 1.4 } },
        { type: 'rectangle', x: 60, y: 480, width: 300, height: 60, properties: { fill: '#dc2626', rx: 30 } },
        { type: 'text', x: 80, y: 495, width: 240, height: 30, properties: { text: 'GET YOUR TICKETS NOW!', fontSize: 14, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } }
      ]
    },

    // Educational Layouts
    {
      id: 'course-flyer',
      name: 'Course Flyer',
      description: 'Professional course or workshop advertisement',
      thumbnail: '/layouts/course-flyer.jpg',
      category: 'educational',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 420, height: 594, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 0, y: 0, width: 420, height: 120, properties: { fill: '#1e40af' } },
        { type: 'text', x: 30, y: 40, width: 360, height: 40, properties: { text: 'DIGITAL MARKETING MASTERCLASS', fontSize: 20, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
        { type: 'rectangle', x: 60, y: 160, width: 300, height: 80, properties: { fill: '#dbeafe', stroke: '#3b82f6', strokeWidth: 2, rx: 8 } },
        { type: 'text', x: 80, y: 175, width: 260, height: 50, properties: { text: 'Learn SEO, Social Media, & Content Marketing\n8-Week Intensive Program', fontSize: 12, textAlign: 'center', lineHeight: 1.4 } },
        { type: 'text', x: 60, y: 270, width: 300, height: 100, properties: { text: 'What You\'ll Learn:\n• Search Engine Optimization\n• Social Media Strategy\n• Content Creation\n• Analytics & Reporting\n• Email Marketing\n• PPC Advertising', fontSize: 11, lineHeight: 1.3 } },
        { type: 'rectangle', x: 60, y: 400, width: 300, height: 60, properties: { fill: '#16a34a', rx: 30 } },
        { type: 'text', x: 80, y: 415, width: 240, height: 30, properties: { text: 'ENROLL NOW - LIMITED SPOTS!', fontSize: 14, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
        { type: 'text', x: 60, y: 480, width: 300, height: 40, properties: { text: 'Investment: $497 | Next Class: Aug 1st\nwww.digitalmarketing.com | (555) 123-4567', fontSize: 10, textAlign: 'center', fill: '#6b7280' } }
      ]
    },

    // Promotional Layouts
    {
      id: 'sale-banner',
      name: 'Sale Banner',
      description: 'Attention-grabbing sale or promotion banner',
      thumbnail: '/layouts/sale-banner.jpg',
      category: 'promotional',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 800, height: 200, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 0, y: 0, width: 300, height: 200, properties: { fill: '#dc2626' } },
        { type: 'text', x: 30, y: 60, width: 240, height: 80, properties: { text: 'SUMMER\nSALE', fontSize: 48, fill: '#ffffff', fontWeight: 'bold', lineHeight: 0.9 } },
        { type: 'rectangle', x: 320, y: 30, width: 450, height: 140, properties: { fill: '#f9fafb', stroke: '#d1d5db', rx: 8 } },
        { type: 'text', x: 350, y: 50, width: 390, height: 30, properties: { text: 'UP TO 70% OFF', fontSize: 24, fontWeight: 'bold', fill: '#dc2626' } },
        { type: 'text', x: 350, y: 90, width: 390, height: 60, properties: { text: 'Everything must go! Limited time offer.\nUse code SUMMER70 at checkout.', fontSize: 14, lineHeight: 1.4 } },
        { type: 'rectangle', x: 650, y: 120, width: 120, height: 40, properties: { fill: '#dc2626', rx: 20 } },
        { type: 'text', x: 665, y: 130, width: 90, height: 20, properties: { text: 'SHOP NOW', fontSize: 12, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } }
      ]
    },

    // Square Layouts
    {
      id: 'instagram-square',
      name: 'Instagram Square Post',
      description: 'Perfect square layout for Instagram posts',
      thumbnail: '/layouts/instagram-square.jpg',
      category: 'social',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 400, height: 400, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        { type: 'rectangle', x: 0, y: 0, width: 400, height: 150, properties: { fill: '#7c3aed' } },
        { type: 'text', x: 20, y: 50, width: 360, height: 50, properties: { text: 'YOUR BRAND', fontSize: 32, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
        { type: 'rectangle', x: 50, y: 180, width: 300, height: 120, properties: { fill: '#f3f4f6', stroke: '#d1d5db', rx: 8 } },
        { type: 'text', x: 70, y: 200, width: 260, height: 80, properties: { text: 'Your message or offer goes here. Keep it concise and compelling.', fontSize: 14, textAlign: 'center', lineHeight: 1.4 } },
        { type: 'rectangle', x: 150, y: 320, width: 100, height: 40, properties: { fill: '#7c3aed', rx: 20 } },
        { type: 'text', x: 165, y: 330, width: 70, height: 20, properties: { text: 'LEARN MORE', fontSize: 11, fill: '#ffffff', fontWeight: 'bold', textAlign: 'center' } }
      ]
    },

    // Customizable Guides
    {
      id: 'grid-layout-3x3',
      name: '3x3 Grid Layout',
      description: 'Flexible 3x3 grid with customizable sections',
      thumbnail: '/layouts/grid-3x3.jpg',
      category: 'business',
      elements: [
        { type: 'rectangle', x: 0, y: 0, width: 600, height: 600, properties: { fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 } },
        // Grid lines (visual guides)
        { type: 'rectangle', x: 195, y: 0, width: 10, height: 600, properties: { fill: '#f3f4f6', stroke: '#d1d5db', opacity: 0.5 } },
        { type: 'rectangle', x: 395, y: 0, width: 10, height: 600, properties: { fill: '#f3f4f6', stroke: '#d1d5db', opacity: 0.5 } },
        { type: 'rectangle', x: 0, y: 195, width: 600, height: 10, properties: { fill: '#f3f4f6', stroke: '#d1d5db', opacity: 0.5 } },
        { type: 'rectangle', x: 0, y: 395, width: 600, height: 10, properties: { fill: '#f3f4f6', stroke: '#d1d5db', opacity: 0.5 } },
        // Content areas
        { type: 'rectangle', x: 20, y: 20, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 215, y: 20, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 410, y: 20, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 20, y: 225, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 215, y: 225, width: 350, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 20, y: 410, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 215, y: 410, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } },
        { type: 'rectangle', x: 410, y: 410, width: 155, height: 155, properties: { fill: '#f9fafb', stroke: '#e5e7eb', rx: 4 } }
      ]
    }
  ];

  const handleLayoutClick = (layout: LayoutPreset) => {
    onLayoutSelect(layout);
  };

  return (
    <div className="layout-presets bg-white border rounded-lg p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2">📐</span>
          Layout Presets
        </h3>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 mb-3">
          {layoutCategories.map((category) => (
            <button
              key={category}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {layoutPresets.map((layout) => (
            <div
              key={layout.id}
              onClick={() => handleLayoutClick(layout)}
              className="cursor-pointer group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                {/* Thumbnail Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📄</span>
                </div>

                {/* Layout Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {layout.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{layout.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {layout.category}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                      Click to apply →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {layoutPresets.length} layout presets available
        </p>
      </div>
    </div>
  );
};

export default LayoutPresets;