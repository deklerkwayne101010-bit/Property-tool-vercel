import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export async function authenticateToken(request: NextRequest): Promise<{ user: any } | { error: NextResponse }> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return {
        error: NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        )
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        error: NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      error: NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      )
    };
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const authResult = await authenticateToken(request);

    if ('error' in authResult) {
      return authResult.error;
    }

    // Add user to request
    (request as AuthenticatedRequest).user = authResult.user;

    return handler(request, ...args);
  };
}