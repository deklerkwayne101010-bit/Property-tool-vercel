import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { propertyScraper } from '@/lib/web-scraper';

async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

// POST /api/scrape - Scrape property data from URL
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits to use web scraping.' },
        { status: 402 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape the property data
    const result = await propertyScraper.scrapeProperty(url);

    if (result.success && result.data) {
      // Deduct credit for successful scrape
      user.credits -= 1;
      await user.save();

      return NextResponse.json({
        success: true,
        data: result.data,
        creditsRemaining: user.credits
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to scrape property data'
      }, { status: 422 });
    }

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/scrape/batch - Scrape multiple properties
export async function PATCH(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    if (urls.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 URLs allowed per batch' },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    const creditsNeeded = urls.length;
    if (user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: `Insufficient credits. You need ${creditsNeeded} credits but only have ${user.credits}.` },
        { status: 402 }
      );
    }

    // Scrape all properties
    const results = await propertyScraper.scrapeMultipleProperties(urls);

    // Count successful scrapes
    const successfulScrapes = results.filter(r => r.success).length;

    // Deduct credits for successful scrapes only
    if (successfulScrapes > 0) {
      user.credits -= successfulScrapes;
      await user.save();
    }

    return NextResponse.json({
      results,
      summary: {
        total: urls.length,
        successful: successfulScrapes,
        failed: urls.length - successfulScrapes,
        creditsUsed: successfulScrapes,
        creditsRemaining: user.credits
      }
    });

  } catch (error) {
    console.error('Batch scraping error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}