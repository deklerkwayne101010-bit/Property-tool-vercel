import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { CommunicationService } from '@/lib/communication-service';
import Communication from '@/models/Communication';
import Template from '@/models/Template';
import dbConnect from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateToken(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const user = authResult.user as { userId: string; email: string; role: string };
    const {
      channel,
      recipient,
      subject,
      content,
      templateId,
      variables = {},
      contactId,
      sequenceId,
      sequenceStepId,
      propertyId,
      campaign
    } = await request.json();

    // Validate required fields
    if (!channel || !recipient || !content) {
      return NextResponse.json(
        { error: 'Channel, recipient, and content are required' },
        { status: 400 }
      );
    }

    // Validate channel
    if (!['email', 'sms', 'whatsapp'].includes(channel)) {
      return NextResponse.json(
        { error: 'Invalid channel. Must be email, sms, or whatsapp' },
        { status: 400 }
      );
    }

    // Validate recipient based on channel
    if (channel === 'email' && !recipient.email) {
      return NextResponse.json(
        { error: 'Email address is required for email communications' },
        { status: 400 }
      );
    }

    if ((channel === 'sms' || channel === 'whatsapp') && !recipient.phone) {
      return NextResponse.json(
        { error: 'Phone number is required for SMS/WhatsApp communications' },
        { status: 400 }
      );
    }

    await dbConnect();

    let finalContent = content;
    let finalSubject = subject;
    let template = null;

    // If templateId is provided, use template
    if (templateId) {
      template = await Template.findOne({
        _id: templateId,
        agentId: user.userId,
        isActive: true
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found or inactive' },
          { status: 404 }
        );
      }

      // Render template with variables
      finalContent = template.render(variables);

      if (channel === 'email' && template.subject) {
        finalSubject = template.renderSubject(variables);
      }
    }

    // Send communication
    let result;
    if (channel === 'email') {
      result = await CommunicationService.sendEmail({
        to: recipient.email,
        subject: finalSubject || 'Property Update',
        html: finalContent,
        templateId: templateId
      });
    } else if (channel === 'sms') {
      result = await CommunicationService.sendSMS({
        to: recipient.phone,
        message: finalContent
      });
    } else if (channel === 'whatsapp') {
      result = await CommunicationService.sendWhatsApp({
        to: recipient.phone,
        message: finalContent
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported communication channel' },
        { status: 400 }
      );
    }

    if (!result || !result.success) {
      return NextResponse.json(
        { error: `Failed to send ${channel}: ${result?.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Save communication record
    const communicationData = {
      agentId: user.userId,
      contactId,
      sequenceId,
      sequenceStepId,
      templateId,
      propertyId,
      channel,
      subject: finalSubject,
      content: finalContent,
      renderedContent: finalContent,
      recipient: {
        email: recipient.email,
        phone: recipient.phone,
        name: recipient.name
      },
      status: 'sent',
      provider: {
        name: result.provider,
        messageId: result.messageId,
        cost: result.cost
      },
      sentAt: new Date(),
      campaign: campaign || {
        source: 'manual'
      }
    };

    const communication = await Communication.create(communicationData);

    // Update template usage stats
    if (template) {
      await Template.findByIdAndUpdate(templateId, {
        $inc: { 'usageStats.totalSent': 1 },
        $set: { 'usageStats.lastUsed': new Date() }
      });
    }

    return NextResponse.json({
      success: true,
      communication: {
        id: communication._id,
        messageId: result.messageId,
        status: 'sent',
        cost: result.cost,
        provider: result.provider
      }
    });

  } catch (error) {
    console.error('Communication sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send communication' },
      { status: 500 }
    );
  }
}

// GET endpoint to check service status
export async function GET() {
  try {
    const status = CommunicationService.getServiceStatus();

    return NextResponse.json({
      success: true,
      services: status
    });
  } catch (error) {
    console.error('Service status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check service status' },
      { status: 500 }
    );
  }
}