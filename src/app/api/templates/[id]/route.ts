import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Template from '@/models/Template';

async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    await dbConnect();
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET /api/templates/[id] - Get specific template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await Template.findOne({
      _id: params.id,
      $or: [
        { userId },
        { isPublic: true }
      ]
    }).populate('userId', 'name');

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      template: {
        id: template._id,
        name: template.name,
        description: template.description,
        category: template.category,
        content: template.content,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: template.isPublic,
        usageCount: template.usageCount,
        rating: template.rating,
        reviews: template.reviews,
        metadata: template.metadata,
        settings: template.settings,
        versions: template.versions,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        author: template.userId
      }
    });

  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id] - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();

    const template = await Template.findOneAndUpdate(
      {
        _id: params.id,
        userId // Only allow users to update their own templates
      },
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      template: {
        id: template._id,
        name: template.name,
        description: template.description,
        category: template.category,
        content: template.content,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: template.isPublic,
        metadata: template.metadata,
        settings: template.settings,
        updatedAt: template.updatedAt
      }
    });

  } catch (error) {
    console.error('Template update error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await Template.findOneAndDelete({
      _id: params.id,
      userId // Only allow users to delete their own templates
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Template deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}