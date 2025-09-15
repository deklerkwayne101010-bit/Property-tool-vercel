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

// GET /api/templates - Get user's templates
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isPublic = searchParams.get('public') === 'true';

    let query: any = {};

    if (isPublic) {
      query.isPublic = true;
    } else {
      query.$or = [
        { userId },
        { isPublic: true }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const templates = await Template.find(query)
      .populate('userId', 'name')
      .sort({ updatedAt: -1 })
      .select('-versions'); // Exclude versions for performance

    return NextResponse.json({
      templates: templates.map(template => ({
        id: template._id,
        name: template.name,
        description: template.description,
        category: template.category,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: template.isPublic,
        usageCount: template.usageCount,
        rating: template.rating,
        reviews: template.reviews,
        metadata: template.metadata,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        author: template.userId
      }))
    });

  } catch (error) {
    console.error('Templates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      description,
      category,
      content,
      thumbnail,
      tags,
      isPublic,
      metadata,
      settings
    } = await request.json();

    // Validate required fields
    if (!name || !category || !content?.html) {
      return NextResponse.json(
        { error: 'Name, category, and content are required' },
        { status: 400 }
      );
    }

    const template = new Template({
      userId,
      name: name.trim(),
      description: description?.trim() || '',
      category,
      content,
      thumbnail,
      tags: tags || [],
      isPublic: isPublic || false,
      metadata: metadata || {
        width: 800,
        height: 600,
        orientation: 'landscape',
        format: 'image'
      },
      settings: settings || {
        autoSave: true,
        versionControl: true,
        collaboration: false
      }
    });

    await template.save();

    return NextResponse.json({
      template: {
        id: template._id,
        name: template.name,
        description: template.description,
        category: template.category,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: template.isPublic,
        metadata: template.metadata,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}