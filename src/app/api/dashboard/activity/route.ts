import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

// GET /api/dashboard/activity - Get recent user activity
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For demo purposes, we'll generate some mock activity
    // In a real app, you'd track this in the database
    const activities = [
      {
        id: '1',
        type: 'scrape',
        description: 'Scraped property data from Property24',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString() // 2 hours ago
      },
      {
        id: '2',
        type: 'template',
        description: 'Created new property flyer template',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString() // 4 hours ago
      },
      {
        id: '3',
        type: 'generation',
        description: 'Generated AI property description',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString() // 6 hours ago
      },
      {
        id: '4',
        type: 'scrape',
        description: 'Batch scraped 3 properties from Private Property',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString() // 1 day ago
      },
      {
        id: '5',
        type: 'template',
        description: 'Updated residential brochure template',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString() // 2 days ago
      }
    ];

    return NextResponse.json({
      activities
    });

  } catch (error) {
    console.error('Dashboard activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}