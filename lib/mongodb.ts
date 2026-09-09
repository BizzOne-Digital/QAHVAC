import mongoose, { Mongoose } from 'mongoose';

/**
 * Cached Mongoose connection.
 *
 * Next.js reloads modules on every edit in development, and a serverless host
 * reuses a warm lambda across invocations. Caching the promise on `globalThis`
 * means one connection per process instead of one per request.
 */

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cache;

export class MissingMongoUriError extends Error {
  constructor() {
    super('MONGODB_URI is not configured. Image storage is unavailable until it is set.');
    this.name = 'MissingMongoUriError';
  }
}

export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new MissingMongoUriError();

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
      })
      .catch(err => {
        // Clear the cache so the next request retries rather than reusing a
        // permanently rejected promise.
        cache.promise = null;
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}
