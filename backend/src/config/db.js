import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI environment variable is not set in Render/Environment. Running without persistent database.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`⚠️ MongoDB connection error: ${err.message}`);
    console.log('💡 TIP: If using MongoDB Atlas, go to "Network Access" and allow IP "0.0.0.0/0" (Allow access from anywhere).');
    return null;
  }
};
