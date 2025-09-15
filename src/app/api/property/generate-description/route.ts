import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type definitions for better TypeScript support
type CityKey = keyof typeof SA_PROPERTY_CONTEXT.cities;
type PropertyTypeKey = keyof typeof SA_PROPERTY_CONTEXT.propertyTypes;
type PlatformKey = keyof typeof PLATFORM_OPTIMIZATIONS;
type ToneKey = keyof typeof TONE_PROFILES;

// Length guidelines defined here for type reference
const lengthGuidelines = {
  short: { min: 50, max: 100, focus: 'key highlights and essential information' },
  medium: { min: 100, max: 200, focus: 'balanced detail with lifestyle appeal' },
  long: { min: 200, max: 300, focus: 'comprehensive description with emotional connection' },
  detailed: { min: 300, max: 500, focus: 'complete property story with investment context' }
};

type LengthKey = keyof typeof lengthGuidelines;

// South African property market context
const SA_PROPERTY_CONTEXT = {
  cities: {
    'Cape Town': {
      suburbs: ['Claremont', 'Newlands', 'Constantia', 'Bishopscourt', 'Sea Point', 'Green Point', 'Waterfront'],
      attractions: ['Table Mountain', 'Cape Point', 'Beaches', 'Winelands', 'City Bowl'],
      lifestyle: 'coastal lifestyle, mountain views, vibrant culture'
    },
    'Johannesburg': {
      suburbs: ['Sandton', 'Hyde Park', 'Fourways', 'Midrand', 'Randburg', 'Roodepoort'],
      attractions: ['Sandton City', 'Apartheid Museum', 'Lion Park', 'Apartheid Museum'],
      lifestyle: 'urban sophistication, business hub, diverse communities'
    },
    'Durban': {
      suburbs: ['Umhlanga', 'Ballito', 'Hillcrest', 'Westville', 'Pinetown'],
      attractions: ['Golden Mile', 'uShaka Marine World', 'Botanical Gardens', 'Indian Ocean beaches'],
      lifestyle: 'tropical climate, beach lifestyle, multicultural vibrancy'
    },
    'Pretoria': {
      suburbs: ['Brooklyn', 'Menlyn', 'Waterkloof', 'Lynnwood', 'Hatfield'],
      attractions: ['Voortrekker Monument', 'Union Buildings', 'National Zoological Gardens'],
      lifestyle: 'academic excellence, government city, green suburbs'
    }
  },
  propertyTypes: {
    house: 'standalone family home with garden',
    apartment: 'modern urban living space',
    townhouse: 'secure complex living',
    duplex: 'versatile dual living option'
  },
  marketTerms: [
    'prime location', 'secure estate', 'complex living', 'garden suburb',
    'walking distance', 'public transport', 'schools nearby', 'shopping centers',
    'medical facilities', 'recreational facilities', 'pet-friendly', 'alarm system'
  ]
};

// Platform-specific optimizations
const PLATFORM_OPTIMIZATIONS = {
  Property24: {
    keywords: ['Property24', 'property for sale', 'property to rent', 'real estate', 'South Africa'],
    style: 'professional, detailed, SEO-optimized',
    focus: 'comprehensive property details, location benefits, lifestyle appeal'
  },
  'Private Property': {
    keywords: ['Private Property', 'luxury homes', 'premium property', 'exclusive estates'],
    style: 'luxury, sophisticated, aspirational',
    focus: 'premium features, exclusivity, investment potential'
  },
  Facebook: {
    keywords: ['for sale', 'to rent', 'property', 'home', 'house'],
    style: 'engaging, conversational, emotive',
    focus: 'emotional appeal, quick highlights, call-to-action'
  },
  WhatsApp: {
    keywords: ['available now', 'viewing available', 'serious buyers only'],
    style: 'personal, direct, informative',
    focus: 'key facts, availability, contact information'
  },
  Email: {
    keywords: ['exclusive listing', 'off-market opportunity', 'investment property'],
    style: 'professional, detailed, persuasive',
    focus: 'comprehensive benefits, market context, negotiation advantages'
  }
};

