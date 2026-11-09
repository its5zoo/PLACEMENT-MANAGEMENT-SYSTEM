import 'dotenv/config';
import mongoose from 'mongoose';
import { Application } from '../src/models/Application.js';
import { Job } from '../src/models/Job.js';
import { Notification } from '../src/models/Notification.js';
import { Offer } from '../src/models/Offer.js';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) throw new Error('MONGODB_URI is not configured');

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

try {
  const result = {};
  for (const model of [Application, Job, Notification, Offer]) {
    result[model.modelName] = await model.syncIndexes();
  }
  console.log(JSON.stringify({ success: true, synchronized: result }, null, 2));
} finally {
  await mongoose.disconnect();
}
