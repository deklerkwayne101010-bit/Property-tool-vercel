import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, role, agency, phone } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['agent', 'admin', 'user'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with new schema
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      credits: 5, // Free users get 5 credits
      subscription: {
        plan: 'free',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        features: ['Basic descriptions', 'Limited templates'],
        autoRenew: true
      },
      profile: {
        agency: agency || '',
        phone: phone || ''
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
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

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: userData
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}