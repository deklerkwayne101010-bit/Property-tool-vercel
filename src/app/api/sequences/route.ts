import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import Sequence from '@/models/Sequence';
import { AutomationEngine } from '@/lib/automation-engine';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { searchParams } = new URL(request.url);

    const isActive = searchParams.get('isActive');
    const trigger = searchParams.get('trigger');

    await dbConnect();

    // Build query
    const query: any = { agentId: user.userId };

    if (isActive !== null) query.isActive = isActive === 'true';
    if (trigger) query['trigger.type'] = trigger;

    const sequences = await Sequence.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      sequences
    });

  } catch (error) {
    console.error('Sequences fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sequences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const sequenceData = await request.json();

    // Validate required fields
    if (!sequenceData.name || !sequenceData.steps || sequenceData.steps.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one step are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create sequence
    const sequence = await Sequence.create({
      ...sequenceData,
      agentId: user.userId
    });

    return NextResponse.json({
      success: true,
      sequence
    });

  } catch (error) {
    console.error('Sequence creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create sequence' },
      { status: 500 }
    );
  }
}