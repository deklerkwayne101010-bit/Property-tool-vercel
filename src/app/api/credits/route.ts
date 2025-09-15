import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { yocoService } from '@/lib/yoco-service';
import { CREDIT_PACKAGES } from '@/lib/subscription-plans';

async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/credits - Get user's credit balance and history
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent transactions
    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('type amount creditsGranted status createdAt description');

    return NextResponse.json({
      credits: user.credits,
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        creditsGranted: t.creditsGranted,
        status: t.status,
        createdAt: t.createdAt,
        description: t.description
      }))
    });

  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/credits - Purchase credits
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await request.json();

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    const creditPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Create Yoco payment request
    const paymentRequest = await yocoService.createPayment({
      amount: creditPackage.price * 100, // Convert to cents
      currency: 'ZAR',
      description: `Purchase ${creditPackage.name}`,
      metadata: {
        userId: user._id.toString(),
        packageId: packageId,
        type: 'credit_purchase'
      }
    });

    // Create pending transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'credit_purchase',
      amount: creditPackage.price,
      yocoPaymentId: paymentRequest.id,
      creditsGranted: creditPackage.credits,
      description: `Purchase ${creditPackage.name}`,
      status: 'pending'
    });

    await transaction.save();

    return NextResponse.json({
      paymentUrl: paymentRequest.redirectUrl,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Credit purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process credit purchase' },
      { status: 500 }
    );
  }
}