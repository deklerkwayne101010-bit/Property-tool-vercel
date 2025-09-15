// South African Real Estate Templates
// Pre-built templates with local market knowledge and terminology

export interface SATemplate {
  id: string;
  name: string;
  category: 'residential' | 'commercial' | 'vacant_land' | 'student' | 'retirement' | 'luxury';
  type: 'sale' | 'rental' | 'auction';
  province: 'western_cape' | 'gauteng' | 'kwazulu_natal' | 'eastern_cape' | 'limpopo' | 'mpumalanga' | 'north_west' | 'northern_cape' | 'free_state' | 'all';
  priceRange: 'budget' | 'affordable' | 'mid_range' | 'premium' | 'luxury';
  targetMarket: 'families' | 'professionals' | 'investors' | 'students' | 'retirees' | 'expats';
  template: {
    title: string;
    description: string;
    features: string[];
    highlights: string[];
    callToAction: string;
  };
  variables: Record<string, any>;
  preview: {
    image: string;
    estimatedValue: string;
    location: string;
  };
}

export const southAfricanTemplates: SATemplate[] = [
  // Western Cape Templates
  {
    id: 'cape_town_family_home',
    name: 'Cape Town Family Home',
    category: 'residential',
    type: 'sale',
    province: 'western_cape',
    priceRange: 'premium',
    targetMarket: 'families',
    template: {
      title: 'Charming Family Home in Prime Cape Town Location',
      description: `Discover this beautiful {{bedrooms}} bedroom family home in the heart of {{suburb}}, Cape Town. Perfect for growing families looking for quality education and lifestyle.

This {{propertyType}} offers {{squareFootage}}m² of living space with {{bathrooms}} modern bathrooms and {{garages}} garage spaces. The open-plan design creates the perfect flow for family living, while the established garden provides a safe play area for children.

Key features include:
• Spacious lounge and dining area with built-in bar counter
• Modern kitchen with granite tops and quality appliances
• {{bedrooms}} Bedrooms with built-in cupboards
• Family bathroom plus en-suite
• Double garage with additional parking
• Low maintenance garden with irrigation system
• Prepaid electricity meter
• Fibre ready for high-speed internet

Located in a quiet cul-de-sac, yet walking distance to excellent schools, shopping centres, and public transport. Close to major highways for easy access to the CBD and airport.

Priced at {{price}} - this represents excellent value in today's market!`,
      features: [
        'Built-in braai area',
        'Solar geyser for energy savings',
        'Security gates and burglar bars',
        'Close to Blue Route Mall',
        'Excellent school districts',
        'Fibre optic infrastructure'
      ],
      highlights: [
        'Walking distance to excellent schools',
        'Close to shopping and amenities',
        'Secure neighbourhood with 24/7 security',
        'Modern finishes throughout',
        'Low maintenance garden'
      ],
      callToAction: 'Contact us today for a private viewing! 📞 {{agentPhone}}'
    },
    variables: {
      suburb: 'Claremont',
      bedrooms: '4',
      bathrooms: '2',
      garages: '2',
      propertyType: 'house',
      squareFootage: '250',
      price: 'R 3,200,000',
      agentPhone: '021 555 0123'
    },
    preview: {
      image: '/templates/cape-town-family.jpg',
      estimatedValue: 'R 3.2M',
      location: 'Claremont, Cape Town'
    }
  },

  {
    id: 'stellenbosch_student_property',
    name: 'Stellenbosch Student Property',
    category: 'student',
    type: 'rental',
    province: 'western_cape',
    priceRange: 'affordable',
    targetMarket: 'students',
    template: {
      title: 'Modern Student Accommodation - Stellenbosch University',
      description: `Perfect for University of Stellenbosch students! This {{bedrooms}} bedroom student property offers modern living in a prime location.

Just a 10-minute walk to the university campus, this property provides:
• {{bedrooms}} Furnished bedrooms with study desks
• Shared modern kitchen and lounge area
• {{bathrooms}} Bathrooms with showers
• Secure parking for {{garages}} vehicles
• High-speed fibre internet included
• Cleaning service twice per week
• 24/7 security on premises

All rooms come with:
✓ Study desk and chair
✓ Built-in wardrobe
✓ Reading lamp
✓ Bed linen and towels provided

The property is situated in a quiet residential area, perfect for focused study while being close to campus facilities, restaurants, and entertainment.

Available from {{availableDate}} at only R{{price}} per month per person (including utilities and internet).

Limited spaces available - first come, first served!`,
      features: [
        'Walking distance to campus',
        'Fully furnished',
        'Utilities included',
        'High-speed internet',
        'Cleaning service',
        'Secure parking'
      ],
      highlights: [
        'Prime student location',
        'All-inclusive pricing',
        'Modern furnishings',
        'Secure environment',
        'Close to campus facilities'
      ],
      callToAction: 'Book your viewing today! 🎓 {{agentPhone}}'
    },
    variables: {
      bedrooms: '6',
      bathrooms: '3',
      garages: '2',
      price: '4,500',
      availableDate: 'February 2024',
      agentPhone: '021 555 0456'
    },
    preview: {
      image: '/templates/stellenbosch-student.jpg',
      estimatedValue: 'R 4,500/pm per person',
      location: 'Stellenbosch Central'
    }
  },

  // Gauteng Templates
  {
    id: 'sandton_executive_home',
    name: 'Sandton Executive Home',
    category: 'residential',
    type: 'sale',
    province: 'gauteng',
    priceRange: 'luxury',
    targetMarket: 'professionals',
    template: {
      title: 'Luxury Executive Home in Prestigious Sandton',
      description: `Exceptional {{bedrooms}} bedroom executive home in the prestigious Morningside area of Sandton. This architectural masterpiece offers the ultimate in luxury living.

Property Features:
• {{squareFootage}}m² under roof with {{bathrooms}} luxurious bathrooms
• Master suite with walk-in dressing room and spa bathroom
• Gourmet kitchen with top-of-the-line appliances
• Open-plan entertainment area with built-in bar
• Home office with built-in cabinets
• {{garages}} Automated garage with additional parking
• Infinity pool with entertainment deck
• Mature landscaped gardens
• 24/7 Estate security with electric fencing
• Prepaid electricity and water meters
• Fibre optic infrastructure throughout

Located in a secure estate with 24/7 armed response, yet conveniently located:
✓ 5 minutes from Sandton City shopping centre
✓ Easy access to major highways (N1, M1, N3)
✓ Walking distance to excellent international schools
✓ Close to Sandton CBD and business district

This property represents the pinnacle of luxury living in Johannesburg's most sought-after suburb. Priced at {{price}} - a rare opportunity in today's competitive market.`,
      features: [
        'Smart home automation',
        'Solar panels for energy efficiency',
        'Home gym with equipment',
        'Wine cellar',
        'Entertainment deck with built-in braai',
        'Paved driveway for multiple vehicles'
      ],
      highlights: [
        'Architectural masterpiece',
        'Premium Sandton location',
        'Ultimate luxury finishes',
        'Secure estate living',
        'Prime business location'
      ],
      callToAction: 'Exclusive viewing available - contact us now! 🏛️ {{agentPhone}}'
    },
    variables: {
      bedrooms: '5',
      bathrooms: '4',
      garages: '3',
      squareFootage: '850',
      price: 'R 12,500,000',
      agentPhone: '011 555 0789'
    },
    preview: {
      image: '/templates/sandton-luxury.jpg',
      estimatedValue: 'R 12.5M',
      location: 'Morningside, Sandton'
    }
  },

  // KwaZulu-Natal Templates
  {
    id: 'durban_beachfront_apartment',
    name: 'Durban Beachfront Apartment',
    category: 'residential',
    type: 'sale',
    province: 'kwazulu_natal',
    priceRange: 'premium',
    targetMarket: 'professionals',
    template: {
      title: 'Stunning Beachfront Apartment with Ocean Views',
      description: `Wake up to breathtaking Indian Ocean views every morning! This {{bedrooms}} bedroom beachfront apartment in Umhlanga Rocks offers the ultimate coastal lifestyle.

Apartment Features:
• {{squareFootage}}m² of luxurious living space
• Master bedroom with ocean views and en-suite
• Open-plan lounge, dining, and kitchen
• Modern kitchen with granite countertops
• {{bathrooms}} Full bathrooms with quality finishes
• Covered balcony with ocean views
• 2 Secure underground parking bays
• 24/7 Security with controlled access
• Fibre optic internet ready

Building Amenities:
✓ Infinity pool with ocean views
✓ State-of-the-art gym and sauna
✓ Secure parking for residents and guests
✓ 24/7 Concierge service
✓ Beautifully landscaped gardens

Location Benefits:
• Walking distance to Umhlanga Harbour shopping
• Direct beach access
• Close to Gateway Theatre of Shopping
• Easy access to uMhlanga Highway
• Short drive to King Shaka International Airport

Perfect for professionals seeking a luxury coastal lifestyle. Priced at {{price}} - this represents exceptional value for beachfront living.`,
      features: [
        'Ocean views from every room',
        'Floor-to-ceiling windows',
        'Imported Italian tiles',
        'Smeg appliances in kitchen',
        'Walk-in closets in bedrooms',
        'Prepaid electricity meter'
      ],
      highlights: [
        'Direct beach access',
        'Ocean views',
        'Luxury building amenities',
        'Prime Umhlanga location',
        'Secure lifestyle'
      ],
      callToAction: 'Experience coastal luxury - view today! 🏖️ {{agentPhone}}'
    },
    variables: {
      bedrooms: '3',
      bathrooms: '2',
      squareFootage: '120',
      price: 'R 4,800,000',
      agentPhone: '031 555 0321'
    },
    preview: {
      image: '/templates/durban-beachfront.jpg',
      estimatedValue: 'R 4.8M',
      location: 'Umhlanga Rocks, Durban'
    }
  },

  // Commercial Property Template
  {
    id: 'johannesburg_commercial_space',
    name: 'Johannesburg Commercial Space',
    category: 'commercial',
    type: 'sale',
    province: 'gauteng',
    priceRange: 'premium',
    targetMarket: 'investors',
    template: {
      title: 'Prime Commercial Space in Johannesburg CBD',
      description: `Excellent investment opportunity! {{squareFootage}}m² commercial space in the heart of Johannesburg's Central Business District.

Property Details:
• Ground floor commercial space with excellent visibility
• {{squareFootage}}m² total area with open-plan layout
• Recently renovated with modern finishes
• 3 Phase electricity supply (60Amp)
• Fibre optic infrastructure installed
• Secure parking for 4 vehicles
• 24/7 Security in the building
• Close to Johannesburg Park Station
• Walking distance to major banks and corporations

Perfect for:
✓ Retail space
✓ Office space
✓ Professional services
✓ Medical practice
✓ Financial services

Located in Johannesburg's prime business district with excellent transport links and high foot traffic. This property offers strong investment potential with consistent rental demand.

Priced at {{price}} - representing a {{yield}}% gross yield based on current market rentals.`,
      features: [
        'High visibility location',
        'Modern renovations',
        '3-phase electricity',
        'Fibre optic ready',
        'Secure parking',
        '24/7 building security'
      ],
      highlights: [
        'Prime CBD location',
        'High foot traffic',
        'Modern commercial space',
        'Strong investment potential',
        'Excellent transport links'
      ],
      callToAction: 'Prime investment opportunity - inspect today! 💼 {{agentPhone}}'
    },
    variables: {
      squareFootage: '180',
      price: 'R 2,800,000',
      yield: '8.5',
      agentPhone: '011 555 0654'
    },
    preview: {
      image: '/templates/jhb-commercial.jpg',
      estimatedValue: 'R 2.8M',
      location: 'CBD, Johannesburg'
    }
  },

  // Vacant Land Template
  {
    id: 'pretoria_vacant_land',
    name: 'Pretoria Vacant Land Development Opportunity',
    category: 'vacant_land',
    type: 'sale',
    province: 'gauteng',
    priceRange: 'mid_range',
    targetMarket: 'investors',
    template: {
      title: '{{erfSize}}m² Vacant Land in Prime Pretoria Location',
      description: `Excellent development opportunity! {{erfSize}}m² vacant land in the up-and-coming {{suburb}} area of Pretoria.

Land Details:
• {{erfSize}}m² stand in secure area
• Level terrain perfect for development
• All services available (water, electricity, sewerage)
• Close to major shopping centres
• Easy access to N1 and N4 highways
• Zoned for residential development
• Approved building plans available

Location Advantages:
✓ 10 minutes from Pretoria CBD
✓ Close to University of Pretoria
✓ Walking distance to excellent schools
✓ Near major retail developments
✓ Good public transport access

Development Potential:
This land is zoned for single residential stands and offers excellent potential for:
• Family home development
• Townhouse complex
• Small holding development
• Investment holding

Priced at {{price}} per m² - this represents excellent value in a growth area with strong development potential.`,
      features: [
        'All services connected',
        'Approved building plans',
        'Level terrain',
        'Secure neighbourhood',
        'Close to amenities',
        'Highway access'
      ],
      highlights: [
        'Development opportunity',
        'Prime Pretoria location',
        'All services available',
        'Strong growth potential',
        'Approved plans available'
      ],
      callToAction: 'Development opportunity - contact us now! 🏗️ {{agentPhone}}'
    },
    variables: {
      erfSize: '1200',
      suburb: 'Lynnwood',
      price: 'R 1,200',
      agentPhone: '012 555 0987'
    },
    preview: {
      image: '/templates/pretoria-land.jpg',
      estimatedValue: 'R 1,440,000',
      location: 'Lynnwood, Pretoria'
    }
  },

  // Retirement Village Template
  {
    id: 'retirement_village_cape_town',
    name: 'Cape Town Retirement Village',
    category: 'retirement',
    type: 'sale',
    province: 'western_cape',
    priceRange: 'premium',
    targetMarket: 'retirees',
    template: {
      title: 'Luxury Retirement Living in Cape Town',
      description: `Welcome to {{villageName}} - Cape Town's premier retirement village offering the ultimate in luxury retirement living.

{{unitType}} Features:
• {{bedrooms}} Bedroom {{unitType}} with {{bathrooms}} bathrooms
• {{squareFootage}}m² of comfortable living space
• Open-plan lounge and dining area
• Modern kitchen with built-in appliances
• Spacious bedroom with built-in cupboards
• Full bathroom with walk-in shower
• Private patio or balcony
• Prepaid electricity meter

Village Amenities:
✓ 24/7 Security and medical assistance
✓ Beautifully landscaped gardens
✓ Swimming pool and spa facilities
✓ Hair salon and beauty services
✓ Restaurant and coffee shop
✓ Library and craft room
✓ Bowling green and putting course
✓ Regular social activities and outings

Healthcare Services:
✓ On-site medical centre
✓ 24/7 nursing assistance available
✓ Emergency call system in all units
✓ Ambulance service arrangements

Located in the beautiful {{suburb}} area with stunning views and mild climate. Close to medical facilities, shopping centres, and public transport.

Priced at {{price}} - includes transfer costs and all village fees for the first year.`,
      features: [
        '24/7 medical assistance',
        'Beautiful gardens and facilities',
        'Social activities program',
        'On-site restaurant',
        'Emergency call system',
        'Housekeeping services available'
      ],
      highlights: [
        'Luxury retirement living',
        '24/7 security and care',
        'Beautiful Cape Town location',
        'Full amenities and services',
        'Peaceful and secure environment'
      ],
      callToAction: 'Your retirement dream awaits! 🏡 {{agentPhone}}'
    },
    variables: {
      villageName: 'The Village at Constantia',
      unitType: 'apartment',
      bedrooms: '2',
      bathrooms: '1',
      squareFootage: '85',
      suburb: 'Constantia',
      price: 'R 2,950,000',
      agentPhone: '021 555 0765'
    },
    preview: {
      image: '/templates/retirement-village.jpg',
      estimatedValue: 'R 2.95M',
      location: 'Constantia, Cape Town'
    }
  }
];

