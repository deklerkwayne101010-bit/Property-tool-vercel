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
  // Skip database connection in demo mode
  if (!process.env.MONGODB_URI || MONGODB_URI.includes('localhost') || MONGODB_URI.includes('demo')) {
    console.log('Running in demo mode - skipping database connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;