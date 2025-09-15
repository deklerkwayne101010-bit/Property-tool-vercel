import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProperty {
  title: string;
  price: string;
  description: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  erfSize: string;
  floorSize: string;
  features: string[];
  images: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  listingUrl: string;
  source: string;
}

export interface ScrapingResult {
  success: boolean;
  data?: ScrapedProperty;
  error?: string;
}

export class PropertyWebScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  /**
   * Scrape property data from a given URL
   */
  async scrapeProperty(url: string): Promise<ScrapingResult> {
    try {
      // Validate URL
      if (!this.isValidPropertyUrl(url)) {
        return {
          success: false,
          error: 'Invalid or unsupported property listing URL'
        };
      }

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);
      const source = this.detectSource(url);

      let scrapedData: ScrapedProperty;

      switch (source) {
        case 'property24':
          scrapedData = this.scrapeProperty24($, url);
          break;
        case 'privateproperty':
          scrapedData = this.scrapePrivateProperty($, url);
          break;
        case 'gumtree':
          scrapedData = this.scrapeGumtree($, url);
          break;
        default:
          scrapedData = this.scrapeGeneric($, url);
      }

      return {
        success: true,
        data: scrapedData
      };

    } catch (error) {
      console.error('Scraping error:', error);
      return {
        success: false,
        error: 'Failed to scrape property data. Please check the URL and try again.'
      };
    }
  }

  /**
   * Validate if URL is a supported property listing
   */
  private isValidPropertyUrl(url: string): boolean {
    const supportedDomains = [
      'property24.com',
      'privateproperty.co.za',
      'gumtree.co.za',
      'property.co.za',
      'seeff.com',
      'remax.co.za',
      'pamgolding.co.za'
    ];

    try {
      const urlObj = new URL(url);
      return supportedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  /**
   * Detect the source website
   */
  private detectSource(url: string): string {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname.includes('property24')) return 'property24';
    if (hostname.includes('privateproperty')) return 'privateproperty';
    if (hostname.includes('gumtree')) return 'gumtree';
    if (hostname.includes('property.co.za')) return 'property';
    if (hostname.includes('seeff')) return 'seeff';
    if (hostname.includes('remax')) return 'remax';
    if (hostname.includes('pamgolding')) return 'pamgolding';

    return 'generic';
  }

  /**
   * Scrape Property24 listings
   */
  private scrapeProperty24($: cheerio.CheerioAPI, url: string): ScrapedProperty {
    return {
      title: this.extractText($, '[data-cy="listing-title"], .listing-title, h1') || 'Property Title',
      price: this.extractText($, '[data-cy="listing-price"], .listing-price, .price') || 'Price on request',
      description: this.extractText($, '[data-cy="listing-description"], .listing-description, .description') || '',
      location: this.extractText($, '[data-cy="listing-address"], .listing-address, .address') || '',
      bedrooms: this.extractText($, '[data-cy="listing-bedrooms"], .bedrooms') || '',
      bathrooms: this.extractText($, '[data-cy="listing-bathrooms"], .bathrooms') || '',
      garages: this.extractText($, '[data-cy="listing-garages"], .garages') || '',
      erfSize: this.extractText($, '[data-cy="listing-erf-size"], .erf-size') || '',
      floorSize: this.extractText($, '[data-cy="listing-floor-size"], .floor-size') || '',
      features: this.extractFeatures($, '[data-cy="listing-features"] li, .features li, .amenities li'),
      images: this.extractImages($, '[data-cy="listing-gallery"] img, .gallery img, .property-images img'),
      agentName: this.extractText($, '[data-cy="agent-name"], .agent-name, .contact-name') || '',
      agentPhone: this.extractText($, '[data-cy="agent-phone"], .agent-phone, .contact-phone') || '',
      agentEmail: this.extractText($, '[data-cy="agent-email"], .agent-email, .contact-email') || '',
      listingUrl: url,
      source: 'Property24'
    };
  }

  /**
   * Scrape Private Property listings
   */
  private scrapePrivateProperty($: cheerio.CheerioAPI, url: string): ScrapedProperty {
    return {
      title: this.extractText($, '.property-title, h1, .listing-title') || 'Property Title',
      price: this.extractText($, '.property-price, .price, .listing-price') || 'Price on request',
      description: this.extractText($, '.property-description, .description, .listing-description') || '',
      location: this.extractText($, '.property-address, .address, .location') || '',
      bedrooms: this.extractText($, '.bedrooms, .beds') || '',
      bathrooms: this.extractText($, '.bathrooms, .baths') || '',
      garages: this.extractText($, '.garages, .parking') || '',
      erfSize: this.extractText($, '.erf-size, .plot-size') || '',
      floorSize: this.extractText($, '.floor-size, .building-size') || '',
      features: this.extractFeatures($, '.features li, .amenities li, .property-features li'),
      images: this.extractImages($, '.property-gallery img, .gallery img, .images img'),
      agentName: this.extractText($, '.agent-name, .contact-name, .agent-details h3') || '',
      agentPhone: this.extractText($, '.agent-phone, .contact-phone, .phone') || '',
      agentEmail: this.extractText($, '.agent-email, .contact-email, .email') || '',
      listingUrl: url,
      source: 'Private Property'
    };
  }

  /**
   * Scrape Gumtree listings
   */
  private scrapeGumtree($: cheerio.CheerioAPI, url: string): ScrapedProperty {
    return {
      title: this.extractText($, '.listing-title, h1, .ad-title') || 'Property Title',
      price: this.extractText($, '.listing-price, .price, .ad-price') || 'Price on request',
      description: this.extractText($, '.listing-description, .description, .ad-description') || '',
      location: this.extractText($, '.listing-location, .location, .ad-location') || '',
      bedrooms: this.extractText($, '.bedrooms, .beds') || '',
      bathrooms: this.extractText($, '.bathrooms, .baths') || '',
      garages: this.extractText($, '.garages, .parking') || '',
      erfSize: this.extractText($, '.erf-size, .plot-size') || '',
      floorSize: this.extractText($, '.floor-size, .building-size') || '',
      features: this.extractFeatures($, '.features li, .amenities li'),
      images: this.extractImages($, '.gallery img, .images img, .ad-images img'),
      agentName: this.extractText($, '.seller-name, .contact-name') || '',
      agentPhone: this.extractText($, '.seller-phone, .contact-phone') || '',
      agentEmail: this.extractText($, '.seller-email, .contact-email') || '',
      listingUrl: url,
      source: 'Gumtree'
    };
  }

  /**
   * Generic scraper for unsupported sites
   */
  private scrapeGeneric($: cheerio.CheerioAPI, url: string): ScrapedProperty {
    return {
      title: this.extractText($, 'h1, .title, .property-title') || 'Property Title',
      price: this.extractText($, '.price, .property-price, .cost') || 'Price on request',
      description: this.extractText($, '.description, .property-description, .details') || '',
      location: this.extractText($, '.location, .address, .property-location') || '',
      bedrooms: this.extractText($, '.bedrooms, .beds') || '',
      bathrooms: this.extractText($, '.bathrooms, .baths') || '',
      garages: this.extractText($, '.garages, .parking') || '',
      erfSize: this.extractText($, '.erf-size, .plot-size') || '',
      floorSize: this.extractText($, '.floor-size, .building-size') || '',
      features: this.extractFeatures($, '.features li, .amenities li'),
      images: this.extractImages($, '.gallery img, .images img'),
      agentName: this.extractText($, '.agent-name, .contact-name') || '',
      agentPhone: this.extractText($, '.agent-phone, .contact-phone') || '',
      agentEmail: this.extractText($, '.agent-email, .contact-email') || '',
      listingUrl: url,
      source: 'Generic'
    };
  }

  /**
   * Extract text content from selectors
   */
  private extractText($: cheerio.CheerioAPI, selectors: string): string {
    for (const selector of selectors.split(',')) {
      const element = $(selector.trim()).first();
      if (element.length > 0) {
        return element.text().trim();
      }
    }
    return '';
  }

  /**
   * Extract features/amenities list
   */
  private extractFeatures($: cheerio.CheerioAPI, selector: string): string[] {
    const features: string[] = [];
    $(selector).each((_, element) => {
      const feature = $(element).text().trim();
      if (feature) {
        features.push(feature);
      }
    });
    return features;
  }

  /**
   * Extract image URLs
   */
  private extractImages($: cheerio.CheerioAPI, selector: string): string[] {
    const images: string[] = [];
    $(selector).each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src && !src.includes('placeholder') && !src.includes('loading')) {
        // Convert relative URLs to absolute
        if (src.startsWith('/')) {
          // This would need the base URL, but we'll handle it in the component
          images.push(src);
        } else if (src.startsWith('http')) {
          images.push(src);
        }
      }
    });
    return images.slice(0, 10); // Limit to 10 images
  }

  /**
   * Batch scrape multiple URLs
   */
  async scrapeMultipleProperties(urls: string[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];

    for (const url of urls) {
      const result = await this.scrapeProperty(url);
      results.push(result);

      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

// Export singleton instance
export const propertyScraper = new PropertyWebScraper();