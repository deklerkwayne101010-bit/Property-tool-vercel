import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { yocoService } from '@/lib/yoco-service';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.text();
    const signature = request.headers.get('x-yoco-signature') || '';

    // Verify webhook signature (implement proper verification in production)
    // For now, we'll process the webhook

    let event;
    try {
      event = JSON.parse(body);
    } catch (error) {
      console.error('Invalid webhook payload:', error);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log('Yoco webhook received:', event.type);

    if (event.type === 'checkout.completed') {
      const paymentId = event.data.id;
      const metadata = event.data.metadata || {};

      // Find the transaction
      const transaction = await Transaction.findOne({ yocoPaymentId: paymentId });
      if (!transaction) {
        console.error('Transaction not found for payment:', paymentId);
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      // Update transaction status
      transaction.status = 'completed';
      transaction.completedAt = new Date();
      await transaction.save();

      // Find the user
      const user = await User.findById(transaction.userId);
      if (!user) {
        console.error('User not found for transaction:', transaction._id);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Process based on transaction type
      if (transaction.type === 'credit_purchase') {
        // Add credits to user account
        user.credits += transaction.creditsGranted || 0;
        await user.save();

        console.log(`Added ${transaction.creditsGranted} credits to user ${user._id}`);

      } else if (transaction.type === 'subscription') {
        // Update subscription
        const planId = metadata.planId || transaction.subscriptionPlan;
        const plan = getSubscriptionPlan(planId);

        if (plan) {
          user.subscription.plan = planId;
          user.subscription.status = 'active';
          user.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          user.subscription.features = plan.features;
          user.subscription.yocoSubscriptionId = paymentId;

          // Add credits from the plan
          user.credits += plan.credits;

          await user.save();

          console.log(`Updated subscription for user ${user._id} to ${plan.name}`);
        }
      }

      return NextResponse.json({ status: 'success' });
    }

    // Handle other webhook events if needed
    return NextResponse.json({ status: 'ignored' });

  } catch (error) {
    console.error('Yoco webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Helper function to get subscription plan details
function getSubscriptionPlan(planId: string) {
  const plans = {
    starter: {
      name: 'Starter',
      credits: 100,
      features: ['AI descriptions', 'Template access', 'Email support', 'Advanced AI features']
    },
    professional: {
      name: 'Professional',
      credits: 500,
      features: ['Advanced AI', 'Unlimited templates', 'Priority support', 'Property24 integration']
    },
    enterprise: {
      name: 'Enterprise',
      credits: 2000,
      features: ['Unlimited AI', 'White-label templates', 'API access', 'Dedicated support']
    }
  };

  return plans[planId as keyof typeof plans] || null;
}