import 'dotenv/config';
import mongoose from 'mongoose';
import { Application } from '../src/models/Application.js';
import { Company } from '../src/models/Company.js';
import { Drive } from '../src/models/Drive.js';
import { Job } from '../src/models/Job.js';
import { Notification } from '../src/models/Notification.js';
import { User } from '../src/models/User.js';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5051/api';
const requiredCredentials = [
  'SMOKE_STUDENT_EMAIL', 'SMOKE_STUDENT_PASSWORD',
  'SMOKE_TNP_EMAIL', 'SMOKE_TNP_PASSWORD',
  'SMOKE_COMPANY_EMAIL', 'SMOKE_COMPANY_PASSWORD',
];
for (const key of requiredCredentials) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

const marker = `codex-smoke-${Date.now()}`;
const tempEmail = `${marker}@example.test`;
const results = [];
let tnpToken;
let studentToken;
let companyToken;
let tempToken;
let testCompanyId;
let testJobId;
let testDriveId;
let tempUserId;

const request = async (path, { token, method = 'GET', body } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  return { status: response.status, payload };
};

const expect = (condition, name, detail = '') => {
  if (!condition) throw new Error(`${name}${detail ? `: ${detail}` : ''}`);
  results.push({ name, status: 'passed' });
};

const login = async (email, password) => {
  const response = await request('/auth/login', { method: 'POST', body: { email, password } });
  expect(response.status === 200 && response.payload.data?.token, `login ${email}`);
  return response.payload.data.token;
};

