import mongoose from "mongoose";

// Define mongoose connection interface
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global namespace to include mongoose
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

// Define mongoose connection options
const options: mongoose.ConnectOptions = {
  // No need to pass options with MongoDB 4.x+ driver as most are now default
};

// Cache the database connection - TypeScript-safe approach
const globalWithMongo = global as typeof globalThis & {
  mongoose?: MongooseConnection;
};

// Initialize cached variable with default values if it doesn't exist
let cached = globalWithMongo.mongoose || { conn: null, promise: null };

if (!globalWithMongo.mongoose) {
  cached = globalWithMongo.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * @returns Mongoose connection instance
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("Disconnected from MongoDB");
  }
}

// Export mongoose instance
export { mongoose };
