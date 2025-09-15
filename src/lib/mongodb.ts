import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/demo';

// Only require MongoDB URI in production, allow demo mode
if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Skip database connection in demo mode or when no URI is provided
  if (!process.env.MONGODB_URI ||
      process.env.DEMO_MODE === 'true' ||
      MONGODB_URI.includes('demo') ||
      !MONGODB_URI.trim()) {
    console.log('🟡 Running in demo mode - database operations will be simulated');
    return null;
  }

  // Skip localhost connections in production
  if (process.env.NODE_ENV === 'production' && MONGODB_URI.includes('localhost')) {
    console.log('🟡 Production mode with localhost DB - running in demo mode');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const errorMessage = e instanceof Error ? e.message : 'Unknown database error';
    console.log('❌ MongoDB connection failed, running in demo mode:', errorMessage);
    return null;
  }

  return cached.conn;
}

export default dbConnect;