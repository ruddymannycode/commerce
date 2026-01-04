import mongoose from "mongoose";

/**
 * --- DATABASE CONNECTION CACHING EXPLANATION ---
 * In Next.js, particularly in development mode, every time you save a file, the server 
 * reloads. If we used a standard 'mongoose.connect' call, a NEW connection would be
 * opened every single time the code re-executes.
 * 
 * This would quickly hit the "Max Connections" limit on MongoDB (especially on free tiers).
 * To prevent this, we attach the connection to the 'global' object, which persists 
 * across reloads.
 */

// We pull the URI from environment variables for security. Never hardcode passwords.
const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  // If the variable is missing, we crash early with a helpful message.
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * --- TYPESCRIPT GLOBAL INTERFACE ---
 * By default, the 'global' object in Node.js doesn't know what 'mongoose' is.
 * We use 'declare global' to "teach" TypeScript that 'mongoose' might exist on 
 * the global scope, allowing us to store our connection cache there safely.
 */
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | undefined; // 'undefined' because on first load it won't exist yet
}

/**
 * We check if 'global.mongoose' exists. If it doesn't, we initialize it.
 * This 'cached' variable points to the same memory space as 'global.mongoose'.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * --- connectToDatabase Function ---
 * This is an 'async' function because database operations are non-blocking.
 * It returns the database connection object.
 */
async function connectToDatabase() {
  // If we already have a successful connection, return it immediately (Efficiency: O(1))
  if (cached?.conn) {
    return cached.conn;
  }

  // If there isn't a connection yet AND no one is currently trying to connect...
  if (!cached?.promise) {
    const opts = {
      bufferCommands: false, // Prevents Mongoose from queuing commands if the DB is down
    };

    /**
     * mongoose.connect returns a Promise. 
     * We store this promise in 'cached.promise' so if multiple API calls happen 
     * at the exact same millisecond, they all wait for the SAME connection 
     * process instead of starting 5 different ones.
     */
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongooseInstance.connection;
    });
  }

  try {
    // Wait for the stored promise to resolve into an actual connection.
    cached!.conn = await cached!.promise;
  } catch (e) {
    // If connection fails, clear the promise so we can try again on the next request.
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;
