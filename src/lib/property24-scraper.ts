// Property24 Web Scraper and Data Extractor for Netlify
// Uses CORS proxy for serverless compatibility

import * as cheerio from 'cheerio';

export interface Property24Data {
  // Basic Property Info
  title: string;
  price: string;
  address: string;
  description: string;

  // Property Details
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  propertyType: string;

  // Agent Info
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agencyName: string;

  // Additional Details
  features: string[];
  images: string[];
  listingDate: string;
  propertyId: string;

  // Location Data
  suburb: string;
  city: string;
  province: string;
}

export class Property24Scraper {
  private static readonly BASE_URL = 'https://www.property24.com';
  private static readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';

  /**
   * Extract property ID from Property24 URL
   */
  static extractPropertyId(url: string): string | null {
    try {
      // Handle various Property24 URL formats
      const patterns = [
        /property24\.com\/[^\/]+\/[^\/]+\/[^\/]+\/(\d+)/i,
        /property24\.com\/[^\/]+\/(\d+)/i,
        /property24\.com\/.*\/(\d+)$/i,
        /(\d{8,})/  // Fallback: look for 8+ digit numbers
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting Property24 ID:', error);
      return null;
    }
  }

  /**
   * Validate Property24 URL format
   */
  static isValidProperty24Url(url: string): boolean {
    const property24Regex = /^https?:\/\/(www\.)?property24\.com/i;
    return property24Regex.test(url);
  }

  /**
   * Scrape property data from Property24 using CORS proxy
   */
  static async scrapeProperty(url: string): Promise<Property24Data> {
    try {
      if (!this.isValidProperty24Url(url)) {
        throw new Error('Invalid Property24 URL format');
      }

      const propertyId = this.extractPropertyId(url);
      if (!propertyId) {
        throw new Error('Could not extract property ID from URL');
      }

      console.log('Scraping Property24 property:', propertyId);

      // Use CORS proxy for Netlify compatibility
      const proxyUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch property data: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      if (!html || html.length < 100) {
        throw new Error('Received empty or invalid response from Property24');
      }

      return this.parsePropertyData(html, propertyId);

    } catch (error) {
      console.error('Error scraping Property24:', error);

      if (error instanceof Error) {
        // Provide more specific error messages
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to Property24. Please check your internet connection and try again.');
        }
        if (error.message.includes('CORS')) {
          throw new Error('Cross-origin request blocked. Please try again later.');
        }
      }

      throw new Error(`Failed to scrape property data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse HTML and extract property data
   */
  private static parsePropertyData(html: string, propertyId: string): Property24Data {
    try {
      // Use cheerio for server-side HTML parsing instead of DOMParser
      const $ = cheerio.load(html);
      const doc = $;

      // Extract basic information with multiple fallback selectors
      const title = this.extractText(doc, [
        'h1.p24_propertyTitle',
        '.property-title h1',
        '.listing-title',
        'h1',
        'title'
      ]);

      const price = this.extractText(doc, [
        '.p24_price',
        '.property-price',
        '.listing-price',
        '[data-cy="price"]',
        '.price'
      ]);

      const address = this.extractText(doc, [
        '.p24_address',
        '.property-address',
        '.listing-address',
        '[data-cy="address"]',
        '.address'
      ]);

      const description = this.extractText(doc, [
        '.p24_description',
        '.property-description',
        '.listing-description',
        '[data-cy="description"]',
        '.description'
      ]);

      // Extract property details
      const bedrooms = this.extractPropertyDetail(doc, 'bedroom');
      const bathrooms = this.extractPropertyDetail(doc, 'bathroom');
      const garages = this.extractPropertyDetail(doc, 'garage');
      const erfSize = this.extractPropertyDetail(doc, 'erf.*size');
      const floorSize = this.extractPropertyDetail(doc, 'floor.*size');

      // Extract property type
      const propertyType = this.extractText(doc, [
        '.p24_propertyType',
        '.property-type',
        '[data-cy="property-type"]'
      ]);

      // Extract agent information
      const agentName = this.extractText(doc, [
        '.p24_agentName',
        '.agent-name',
        '[data-cy="agent-name"]',
        '.agent-name'
      ]);

      const agentPhone = this.extractText(doc, [
        '.p24_agentPhone',
        '.agent-phone',
        '[data-cy="agent-phone"]',
        '.agent-phone'
      ]);

      const agentEmail = this.extractText(doc, [
        '.p24_agentEmail',
        '.agent-email',
        '[data-cy="agent-email"]',
        '.agent-email'
      ]);

      const agencyName = this.extractText(doc, [
        '.p24_agencyName',
        '.agency-name',
        '[data-cy="agency-name"]',
        '.agency-name'
      ]);

      // Extract features
      const features = this.extractFeatures(doc);

      // Extract images
      const images = this.extractImages(doc);

      // Extract location data
      const suburb = this.extractText(doc, [
        '.p24_suburb',
        '.suburb',
        '[data-cy="suburb"]'
      ]);

      const city = this.extractText(doc, [
        '.p24_city',
        '.city',
        '[data-cy="city"]'
      ]);

      const province = this.extractText(doc, [
        '.p24_province',
        '.province',
        '[data-cy="province"]'
      ]);

      // Extract listing date
      const listingDate = this.extractText(doc, [
        '.p24_listingDate',
        '.listing-date',
        '[data-cy="listing-date"]'
      ]);

      return {
        title: title || 'Property Title',
        price: this.cleanPrice(price),
        address: address || 'Property Address',
        description: description || 'Property description',
        bedrooms: bedrooms || '0',
        bathrooms: bathrooms || '0',
        garages: garages || '0',
        erfSize: erfSize || '',
        floorSize: floorSize || '',
        propertyType: propertyType || 'Residential',
        agentName: agentName || 'Agent Name',
        agentPhone: this.cleanPhone(agentPhone),
        agentEmail: agentEmail || '',
        agencyName: agencyName || 'Real Estate Agency',
        features,
        images,
        suburb: suburb || '',
        city: city || '',
        province: province || '',
        listingDate: listingDate || '',
        propertyId
      };

    } catch (error) {
      console.error('Error parsing property data:', error);
      throw new Error('Failed to parse property data from HTML');
    }
  }

  /**
   * Extract text content using multiple selectors
   */
  private static extractText(doc: any, selectors: string[]): string {
    for (const selector of selectors) {
      try {
        const element = doc(selector).first();
        if (element && element.text()) {
          return element.text().trim();
        }
      } catch (e) {
        // Skip invalid selectors
        continue;
      }
    }
    return '';
  }

  /**
   * Extract property detail by keyword
   */
  private static extractPropertyDetail(doc: any, keyword: string): string {
    // Look for elements containing the keyword
    const elements = doc('*');
    const regex = new RegExp(keyword, 'i');

    for (const element of elements) {
      const text = doc(element).text();
      if (text && regex.test(text)) {
        // Extract number from the text
        const numberMatch = text.match(/(\d+)/);
        if (numberMatch) {
          return numberMatch[1];
        }
      }
    }

    return '';
  }

  /**
   * Extract property features
   */
  private static extractFeatures(doc: any): string[] {
    const features: string[] = [];

    // Common feature selectors
    const featureSelectors = [
      '.p24_features li',
      '.property-features li',
      '.features li',
      '[data-cy="feature"]',
      '.amenities li'
    ];

    for (const selector of featureSelectors) {
      try {
        const elements = doc(selector);
        elements.each((index: number, element: any) => {
          const text = doc(element).text();
          if (text) {
            features.push(text.trim());
          }
        });
      } catch {
        // Skip invalid selectors
        continue;
      }
    }

    return features;
  }

  /**
   * Extract property images
   */
  private static extractImages(doc: any): string[] {
    const images: string[] = [];

    // Common image selectors
    const imageSelectors = [
      '.p24_gallery img',
      '.property-gallery img',
      '.gallery img',
      '[data-cy="property-image"]',
      '.property-images img'
    ];

    for (const selector of imageSelectors) {
      try {
        const elements = doc(selector);
        elements.each((index: number, element: any) => {
          const src = doc(element).attr('src');
          if (src && src.startsWith('http')) {
            images.push(src);
          }
        });
      } catch {
        // Skip invalid selectors
        continue;
      }
    }

    return images.slice(0, 10); // Limit to first 10 images
  }

  /**
   * Clean and format price
   */
  private static cleanPrice(price: string): string {
    if (!price) return '';

    // Remove currency symbols and extra text
    const cleaned = price.replace(/[^\d\s.,]/g, '').trim();

    // Try to extract numeric value
    const match = cleaned.match(/(\d+(?:[.,]\d+)*)/);
    if (match) {
      return `R ${match[1].replace(/,/g, ' ')}`;
    }

    return price;
  }

  /**
   * Clean and format phone number
   */
  private static cleanPhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-numeric characters except spaces and +
    const cleaned = phone.replace(/[^\d\s+]/g, '').trim();

    return cleaned;
  }

  /**
   * Convert Property24 data to our template format
   */
  static convertToTemplateData(property24Data: Property24Data): any {
    return {
      price: property24Data.price,
      address: property24Data.address,
      bedrooms: property24Data.bedrooms,
      bathrooms: property24Data.bathrooms,
      garages: property24Data.garages,
      features: property24Data.features.join(', '),
      agentName: property24Data.agentName,
      agentPhone: property24Data.agentPhone,
      agentEmail: property24Data.agentEmail,
      description: property24Data.description,
      propertyType: property24Data.propertyType,
      priceRange: this.calculatePriceRange(property24Data.price),
      neighborhoodHighlights: `${property24Data.suburb}, ${property24Data.city}`,
      targetMarket: this.determineTargetMarket(property24Data),
      uniqueSellingPoints: property24Data.features.slice(0, 3).join(', '),
      erfSize: property24Data.erfSize,
      floorSize: property24Data.floorSize,
      suburb: property24Data.suburb,
      city: property24Data.city,
      province: property24Data.province,
      listingDate: property24Data.listingDate,
      propertyId: property24Data.propertyId,
      images: property24Data.images
    };
  }

  /**
   * Calculate price range for marketing
   */
  private static calculatePriceRange(price: string): string {
    const numericPrice = parseInt(price.replace(/[^\d]/g, ''));

    if (numericPrice >= 5000000) return 'Luxury';
    if (numericPrice >= 2000000) return 'Premium';
    if (numericPrice >= 1000000) return 'Mid-Range';
    if (numericPrice >= 500000) return 'Affordable';
    return 'Budget';
  }

  /**
   * Determine target market based on property data
   */
  private static determineTargetMarket(data: Property24Data): string {
    const bedroomCount = parseInt(data.bedrooms) || 0;

    if (bedroomCount >= 4) return 'Families';
    if (bedroomCount >= 3) return 'Growing Families';
    if (bedroomCount >= 2) return 'Couples & Young Families';
    return 'First-Time Buyers';
  }
}