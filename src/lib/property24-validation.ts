// Property24 Data Validation and Mapping Utilities
// Ensures imported data meets our requirements and maps correctly

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData: any;
}

export interface Property24ValidationOptions {
  strictMode?: boolean;
  allowPartialData?: boolean;
  autoCorrect?: boolean;
}

export class Property24DataValidator {
  /**
   * Validate and sanitize Property24 scraped data
   */
  static validatePropertyData(
    rawData: any,
    options: Property24ValidationOptions = {}
  ): ValidationResult {
    const {
      strictMode = false,
      allowPartialData = true,
      autoCorrect = true
    } = options;

    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedData: any = { ...rawData };

    // Validate required fields
    if (!this.validateRequiredFields(rawData, errors, strictMode)) {
      return {
        isValid: false,
        errors,
        warnings,
        sanitizedData: null
      };
    }

    // Validate and sanitize individual fields
    this.validateTitle(sanitizedData, errors, warnings, autoCorrect);
    this.validatePrice(sanitizedData, errors, warnings, autoCorrect);
    this.validateAddress(sanitizedData, errors, warnings, autoCorrect);
    this.validatePropertyDetails(sanitizedData, errors, warnings, autoCorrect);
    this.validateAgentInfo(sanitizedData, errors, warnings, autoCorrect);
    this.validateImages(sanitizedData, errors, warnings, autoCorrect);
    this.validateFeatures(sanitizedData, errors, warnings, autoCorrect);

    // Check for data completeness
    if (!allowPartialData && !this.isDataComplete(sanitizedData)) {
      errors.push('Property data is incomplete. Some required fields are missing.');
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      sanitizedData: isValid ? sanitizedData : null
    };
  }

