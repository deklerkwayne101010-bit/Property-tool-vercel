import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { yocoService } from '@/lib/yoco-service';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };

    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}

// GET /api/subscription - Get user's subscription status
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = SUBSCRIPTION_PLANS[user.subscription.plan];

    return NextResponse.json({
      currentPlan: user.subscription,
      planDetails: plan,
      availablePlans: Object.values(SUBSCRIPTION_PLANS),
      daysRemaining: user.subscription.expiresAt
        ? Math.ceil((new Date(user.subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/subscription - Upgrade or change subscription
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const newPlan = SUBSCRIPTION_PLANS[planId];
    if (!newPlan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // If upgrading from free to paid, create payment request
    if (user.subscription.plan === 'free' && newPlan.price > 0) {
      const paymentRequest = await yocoService.createPayment({
        amount: newPlan.price * 100, // Convert to cents
        currency: 'ZAR',
        description: `Upgrade to ${newPlan.name} Plan`,
        metadata: {
          userId: user._id.toString(),
          planId: planId,
          type: 'subscription'
        }
      });

      // Create pending transaction
      const transaction = new Transaction({
        userId: user._id,
        type: 'subscription',
        amount: newPlan.price,
        yocoPaymentId: paymentRequest.id,
        subscriptionPlan: planId,
        description: `Upgrade to ${newPlan.name} Plan`,
        status: 'pending'
      });

      await transaction.save();

      return NextResponse.json({
        paymentUrl: paymentRequest.redirectUrl,
        transactionId: transaction._id
      });
    }

    // For plan changes within paid tiers or downgrades, update immediately
    const currentPlan = SUBSCRIPTION_PLANS[user.subscription.plan];
    const isUpgrade = newPlan.price > currentPlan.price;

    if (isUpgrade) {
      // Handle upgrade logic
      user.subscription.plan = planId;
      user.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      user.subscription.features = newPlan.features;
      user.credits += newPlan.credits; // Add credits from new plan
    } else {
      // Handle downgrade - schedule for end of current period
      user.subscription.plan = planId;
      user.subscription.features = newPlan.features;
      // Keep current expiration date
    }

    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'subscription',
      amount: newPlan.price,
      subscriptionPlan: planId,
      description: `${isUpgrade ? 'Upgrade' : 'Change'} to ${newPlan.name} Plan`,
      status: 'completed'
    });

    await transaction.save();

    return NextResponse.json({
      message: `Successfully ${isUpgrade ? 'upgraded' : 'changed'} to ${newPlan.name} plan`,
      subscription: user.subscription,
      credits: user.credits
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// PUT /api/subscription - Update subscription settings
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { autoRenew } = await request.json();

    user.subscription.autoRenew = autoRenew ?? user.subscription.autoRenew;
    await user.save();

    return NextResponse.json({
      message: 'Subscription settings updated',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Subscription settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription settings' },
      { status: 500 }
    );
  }
}