import { NextRequest, NextResponse } from 'next/server';
import { Property24Scraper } from '@/lib/property24-scraper';
import { Property24DataValidator } from '@/lib/property24-validation';
import Property from '@/models/Property';
import dbConnect from '@/lib/mongodb';
import { authenticateToken } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { url, saveToDatabase = false } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Property24 URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!Property24Scraper.isValidProperty24Url(url)) {
      return NextResponse.json(
        { error: 'Invalid Property24 URL format. Please provide a valid Property24 property URL.' },
        { status: 400 }
      );
    }

    // Extract property ID for validation
    const propertyId = Property24Scraper.extractPropertyId(url);
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Could not extract property ID from URL. Please check the URL format.' },
        { status: 400 }
      );
    }

    console.log('Scraping Property24 property:', propertyId);

    // Scrape property data
    const property24Data = await Property24Scraper.scrapeProperty(url);

    // Validate and sanitize the scraped data
    const validationResult = Property24DataValidator.validatePropertyData(property24Data, {
      strictMode: false,
      allowPartialData: true,
      autoCorrect: true
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: 'Property data validation failed',
          details: validationResult.errors,
          warnings: validationResult.warnings
        },
        { status: 422 }
      );
    }

    // Use validated data
    const validatedData = validationResult.sanitizedData;

    // Convert to template format
    const templateData = Property24Scraper.convertToTemplateData(validatedData);

    // If saveToDatabase is true, save the property
    let savedProperty = null;
    if (saveToDatabase) {
      await dbConnect();

      // Check if property already exists
      const existingProperty = await Property.findOne({
        'property24Data.propertyId': propertyId,
        agentId: user.userId
      });

      if (existingProperty) {
        return NextResponse.json(
          { error: 'Property already imported', property: existingProperty },
          { status: 409 }
        );
      }

      // Convert validated data to database schema
      const propertyData = {
        ...Property24DataValidator.convertToDatabaseSchema({
          ...validatedData,
          originalUrl: url
        }),
        agentId: user.userId
      };

      savedProperty = await Property.create(propertyData);
    }

    return NextResponse.json({
      success: true,
      data: templateData,
      property24Data: validatedData,
      propertyId,
      savedProperty,
      validation: {
        warnings: validationResult.warnings,
        hasWarnings: validationResult.warnings.length > 0
      },
      message: saveToDatabase
        ? 'Property scraped and saved successfully'
        : 'Property data scraped successfully'
    });

  } catch (error) {
    console.error('Property24 scraping error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('CORS') || error.message.includes('Cross-origin')) {
        return NextResponse.json(
          { error: 'Unable to access Property24 due to CORS restrictions. Please try again later.' },
          { status: 503 }
        );
      }

      if (error.message.includes('Failed to fetch') || error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Unable to connect to Property24. Please check your internet connection and try again.' },
          { status: 503 }
        );
      }

      if (error.message.includes('parse') || error.message.includes('invalid response')) {
        return NextResponse.json(
          { error: 'Unable to parse property data. The property may not exist or the page format has changed.' },
          { status: 422 }
        );
      }

      if (error.message.includes('Invalid Property24 URL')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to scrape property data. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint for URL validation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  const isValid = Property24Scraper.isValidProperty24Url(url);
  const propertyId = Property24Scraper.extractPropertyId(url);

  return NextResponse.json({
    isValid,
    propertyId,
    url
  });
}