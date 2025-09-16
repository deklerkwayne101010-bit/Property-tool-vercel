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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };

    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, profile, settings } = await request.json();

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Update user fields
    user.name = name.trim();

    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile
      };
    }

    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    user.updatedAt = new Date();
    await user.save();

    // Return updated user data (excluding password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
      subscription: user.subscription,
      profile: user.profile,
      settings: user.settings,
      usage: user.usage,
      isEmailVerified: user.isEmailVerified
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return user profile data
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
      subscription: user.subscription,
      profile: user.profile,
      settings: user.settings,
      usage: user.usage,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}