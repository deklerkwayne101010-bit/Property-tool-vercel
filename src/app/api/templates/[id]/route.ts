import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import Template from '@/models/Template';
import dbConnect from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { id } = params;

    await dbConnect();

    const template = await Template.findOne({
      _id: id,
      agentId: user.userId
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { id } = params;
    const updateData = await request.json();

    await dbConnect();

    // Check if template exists and belongs to user
    const existingTemplate = await Template.findOne({
      _id: id,
      agentId: user.userId
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults for this category/channel
    if (updateData.isDefault) {
      await Template.updateMany(
        {
          agentId: user.userId,
          channel: updateData.channel || existingTemplate.channel,
          category: updateData.category || existingTemplate.category,
          isDefault: true,
          _id: { $ne: id }
        },
        { isDefault: false }
      );
    }

    // Update template
    const template = await Template.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template update error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { id } = params;

    await dbConnect();

    // Check if template exists and belongs to user
    const template = await Template.findOne({
      _id: id,
      agentId: user.userId
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete template
    await Template.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
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