// Tone-specific writing styles
const TONE_PROFILES = {
  professional: {
    style: 'formal, trustworthy, informative',
    language: 'industry-standard terms, factual presentation',
    focus: 'comprehensive details, market positioning'
  },
  warm: {
    style: 'friendly, approachable, inviting',
    language: 'conversational, emotional connection',
    focus: 'lifestyle benefits, family appeal, comfort'
  },
  enthusiastic: {
    style: 'energetic, exciting, passionate',
    language: 'dynamic language, exclamation points, vivid descriptions',
    focus: 'unique features, lifestyle enhancement, excitement'
  },
  luxury: {
    style: 'sophisticated, aspirational, exclusive',
    language: 'premium vocabulary, elegant descriptions',
    focus: 'high-end features, prestige, investment value'
  },
  storytelling: {
    style: 'narrative, immersive, emotional',
    language: 'story-like structure, sensory details',
    focus: 'lifestyle narrative, emotional connection, memorable experience'
  }
};

async function handler(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyData,
      tone = 'professional',
      platform = 'Property24',
      keywords = '',
      length = 'medium',
      includePrice = true,
      focusPoints = [],
      callToAction = true
    } = body;

    if (!propertyData?.title) {
      return NextResponse.json(
        { error: 'Property title is required' },
        { status: 400 }
      );
    }

    // Enhanced property details with South African context
    const location = propertyData.location || {};
    const cityContext = SA_PROPERTY_CONTEXT.cities[location.city as CityKey] || {};
    const propertyTypeContext = SA_PROPERTY_CONTEXT.propertyTypes[propertyData.propertyType as PropertyTypeKey] || propertyData.propertyType;

    const propertyDetails = {
      basic: {
        title: propertyData.title,
        type: propertyTypeContext,
        listingType: propertyData.listingType === 'sale' ? 'for sale' : 'to rent',
        price: includePrice && propertyData.price ? `R${propertyData.price.toLocaleString()}` : '',
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        squareFootage: propertyData.squareFootage || 0,
        erfSize: propertyData.erfSize || 0,
        yearBuilt: propertyData.yearBuilt || ''
      },
      location: {
        address: location.address || '',
        suburb: location.suburb || '',
        city: location.city || '',
        province: location.province || '',
        postalCode: location.postalCode || '',
        context: cityContext.attractions ? `near ${cityContext.attractions.slice(0, 2).join(' and ')}` : ''
      },
      features: {
        condition: propertyData.propertyCondition || '',
        parking: propertyData.parking || '',
        garden: propertyData.garden || '',
        amenities: propertyData.amenities || [],
        uniqueFeatures: propertyData.uniqueFeatures || [],
        sellingPoints: propertyData.uniqueSellingPoints || []
      },
      lifestyle: {
        petFriendly: propertyData.petFriendly,
        furnished: propertyData.furnished,
        waterIncluded: propertyData.waterIncluded,
        electricityIncluded: propertyData.electricityIncluded,
        internetIncluded: propertyData.internetIncluded
      }
    };

    // Build comprehensive prompt with South African context
    const platformOpt = PLATFORM_OPTIMIZATIONS[platform as PlatformKey] || PLATFORM_OPTIMIZATIONS.Property24;
    const toneProfile = TONE_PROFILES[tone as ToneKey] || TONE_PROFILES.professional;

    const lengthGuide = lengthGuidelines[length as LengthKey] || lengthGuidelines.medium;

    // Custom keywords integration
    const customKeywords = keywords ? keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k) : [];
    const allKeywords = [...platformOpt.keywords, ...customKeywords, ...SA_PROPERTY_CONTEXT.marketTerms.slice(0, 5)];

    // Focus points integration
    const focusText = focusPoints.length > 0
      ? `Emphasize these aspects: ${focusPoints.join(', ')}`
      : '';

    const prompt = `Create a compelling ${tone} property description optimized for ${platform} in the South African real estate market.

PROPERTY DETAILS:
• Title: ${propertyDetails.basic.title}
• Type: ${propertyDetails.basic.type}
• Listing: ${propertyDetails.basic.listingType}
${propertyDetails.basic.price ? `• Price: ${propertyDetails.basic.price}` : ''}
• Bedrooms: ${propertyDetails.basic.bedrooms}
• Bathrooms: ${propertyDetails.basic.bathrooms}
• Floor Size: ${propertyDetails.basic.squareFootage}m²
• Erf Size: ${propertyDetails.basic.erfSize}m²
${propertyDetails.basic.yearBuilt ? `• Year Built: ${propertyDetails.basic.yearBuilt}` : ''}

LOCATION CONTEXT:
• Address: ${propertyDetails.location.address}
• Area: ${propertyDetails.location.suburb}, ${propertyDetails.location.city}
• Province: ${propertyDetails.location.province}
${propertyDetails.location.context ? `• Nearby: ${propertyDetails.location.context}` : ''}

FEATURES & AMENITIES:
${propertyDetails.features.amenities.length > 0 ? `• Amenities: ${propertyDetails.features.amenities.join(', ')}` : ''}
${propertyDetails.features.uniqueFeatures.length > 0 ? `• Unique Features: ${propertyDetails.features.uniqueFeatures.join(', ')}` : ''}
${propertyDetails.features.sellingPoints.length > 0 ? `• Selling Points: ${propertyDetails.features.sellingPoints.join(', ')}` : ''}
${propertyDetails.features.condition ? `• Condition: ${propertyDetails.features.condition}` : ''}
${propertyDetails.features.parking ? `• Parking: ${propertyDetails.features.parking}` : ''}
${propertyDetails.features.garden ? `• Garden: ${propertyDetails.features.garden}` : ''}

LIFESTYLE FEATURES:
${propertyDetails.lifestyle.petFriendly ? '• Pet-friendly environment' : ''}
${propertyDetails.lifestyle.furnished ? '• Fully furnished' : ''}
${propertyDetails.lifestyle.waterIncluded ? '• Water included in rent' : ''}
${propertyDetails.lifestyle.electricityIncluded ? '• Electricity included in rent' : ''}
${propertyDetails.lifestyle.internetIncluded ? '• Internet included in rent' : ''}

WRITING REQUIREMENTS:
• Style: ${toneProfile.style}
• Length: ${lengthGuide.min}-${lengthGuide.max} words
• Focus: ${lengthGuide.focus}
• Platform optimization: ${platformOpt.focus}
${focusText ? `• Special focus: ${focusText}` : ''}
${callToAction ? '• Include a compelling call-to-action' : ''}

SEO KEYWORDS TO INCORPORATE: ${allKeywords.slice(0, 8).join(', ')}

SOUTH AFRICAN MARKET CONTEXT:
• Use local terminology and market understanding
• Reference nearby amenities and lifestyle benefits
• Include security and community considerations
• Highlight investment potential where relevant
• Use appropriate pricing context for the area

Create an engaging, SEO-optimized description that captures the property's unique appeal and creates an emotional connection with potential buyers.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert South African real estate copywriter with deep knowledge of the local property market, Property24 platform requirements, and what resonates with South African property buyers. You understand the cultural nuances, local terminology, and market dynamics specific to South African real estate.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const description = completion.choices[0]?.message?.content?.trim();

    if (!description) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    // Calculate word count and validate length
    const wordCount = description.split(/\s+/).length;
    const isValidLength = wordCount >= lengthGuide.min && wordCount <= lengthGuide.max;

    return NextResponse.json({
      description,
      wordCount,
      platform,
      tone,
      length: length,
      isValidLength,
      keywords: allKeywords.slice(0, 10),
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Property description generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate property description', details: errorMessage },
      { status: 500 }
    );
  }
}

export const POST = handler;