try {
  const health = await request('/health');
  expect(health.status === 200 && health.payload.database === 'connected', 'database-aware health check');

  const unauthenticated = await request('/stats/dashboard');
  expect(unauthenticated.status === 401, 'protected route rejects missing token');

  [studentToken, tnpToken, companyToken] = await Promise.all([
    login(process.env.SMOKE_STUDENT_EMAIL, process.env.SMOKE_STUDENT_PASSWORD),
    login(process.env.SMOKE_TNP_EMAIL, process.env.SMOKE_TNP_PASSWORD),
    login(process.env.SMOKE_COMPANY_EMAIL, process.env.SMOKE_COMPANY_PASSWORD),
  ]);

  const registration = await request('/auth/register', {
    method: 'POST',
    body: {
      name: marker,
      email: tempEmail,
      password: 'SmokePass123!',
      role: 'SUPER_ADMIN',
      studentDetails: { cgpa: 10, placementStatus: 'PLACED' },
    },
  });
  expect(registration.status === 201, 'student registration');
  expect(registration.payload.data.role === 'STUDENT', 'registration blocks privilege escalation');
  expect(registration.payload.data.studentDetails?.cgpa == null, 'registration does not invent academic records');
  tempToken = registration.payload.data.token;
  tempUserId = registration.payload.data._id;

  const profileUpdate = await request('/auth/profile', {
    token: tempToken,
    method: 'PUT',
    body: { studentDetails: { cgpa: 9.9, skills: ['Testing'] } },
  });
  expect(profileUpdate.status === 200, 'profile update');
  expect(profileUpdate.payload.data.studentDetails?.cgpa == null, 'profile update protects institutional academics');
  expect(profileUpdate.payload.data.studentDetails?.skills?.includes('Testing'), 'profile update keeps student-editable fields');

  const publicReads = await Promise.all([request('/jobs'), request('/companies'), request('/drives')]);
  expect(publicReads.every((entry) => entry.status === 200 && entry.payload.success), 'public listing reads');
  expect(publicReads[0].payload.count > 0, 'legacy jobs remain visible');

  const companyCreate = await request('/companies', {
    token: tnpToken,
    method: 'POST',
    body: { name: marker, industry: 'Quality Engineering' },
  });
  expect(companyCreate.status === 201, 'company create');
  testCompanyId = companyCreate.payload.data._id;

  const companyRead = await request(`/companies/${testCompanyId}`);
  expect(companyRead.status === 200, 'company read');
  const companyUpdate = await request(`/companies/${testCompanyId}`, {
    token: tnpToken,
    method: 'PUT',
    body: { industry: 'Software Quality' },
  });
  expect(companyUpdate.status === 200 && companyUpdate.payload.data.industry === 'Software Quality', 'company update');
  const companyDelete = await request(`/companies/${testCompanyId}`, { token: tnpToken, method: 'DELETE' });
  expect(companyDelete.status === 200, 'company archive');

  const driveCompany = publicReads[1].payload.data[0];
  const driveCreate = await request('/drives', {
    token: tnpToken,
    method: 'POST',
    body: {
      title: marker,
      role: 'Test Engineer',
      company: driveCompany._id,
      companyName: driveCompany.name,
      ctc: '12 LPA',
      location: 'Remote',
      applicationDeadline: '2099-12-31T00:00:00.000Z',
      status: 'APPROVED',
    },
  });
  expect(driveCreate.status === 201, 'drive create');
  testDriveId = driveCreate.payload.data._id;
  const driveRead = await request(`/drives/${testDriveId}`);
  expect(driveRead.status === 200, 'drive read');
  const driveUpdate = await request(`/drives/${testDriveId}`, {
    token: tnpToken,
    method: 'PUT',
    body: { ctc: '13 LPA' },
  });
  expect(driveUpdate.status === 200 && driveUpdate.payload.data.ctc === '13 LPA', 'drive update');
  const driveDelete = await request(`/drives/${testDriveId}`, { token: tnpToken, method: 'DELETE' });
  expect(driveDelete.status === 200, 'drive archive');

  const jobCreate = await request('/jobs', {
    token: tnpToken,
    method: 'POST',
    body: {
      company: marker,
      role: 'QA Engineer',
      location: 'Remote',
      ctc: '10 LPA',
      deadline: '31 Dec 2099',
      eligibility: { minCgpa: 0, allowedBranches: [], backlogsAllowed: 99 },
    },
  });
  expect(jobCreate.status === 201, 'job create');
  testJobId = jobCreate.payload.data._id;

  const jobRead = await request(`/jobs/${testJobId}`);
  expect(jobRead.status === 200, 'job read');
  const jobUpdate = await request(`/jobs/${testJobId}`, {
    token: tnpToken,
    method: 'PUT',
    body: { ctc: '11 LPA' },
  });
  expect(jobUpdate.status === 200 && jobUpdate.payload.data.ctc === '11 LPA', 'job update');

  const applicationCreate = await request('/applications/apply', {
    token: tempToken,
    method: 'POST',
    body: { jobId: testJobId },
  });
  expect(applicationCreate.status === 201 && applicationCreate.payload.data.job === testJobId, 'job application create');
  const applicationId = applicationCreate.payload.data._id;
  const duplicateApplication = await request('/applications/apply', {
    token: tempToken,
    method: 'POST',
    body: { jobId: testJobId },
  });
  expect(duplicateApplication.status === 409, 'duplicate application rejected');
  const applicationsRead = await request('/applications/my', { token: tempToken });
  expect(applicationsRead.status === 200 && applicationsRead.payload.count === 1, 'application read');
  const applicationUpdate = await request(`/applications/${applicationId}/status`, {
    token: tnpToken,
    method: 'PUT',
    body: { status: 'UNDER_REVIEW', currentRound: 'Screening' },
  });
  expect(
    applicationUpdate.status === 200 && applicationUpdate.payload.data.currentRoundName === 'Screening',
    'application status update'
  );

  const jobDelete = await request(`/jobs/${testJobId}`, { token: tnpToken, method: 'DELETE' });
  expect(jobDelete.status === 200, 'job archive');
  const archivedJobRead = await request(`/jobs/${testJobId}`);
  expect(archivedJobRead.status === 404, 'archived job hidden');

  const [studentStats, tnpDashboard, companyDashboard] = await Promise.all([
    request('/stats/dashboard', { token: studentToken }),
    request('/tnp/dashboard', { token: tnpToken }),
    request('/company/dashboard', { token: companyToken }),
  ]);
  expect(studentStats.status === 200, 'student dashboard read');
  expect(tnpDashboard.status === 200, 'TNP dashboard read');
  expect(companyDashboard.status === 200, 'company dashboard read');

  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  await Notification.create({
    recipient: tempUserId,
    recipientRole: 'STUDENT',
    title: marker,
    message: 'Private smoke notification',
    type: 'PERSONAL',
  });
  await mongoose.disconnect();
  const tempNotifications = await request('/notifications', { token: tempToken });
  const companyNotifications = await request('/notifications', { token: companyToken });
  expect(tempNotifications.payload.data?.some((item) => item.title === marker), 'personal notification reaches recipient');
  expect(!companyNotifications.payload.data?.some((item) => item.title === marker), 'personal notification is isolated');
  const privateNotification = tempNotifications.payload.data.find((item) => item.title === marker);
  const unauthorizedRead = await request(`/notifications/${privateNotification._id}/read`, {
    token: companyToken,
    method: 'PUT',
  });
  expect(unauthorizedRead.status === 404, 'notification update enforces ownership');
  const authorizedRead = await request(`/notifications/${privateNotification._id}/read`, {
    token: tempToken,
    method: 'PUT',
  });
  expect(authorizedRead.status === 200 && authorizedRead.payload.data.unread === false, 'notification update');

  console.log(JSON.stringify({ success: true, count: results.length, results }, null, 2));
} finally {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  }
  await Promise.all([
    Application.deleteMany({ student: tempUserId }),
    Notification.deleteMany({ $or: [{ recipient: tempUserId }, { user: tempUserId }, { title: marker }] }),
    Job.deleteMany({ $or: [{ _id: testJobId }, { company: marker }] }),
    Drive.deleteMany({ $or: [{ _id: testDriveId }, { title: marker }] }),
    Company.deleteMany({ $or: [{ _id: testCompanyId }, { name: marker }] }),
    User.deleteMany({ $or: [{ _id: tempUserId }, { email: tempEmail }] }),
  ]);
  await mongoose.disconnect();
}
