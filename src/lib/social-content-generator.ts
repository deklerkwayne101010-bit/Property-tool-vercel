// Social Media Content Generator
// Uses AI to generate engaging social media posts from property data

export interface PropertyData {
  title: string;
  price: string;
  address: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  propertyType: string;
  suburb: string;
  city: string;
  province: string;
  features: string[];
  images: string[];
}

export interface SocialContentOptions {
  platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram';
  tone: 'professional' | 'casual' | 'exciting' | 'luxury';
  length: 'short' | 'medium' | 'long';
  includeHashtags: boolean;
  includeEmojis: boolean;
  targetAudience: 'families' | 'professionals' | 'investors' | 'first-time-buyers';
  callToAction: boolean;
}

export interface GeneratedContent {
  text: string;
  hashtags: string[];
  suggestedImages: string[];
  characterCount: number;
  estimatedEngagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export class SocialContentGenerator {
  /**
   * Generate social media content for a property
   */
  static async generateContent(
    property: PropertyData,
    options: SocialContentOptions
  ): Promise<GeneratedContent> {
    const baseContent = this.buildBaseContent(property, options);
    const platformContent = this.adaptForPlatform(baseContent, options);
    const enhancedContent = this.addEnhancements(platformContent, options);

    return {
      text: enhancedContent,
      hashtags: this.generateHashtags(property, options),
      suggestedImages: this.selectSuggestedImages(property, options),
      characterCount: enhancedContent.length,
      estimatedEngagement: this.estimateEngagement(property, options)
    };
  }

  /**
   * Build base content structure
   */
  private static buildBaseContent(property: PropertyData, options: SocialContentOptions): string {
    const parts = [];

    // Hook based on target audience
    parts.push(this.generateHook(property, options));

    // Property highlights
    parts.push(this.generateHighlights(property, options));

    // Key features
    if (property.features.length > 0) {
      parts.push(this.generateFeatures(property, options));
    }

    // Location benefits
    parts.push(this.generateLocationBenefits(property, options));

    // Call to action
    if (options.callToAction) {
      parts.push(this.generateCallToAction(property, options));
    }

    return parts.join('\n\n');
  }

  /**
   * Generate attention-grabbing hook
   */
  private static generateHook(property: PropertyData, options: SocialContentOptions): string {
    const hooks = {
      families: [
        `🏡 Dream home alert in ${property.suburb}!`,
        `👨‍👩‍👧‍👦 Perfect family home waiting for you!`,
        `🌟 Your family's next chapter starts here!`
      ],
      professionals: [
        `🏢 Executive living at its finest!`,
        `💼 Prime location for the modern professional!`,
        `🌆 Urban sophistication meets comfort!`
      ],
      investors: [
        `📈 Smart investment opportunity!`,
        `💰 Prime property with excellent ROI potential!`,
        `🏗️ Development opportunity in growing area!`
      ],
      'first-time-buyers': [
        `🎯 Your first home journey starts here!`,
        `🌱 Perfect starter home for first-time buyers!`,
        `🚀 Take the first step to homeownership!`
      ]
    };

    const audienceHooks = hooks[options.targetAudience] || hooks.families;
    return audienceHooks[Math.floor(Math.random() * audienceHooks.length)];
  }

  /**
   * Generate property highlights
   */
  private static generateHighlights(property: PropertyData, options: SocialContentOptions): string {
    const highlights = [];

    // Price highlight
    if (property.price) {
      highlights.push(`💰 ${property.price}`);
    }

    // Size highlights
    if (property.bedrooms && property.bedrooms !== '0') {
      highlights.push(`🛏️ ${property.bedrooms} bedroom${property.bedrooms !== '1' ? 's' : ''}`);
    }

    if (property.bathrooms && property.bathrooms !== '0') {
      highlights.push(`🛁 ${property.bathrooms} bathroom${property.bathrooms !== '1' ? 's' : ''}`);
    }

    if (property.garages && property.garages !== '0') {
      highlights.push(`🚗 ${property.garages} garage${property.garages !== '1' ? 's' : ''}`);
    }

    // Property type
    if (property.propertyType) {
      highlights.push(`🏠 ${property.propertyType}`);
    }

    return highlights.join(' • ');
  }

  /**
   * Generate features section
   */
  private static generateFeatures(property: PropertyData, options: SocialContentOptions): string {
    const topFeatures = property.features.slice(0, 3);
    const featureEmojis = ['✨', '🌟', '💫', '🔥', '🎯'];

    if (options.platform === 'twitter') {
      // Keep it short for Twitter
      return `Key features: ${topFeatures.join(', ')}`;
    }

    const featuresWithEmojis = topFeatures.map((feature, index) =>
      `${featureEmojis[index] || '•'} ${feature}`
    );

    return `✨ **Key Features:**\n${featuresWithEmojis.join('\n')}`;
  }

  /**
   * Generate location benefits
   */
  private static generateLocationBenefits(property: PropertyData, options: SocialContentOptions): string {
    const location = [property.suburb, property.city].filter(Boolean).join(', ');

    const benefits = {
      families: [
        `📍 Perfect location in ${location} - close to schools, shopping, and amenities!`,
        `🎓 Family-friendly neighborhood in ${location} with excellent schools nearby!`,
        `🛒 Convenient living in ${location} - everything you need within reach!`
      ],
      professionals: [
        `📍 Prime ${location} location - easy access to business districts and transport!`,
        `🚗 Excellent connectivity in ${location} - perfect for commuting professionals!`,
        `🏙️ Urban convenience meets suburban charm in ${location}!`
      ],
      investors: [
        `📍 High-growth area in ${location} - excellent investment potential!`,
        `📈 Up-and-coming neighborhood in ${location} with strong market trends!`,
        `💹 Smart location choice in ${location} for property investors!`
      ],
      'first-time-buyers': [
        `📍 Great starter home location in ${location} - affordable and convenient!`,
        `🚌 Well-connected area in ${location} - easy access to transport and amenities!`,
        `🌱 Perfect first home location in ${location} - grow with your community!`
      ]
    };

    const audienceBenefits = benefits[options.targetAudience] || benefits.families;
    return audienceBenefits[Math.floor(Math.random() * audienceBenefits.length)];
  }

  /**
   * Generate call to action
   */
  private static generateCallToAction(property: PropertyData, options: SocialContentOptions): string {
    const ctas = {
      facebook: [
        '📞 Contact us today to arrange a viewing!',
        '💬 DM us for more details and photos!',
        '🏃‍♂️ Don\'t miss out - schedule your viewing now!'
      ],
      linkedin: [
        '💼 Let\'s discuss this opportunity!',
        '📞 Contact our team for exclusive details!',
        '🤝 Ready to explore this property? Get in touch!'
      ],
      twitter: [
        'DM for details! 🏠',
        'Contact us now! 📞',
        'Let\'s make this yours! 💫'
      ],
      instagram: [
        '💬 Tap the link in bio for more info!',
        '📱 DM us to learn more!',
        '🏡 Your dream home awaits! Link in bio ⬆️'
      ]
    };

    const platformCtas = ctas[options.platform] || ctas.facebook;
    return platformCtas[Math.floor(Math.random() * platformCtas.length)];
  }

  /**
   * Adapt content for specific platform
   */
  private static adaptForPlatform(content: string, options: SocialContentOptions): string {
    let adaptedContent = content;

    switch (options.platform) {
      case 'twitter':
        // Keep Twitter posts under 280 characters
        if (content.length > 250) {
          adaptedContent = content.substring(0, 220) + '... #RealEstate';
        }
        break;

      case 'linkedin':
        // LinkedIn posts can be longer, add professional tone
        if (options.tone === 'professional') {
          adaptedContent = adaptedContent.replace(/🏡/g, '🏠').replace(/💰/g, '💼');
        }
        break;

      case 'instagram':
        // Instagram posts work well with emojis and visual language
        adaptedContent = adaptedContent.replace(/📍/g, '📍✨');
        break;

      case 'facebook':
        // Facebook posts can be more conversational
        break;
    }

    return adaptedContent;
  }

  /**
   * Add enhancements like emojis and formatting
   */
  private static addEnhancements(content: string, options: SocialContentOptions): string {
    let enhanced = content;

    if (options.includeEmojis) {
      // Add more emojis based on tone
      const emojiSets = {
        exciting: ['🚀', '💫', '🔥', '✨', '🌟'],
        luxury: ['💎', '👑', '🏛️', '🌟', '💫'],
        casual: ['😊', '🏠', '❤️', '👍', '🎉'],
        professional: ['💼', '🏢', '📈', '🤝', '✅']
      };

      const emojis = emojiSets[options.tone] || emojiSets.casual;
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      // Add emoji at the beginning if not already present
      if (!enhanced.startsWith('🏡') && !enhanced.startsWith('🏠')) {
        enhanced = randomEmoji + ' ' + enhanced;
      }
    }

    return enhanced;
  }

  /**
   * Generate relevant hashtags
   */
  private static generateHashtags(property: PropertyData, options: SocialContentOptions): string[] {
    if (!options.includeHashtags) return [];

    const baseHashtags = [
      '#RealEstate',
      '#Property',
      '#Home',
      '#HouseHunting'
    ];

    const locationHashtags = [];
    if (property.city) {
      locationHashtags.push(`#${property.city.replace(/\s+/g, '')}`);
    }
    if (property.suburb) {
      locationHashtags.push(`#${property.suburb.replace(/\s+/g, '')}`);
    }

    const propertyTypeHashtags = [];
    if (property.propertyType) {
      propertyTypeHashtags.push(`#${property.propertyType.replace(/\s+/g, '')}`);
    }

    const audienceHashtags = {
      families: ['#FamilyHome', '#DreamHome', '#FamilyLiving'],
      professionals: ['#ExecutiveHome', '#LuxuryLiving', '#Professional'],
      investors: ['#Investment', '#PropertyInvestment', '#RealEstateInvestment'],
      'first-time-buyers': ['#FirstTimeBuyer', '#HomeBuyer', '#StarterHome']
    };

    const audienceTags = audienceHashtags[options.targetAudience] || audienceHashtags.families;

    // Combine and limit to platform-appropriate number
    const maxHashtags = options.platform === 'twitter' ? 3 : 5;
    const allHashtags = [...baseHashtags, ...locationHashtags, ...propertyTypeHashtags, ...audienceTags];

    // Remove duplicates and limit
    return [...new Set(allHashtags)].slice(0, maxHashtags);
  }

  /**
   * Select suggested images for the post
   */
  private static selectSuggestedImages(property: PropertyData, options: SocialContentOptions): string[] {
    if (!property.images || property.images.length === 0) return [];

    // For different platforms, suggest different image strategies
    switch (options.platform) {
      case 'instagram':
        // Instagram works best with 1-3 high-quality images
        return property.images.slice(0, 3);

      case 'facebook':
        // Facebook can handle multiple images
        return property.images.slice(0, 4);

      case 'twitter':
        // Twitter works best with 1 image
        return property.images.slice(0, 1);

      case 'linkedin':
        // LinkedIn works well with 1-2 professional images
        return property.images.slice(0, 2);

      default:
        return property.images.slice(0, 1);
    }
  }

  /**
   * Estimate engagement potential
   */
  private static estimateEngagement(property: PropertyData, options: SocialContentOptions): any {
    // This is a simplified estimation based on property features and platform
    let baseEngagement = {
      likes: 10,
      shares: 2,
      comments: 1
    };

    // Adjust based on property type and price
    if (property.price && parseInt(property.price.replace(/[^\d]/g, '')) > 2000000) {
      baseEngagement.likes *= 1.5;
      baseEngagement.shares *= 2;
    }

    // Adjust based on platform
    const platformMultipliers = {
      facebook: { likes: 1.2, shares: 1.5, comments: 1.3 },
      linkedin: { likes: 0.8, shares: 1.2, comments: 0.9 },
      twitter: { likes: 1.0, shares: 1.8, comments: 1.1 },
      instagram: { likes: 1.5, shares: 0.5, comments: 1.2 }
    };

    const multipliers = platformMultipliers[options.platform];
    baseEngagement.likes *= multipliers.likes;
    baseEngagement.shares *= multipliers.shares;
    baseEngagement.comments *= multipliers.comments;

    // Adjust based on tone
    if (options.tone === 'exciting') {
      baseEngagement.likes *= 1.3;
      baseEngagement.comments *= 1.2;
    }

    return {
      likes: Math.round(baseEngagement.likes),
      shares: Math.round(baseEngagement.shares),
      comments: Math.round(baseEngagement.comments)
    };
  }

  /**
   * Generate multiple content variations
   */
  static async generateVariations(
    property: PropertyData,
    options: SocialContentOptions,
    count: number = 3
  ): Promise<GeneratedContent[]> {
    const variations = [];

    for (let i = 0; i < count; i++) {
      // Slightly modify options for variety
      const variationOptions = {
        ...options,
        tone: i === 0 ? options.tone :
              i === 1 ? 'exciting' as const :
              'casual' as const
      };

      const content = await this.generateContent(property, variationOptions);
      variations.push(content);
    }

    return variations;
  }

  /**
   * Optimize content for better engagement
   */
  static optimizeContent(content: GeneratedContent, platform: string): GeneratedContent {
    let optimizedText = content.text;

    // Platform-specific optimizations
    switch (platform) {
      case 'twitter':
        // Ensure it's under 280 characters
        if (optimizedText.length > 280) {
          optimizedText = optimizedText.substring(0, 250) + '...';
        }
        break;

      case 'instagram':
        // Add line breaks for better readability
        optimizedText = optimizedText.replace(/\n\n/g, '\n\n• ');
        break;

      case 'linkedin':
        // Make it more professional
        optimizedText = optimizedText.replace(/💰/g, '💼').replace(/🏡/g, '🏢');
        break;
    }

    return {
      ...content,
      text: optimizedText,
      characterCount: optimizedText.length
    };
  }
}