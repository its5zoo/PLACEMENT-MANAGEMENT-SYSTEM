import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Database configuration missing: set MONGODB_URI');
  }

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};
