import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import Template from '@/models/Template';
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

    const channel = searchParams.get('channel');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    await dbConnect();

    // Build query
    const query: any = { agentId: user.userId };

    if (channel) query.channel = channel;
    if (category) query.category = category;
    if (isActive !== null) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const templates = await Template.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Templates fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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
    const templateData = await request.json();

    // Validate required fields
    if (!templateData.name || !templateData.content || !templateData.channel) {
      return NextResponse.json(
        { error: 'Name, content, and channel are required' },
        { status: 400 }
      );
    }

    // Validate channel
    if (!['email', 'sms', 'whatsapp'].includes(templateData.channel)) {
      return NextResponse.json(
        { error: 'Invalid channel. Must be email, sms, or whatsapp' },
        { status: 400 }
      );
    }

    // Validate email subject
    if (templateData.channel === 'email' && !templateData.subject) {
      return NextResponse.json(
        { error: 'Email subject is required for email templates' },
        { status: 400 }
      );
    }

    await dbConnect();

    // If setting as default, unset other defaults for this category/channel
    if (templateData.isDefault) {
      await Template.updateMany(
        {
          agentId: user.userId,
          channel: templateData.channel,
          category: templateData.category,
          isDefault: true
        },
        { isDefault: false }
      );
    }

    // Create template
    const template = await Template.create({
      ...templateData,
      agentId: user.userId
    });

    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}