export class SATemplateManager {
  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): SATemplate[] {
    return southAfricanTemplates.filter(template => template.category === category);
  }

  /**
   * Get templates by province
   */
  static getTemplatesByProvince(province: string): SATemplate[] {
    return southAfricanTemplates.filter(template =>
      template.province === province || template.province === 'all'
    );
  }

  /**
   * Get templates by price range
   */
  static getTemplatesByPriceRange(priceRange: string): SATemplate[] {
    return southAfricanTemplates.filter(template => template.priceRange === priceRange);
  }

  /**
   * Get templates by target market
   */
  static getTemplatesByTargetMarket(targetMarket: string): SATemplate[] {
    return southAfricanTemplates.filter(template => template.targetMarket === targetMarket);
  }

  /**
   * Search templates
   */
  static searchTemplates(query: string): SATemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return southAfricanTemplates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery) ||
      template.province.toLowerCase().includes(lowercaseQuery) ||
      template.template.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get template by ID
   */
  static getTemplateById(id: string): SATemplate | undefined {
    return southAfricanTemplates.find(template => template.id === id);
  }

  /**
   * Get recommended templates based on property data
   */
  static getRecommendedTemplates(propertyData: any): SATemplate[] {
    const recommendations: SATemplate[] = [];

    // Determine category based on property type
    let category = 'residential';
    if (propertyData.propertyType?.toLowerCase().includes('commercial')) {
      category = 'commercial';
    } else if (propertyData.features?.some((f: string) =>
      f.toLowerCase().includes('student') || f.toLowerCase().includes('university')
    )) {
      category = 'student';
    }

    // Get price range
    let priceRange = 'affordable';
    const price = parseInt(propertyData.price?.replace(/[^\d]/g, '') || '0');
    if (price > 10000000) priceRange = 'luxury';
    else if (price > 5000000) priceRange = 'premium';
    else if (price > 2000000) priceRange = 'mid_range';

    // Get templates matching criteria
    const matchingTemplates = southAfricanTemplates.filter(template =>
      template.category === category &&
      template.priceRange === priceRange
    );

    return matchingTemplates.slice(0, 3); // Return top 3 matches
  }

  /**
   * Get all unique categories
   */
  static getCategories(): string[] {
    return [...new Set(southAfricanTemplates.map(template => template.category))];
  }

  /**
   * Get all unique provinces
   */
  static getProvinces(): string[] {
    return [...new Set(southAfricanTemplates.map(template => template.province))];
  }

  /**
   * Get all unique price ranges
   */
  static getPriceRanges(): string[] {
    return [...new Set(southAfricanTemplates.map(template => template.priceRange))];
  }

  /**
   * Get all unique target markets
   */
  static getTargetMarkets(): string[] {
    return [...new Set(southAfricanTemplates.map(template => template.targetMarket))];
  }
}