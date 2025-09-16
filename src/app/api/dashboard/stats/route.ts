import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Template from '@/models/Template';

async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };

    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's template count
    const totalTemplates = await Template.countDocuments({ userId: user._id });

    // Calculate credits used (assuming 5 credits per user initially)
    const initialCredits = 5;
    const creditsUsed = initialCredits - user.credits;
    const creditsRemaining = user.credits;

    // For demo purposes, we'll simulate some stats
    // In a real app, you'd track these in the database
    const totalScrapes = Math.floor(Math.random() * 50) + 10; // Simulated scrapes

    return NextResponse.json({
      totalTemplates,
      totalScrapes,
      creditsUsed: Math.max(0, creditsUsed),
      creditsRemaining,
      subscription: user.subscription || { plan: 'Free', status: 'active' }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}