  /**
   * Validate required fields
   */
  private static validateRequiredFields(
    data: any,
    errors: string[],
    strictMode: boolean
  ): boolean {
    const requiredFields = ['title', 'address', 'propertyId'];

    if (strictMode) {
      requiredFields.push('price', 'bedrooms', 'bathrooms');
    }

    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`Required field '${field}' is missing or empty`);
      }
    }

    return errors.length === 0;
  }

  /**
   * Validate and sanitize title
   */
  private static validateTitle(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    if (!data.title) return;

    // Remove excessive whitespace
    if (autoCorrect) {
      data.title = data.title.trim().replace(/\s+/g, ' ');
    }

    // Check length
    if (data.title.length < 5) {
      warnings.push('Property title is very short');
    } else if (data.title.length > 200) {
      if (autoCorrect) {
        data.title = data.title.substring(0, 200) + '...';
        warnings.push('Property title was truncated to 200 characters');
      } else {
        errors.push('Property title is too long (max 200 characters)');
      }
    }

    // Check for suspicious content
    if (data.title.toLowerCase().includes('test') || data.title.toLowerCase().includes('dummy')) {
      warnings.push('Property title appears to be test data');
    }
  }

  /**
   * Validate and sanitize price
   */
  private static validatePrice(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    if (!data.price) return;

    // Extract numeric value
    const priceMatch = data.price.toString().match(/(\d+(?:[.,]\d+)*)/);
    if (!priceMatch) {
      errors.push('Unable to extract numeric price from data');
      return;
    }

    const numericPrice = parseFloat(priceMatch[1].replace(/,/g, ''));

    if (isNaN(numericPrice)) {
      errors.push('Invalid price format');
      return;
    }

    // Check for unrealistic prices (South African property market)
    if (numericPrice < 100000) {
      warnings.push('Price seems unusually low for South African property market');
    } else if (numericPrice > 100000000) { // 100 million
      warnings.push('Price seems unusually high - please verify');
    }

    // Format price consistently
    if (autoCorrect) {
      data.price = `R ${numericPrice.toLocaleString()}`;
    }
  }

  /**
   * Validate and sanitize address
   */
  private static validateAddress(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    if (!data.address) return;

    if (autoCorrect) {
      data.address = data.address.trim().replace(/\s+/g, ' ');
    }

    // Check for South African cities/provinces
    const southAfricanLocations = [
      'cape town', 'johannesburg', 'durban', 'pretoria', 'port elizabeth',
      'bloemfontein', 'east london', 'kimberley', 'upington', 'george',
      'stellenbosch', 'paarl', 'worcester', 'knysna', 'jeffreys bay'
    ];

    const addressLower = data.address.toLowerCase();
    const hasSouthAfricanLocation = southAfricanLocations.some(location =>
      addressLower.includes(location)
    );

    if (!hasSouthAfricanLocation) {
      warnings.push('Address may not be in South Africa - please verify location');
    }
  }

  /**
   * Validate property details (bedrooms, bathrooms, etc.)
   */
  private static validatePropertyDetails(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    const numericFields = ['bedrooms', 'bathrooms', 'garages'];

    for (const field of numericFields) {
      if (data[field]) {
        const numericValue = parseInt(data[field].toString());

        if (isNaN(numericValue)) {
          errors.push(`Invalid ${field} value: ${data[field]}`);
        } else {
          if (autoCorrect) {
            data[field] = numericValue.toString();
          }

          // Check for unrealistic values
          if (numericValue > 20) {
            warnings.push(`${field} count seems unusually high: ${numericValue}`);
          }
        }
      }
    }

    // Validate erf size and floor size
    const sizeFields = ['erfSize', 'floorSize'];
    for (const field of sizeFields) {
      if (data[field]) {
        const sizeMatch = data[field].toString().match(/(\d+(?:[.,]\d+)*)/);
        if (sizeMatch) {
          const size = parseFloat(sizeMatch[1].replace(/,/g, ''));
          if (size > 10000) { // 10,000 sqm seems like a lot
            warnings.push(`${field} seems unusually large: ${size} sqm`);
          }
        }
      }
    }
  }

  /**
   * Validate agent information
   */
  private static validateAgentInfo(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    // Validate phone number
    if (data.agentPhone) {
      const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
      if (!phoneRegex.test(data.agentPhone.replace(/\s+/g, ''))) {
        warnings.push('Agent phone number format may be invalid');
      }
    }

    // Validate email
    if (data.agentEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.agentEmail)) {
        errors.push('Invalid agent email format');
      }
    }

    // Check for complete agent information
    const agentFields = ['agentName', 'agentPhone', 'agentEmail'];
    const filledAgentFields = agentFields.filter(field => data[field] && data[field].trim() !== '');

    if (filledAgentFields.length === 0) {
      warnings.push('No agent information found');
    } else if (filledAgentFields.length < agentFields.length) {
      warnings.push('Agent information is incomplete');
    }
  }

  /**
   * Validate images
   */
  private static validateImages(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    if (!data.images || !Array.isArray(data.images)) {
      data.images = [];
      return;
    }

    // Filter out invalid URLs
    const validImages = data.images.filter((url: string) => {
      try {
        new URL(url);
        return url.startsWith('http');
      } catch {
        return false;
      }
    });

    if (validImages.length !== data.images.length) {
      warnings.push(`${data.images.length - validImages.length} invalid image URLs were removed`);
    }

    if (autoCorrect) {
      data.images = validImages.slice(0, 20); // Limit to 20 images
    }

    if (data.images.length === 0) {
      warnings.push('No valid property images found');
    }
  }

  /**
   * Validate features
   */
  private static validateFeatures(
    data: any,
    errors: string[],
    warnings: string[],
    autoCorrect: boolean
  ): void {
    if (!data.features || !Array.isArray(data.features)) {
      data.features = [];
      return;
    }

    // Remove duplicates and empty strings
    if (autoCorrect) {
      data.features = [...new Set(data.features
        .filter((feature: string) => feature && feature.trim() !== '')
        .map((feature: string) => feature.trim())
      )];
    }

    // Check for suspicious features
    const suspiciousFeatures = ['test', 'dummy', 'sample'];
    const hasSuspiciousFeatures = data.features.some((feature: string) =>
      suspiciousFeatures.some(suspicious =>
        feature.toLowerCase().includes(suspicious)
      )
    );

    if (hasSuspiciousFeatures) {
      warnings.push('Some features appear to be test data');
    }
  }

  /**
   * Check if data is complete enough for use
   */
  private static isDataComplete(data: any): boolean {
    const essentialFields = ['title', 'price', 'address', 'bedrooms', 'bathrooms'];
    return essentialFields.every(field => data[field] && data[field].toString().trim() !== '');
  }

  /**
   * Convert validated Property24 data to our database schema
   */
  static convertToDatabaseSchema(validatedData: any): any {
    return {
      title: validatedData.title,
      description: validatedData.description || '',
      bedrooms: parseInt(validatedData.bedrooms) || 0,
      bathrooms: parseInt(validatedData.bathrooms) || 0,
      garages: parseInt(validatedData.garages) || 0,
      squareFootage: parseInt(validatedData.floorSize) || parseInt(validatedData.erfSize) || 0,
      erfSize: validatedData.erfSize || '',
      floorSize: validatedData.floorSize || '',
      propertyType: validatedData.propertyType || 'Residential',
      price: this.extractNumericPrice(validatedData.price),
      priceRange: this.calculatePriceRange(validatedData.price),
      location: {
        address: validatedData.address,
        suburb: validatedData.suburb || '',
        city: validatedData.city || '',
        province: validatedData.province || ''
      },
      amenities: validatedData.features || [],
      features: validatedData.features || [],
      images: (validatedData.images || []).map((url: string, index: number) => ({
        url,
        order: index
      })),
      agentInfo: {
        name: validatedData.agentName || '',
        phone: validatedData.agentPhone || '',
        email: validatedData.agentEmail || '',
        agencyName: validatedData.agencyName || ''
      },
      property24Data: {
        propertyId: validatedData.propertyId,
        originalUrl: validatedData.originalUrl || '',
        listingDate: validatedData.listingDate || '',
        importedAt: new Date()
      },
      targetMarket: this.determineTargetMarket(validatedData),
      neighborhoodHighlights: `${validatedData.suburb || ''} ${validatedData.city || ''}`.trim(),
      uniqueSellingPoints: (validatedData.features || []).slice(0, 3).join(', '),
      status: 'imported',
      importStatus: 'completed'
    };
  }

  /**
   * Extract numeric price for database storage
   */
  private static extractNumericPrice(priceString: string): number {
    if (!priceString) return 0;
    const match = priceString.toString().match(/(\d+(?:[.,]\d+)*)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  /**
   * Calculate price range for marketing
   */
  private static calculatePriceRange(priceString: string): string {
    const numericPrice = this.extractNumericPrice(priceString);

    if (numericPrice >= 5000000) return 'Luxury';
    if (numericPrice >= 2000000) return 'Premium';
    if (numericPrice >= 1000000) return 'Mid-Range';
    if (numericPrice >= 500000) return 'Affordable';
    return 'Budget';
  }

  /**
   * Determine target market based on property data
   */
  private static determineTargetMarket(data: any): string {
    const bedroomCount = parseInt(data.bedrooms) || 0;

    if (bedroomCount >= 4) return 'Families';
    if (bedroomCount >= 3) return 'Growing Families';
    if (bedroomCount >= 2) return 'Couples & Young Families';
    return 'First-Time Buyers';
  }
}