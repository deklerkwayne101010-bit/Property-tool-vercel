import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { AutomationEngine } from '@/lib/automation-engine';
import Sequence from '@/models/Sequence';
import Contact from '@/models/Contact';
import dbConnect from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const { sequenceId, contactIds, variables = {} } = await request.json();

    // Validate required fields
    if (!sequenceId || !contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'Sequence ID and contact IDs are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate sequence exists and belongs to user
    const sequence = await Sequence.findOne({
      _id: sequenceId,
      agentId: user.userId,
      isActive: true
    });

    if (!sequence) {
      return NextResponse.json(
        { error: 'Sequence not found or inactive' },
        { status: 404 }
      );
    }

    // Validate contacts exist and belong to user
    const validContacts = await Contact.find({
      _id: { $in: contactIds },
      agentId: user.userId
    }).select('_id name email phone');

    if (validContacts.length === 0) {
      return NextResponse.json(
        { error: 'No valid contacts found' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Start sequence for each contact
    for (const contact of validContacts) {
      try {
        const result = await AutomationEngine.startSequenceForContact(
          sequenceId,
          contact._id.toString(),
          {
            ...variables,
            contact: contact.toObject()
          }
        );

        results.push({
          contactId: contact._id,
          contactName: contact.name,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          nextStep: result.nextStep,
          scheduledAt: result.scheduledAt
        });

      } catch (error) {
        console.error(`Error starting sequence for contact ${contact._id}:`, error);
        errors.push({
          contactId: contact._id,
          contactName: contact.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      sequence: {
        id: sequence._id,
        name: sequence.name
      },
      results,
      errors,
      summary: {
        total: contactIds.length,
        successful: results.filter(r => r.success).length,
        failed: errors.length
      }
    });

  } catch (error) {
    console.error('Sequence start error:', error);
    return NextResponse.json(
      { error: 'Failed to start sequence' },
      { status: 500 }
    );
  }
}

// GET endpoint to process pending automation steps (for cron jobs)
export async function GET() {
  try {
    const result = await AutomationEngine.processPendingSteps();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      message: `Processed ${result.processed} steps with ${result.errors} errors`
    });

  } catch (error) {
    console.error('Automation processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process pending steps' },
      { status: 500 }
    );
  }
}