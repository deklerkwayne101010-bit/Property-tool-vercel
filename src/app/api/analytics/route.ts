import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { AnalyticsService } from '@/lib/analytics-service';
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

    const type = searchParams.get('type') || 'dashboard'; // dashboard, sequences, channels, templates
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sequenceId = searchParams.get('sequenceId');

    await dbConnect();

    // Build period object
    const period = startDate && endDate ? {
      start: new Date(startDate),
      end: new Date(endDate)
    } : undefined;

    let result;

    switch (type) {
      case 'dashboard':
        result = await AnalyticsService.getDashboardMetrics(user.userId, period);
        break;

      case 'sequences':
        if (sequenceId) {
          result = await AnalyticsService.getSequenceAnalytics(sequenceId, period);
        } else {
          result = await AnalyticsService.getAllSequencesAnalytics(user.userId, period);
        }
        break;

      case 'channels':
        result = await AnalyticsService.getChannelAnalytics(user.userId, period);
        break;

      case 'templates':
        result = await AnalyticsService.getTemplateAnalytics(user.userId, period);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      period: period ? {
        start: period.start.toISOString(),
        end: period.end.toISOString()
      } : null
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}