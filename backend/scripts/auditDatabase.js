import 'dotenv/config';
import mongoose from 'mongoose';
import { Application } from '../src/models/Application.js';
import { Company } from '../src/models/Company.js';
import { Drive } from '../src/models/Drive.js';
import { Job } from '../src/models/Job.js';
import { Notification } from '../src/models/Notification.js';
import { User } from '../src/models/User.js';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not configured');
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

try {
  const [counts, roles, jobsWithoutCompanyRef, applicationsWithoutCompanyRef] = await Promise.all([
    Promise.all([User, Company, Job, Drive, Application].map((model) => model.countDocuments())),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Job.countDocuments({ $or: [{ companyRef: null }, { companyRef: { $exists: false } }] }),
    Application.countDocuments({ $or: [{ company: null }, { company: { $exists: false } }] }),
  ]);

  const [orphanDrives, orphanStudents, orphanCompanies, orphanNotificationUsers, duplicateApplications, softDeleted] = await Promise.all([
    Application.aggregate([
      { $lookup: { from: 'drives', localField: 'drive', foreignField: '_id', as: 'reference' } },
      { $match: { reference: { $size: 0 } } },
      { $count: 'count' },
    ]),
    Application.aggregate([
      { $lookup: { from: 'users', localField: 'student', foreignField: '_id', as: 'reference' } },
      { $match: { reference: { $size: 0 } } },
      { $count: 'count' },
    ]),
    Drive.aggregate([
      { $lookup: { from: 'companies', localField: 'company', foreignField: '_id', as: 'reference' } },
      { $match: { reference: { $size: 0 } } },
      { $count: 'count' },
    ]),
    Notification.aggregate([
      { $match: { $or: [{ user: { $type: 'objectId' } }, { recipient: { $type: 'objectId' } }] } },
      { $addFields: { targetUser: { $ifNull: ['$recipient', '$user'] } } },
      { $lookup: { from: 'users', localField: 'targetUser', foreignField: '_id', as: 'reference' } },
      { $match: { reference: { $size: 0 } } },
      { $count: 'count' },
    ]),
    Application.aggregate([
      { $group: { _id: { student: '$student', drive: '$drive' }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'count' },
    ]),
    Promise.all([
      Company.countDocuments({ isDeleted: true }),
      Drive.countDocuments({ isDeleted: true }),
      Application.countDocuments({ isDeleted: true }),
    ]),
  ]);

  console.log(JSON.stringify({
    connected: true,
    database: mongoose.connection.name,
    counts: {
      users: counts[0],
      companies: counts[1],
      jobs: counts[2],
      drives: counts[3],
      applications: counts[4],
    },
    roles,
    jobsWithoutCompanyRef,
    applicationsWithoutCompanyRef,
    orphanDriveRefs: orphanDrives[0]?.count || 0,
    orphanStudentRefs: orphanStudents[0]?.count || 0,
    orphanCompanyRefs: orphanCompanies[0]?.count || 0,
    orphanNotificationUserRefs: orphanNotificationUsers[0]?.count || 0,
    duplicateApplications: duplicateApplications[0]?.count || 0,
    softDeleted: {
      companies: softDeleted[0],
      drives: softDeleted[1],
      applications: softDeleted[2],
    },
  }, null, 2));
} finally {
  await mongoose.disconnect();
}
