import 'dotenv/config';
import mongoose from 'mongoose';
import { Company } from '../src/models/Company.js';
import { Job } from '../src/models/Job.js';
import { Notification } from '../src/models/Notification.js';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) throw new Error('MONGODB_URI is not configured');

const aliases = new Map([
  ['Google', 'Google India'],
  ['Microsoft', 'Microsoft Corporation'],
  ['Amazon', 'Amazon Web Services'],
]);

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

try {
  const jobs = await Job.find({ $or: [{ companyRef: null }, { companyRef: { $exists: false } }] });
  let linkedJobs = 0;
  let createdCompanies = 0;

  for (const job of jobs) {
    const companyName = aliases.get(job.company) || job.company;
    let company = await Company.findOne({ name: companyName, isDeleted: { $ne: true } });
    if (!company) {
      company = await Company.create({
        name: companyName,
        industry: 'Technology',
        verificationStatus: 'REGISTERED',
        activeDrives: 0,
        avgPackage: job.ctc || 'Competitive',
        logoText: companyName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'CO',
      });
      createdCompanies += 1;
    }
    job.companyRef = company._id;
    if (job.isDeleted === undefined) job.isDeleted = false;
    await job.save();
    linkedJobs += 1;
  }

  const removedSmokeNotifications = await Notification.deleteMany({
    title: { $regex: 'codex-smoke-', $options: 'i' },
  });

  console.log(JSON.stringify({
    success: true,
    linkedJobs,
    createdCompanies,
    removedSmokeNotifications: removedSmokeNotifications.deletedCount,
  }, null, 2));
} finally {
  await mongoose.disconnect();
}
