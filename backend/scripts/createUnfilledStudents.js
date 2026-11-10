import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tnp_database');
  
  // Define Schema with pre-save or hash manually
  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'STUDENT' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '/doraemon.png' },
    studentDetails: { type: Object, default: {} },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const hashedPassword = await bcrypt.hash('password123', 10);

  const studentsToCreate = [
    {
      name: 'Dilip',
      email: '231cs088.dilip@giet.edu',
      password: hashedPassword,
      role: 'STUDENT',
      phone: '',
      location: '',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS088',
        rollNo: '231CS088',
        institutionEmail: '231cs088.dilip@giet.edu',
        personalEmail: '',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        semester: 8,
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: null,
        tenthPercentage: null,
        twelfthPercentage: null,
        backlogs: 0,
        activeBacklogs: 0,
        attendancePercentage: 0,
        placementStatus: 'UNPLACED',
        placementCount: 0,
        skills: [],
        certifications: [],
        projects: [],
        experience: [],
        hobbies: [],
        languages: [],
        careerObjective: '',
        willingToRelocate: false,
        willingToTravel: false,
        preferredWorkMode: '',
        resumeUrl: '',
        resumeVerified: false,
        profileCompletionPercent: 0,
      }
    },
    {
      name: 'Sravan',
      email: '231cs092.sravan@giet.edu',
      password: hashedPassword,
      role: 'STUDENT',
      phone: '',
      location: '',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS092',
        rollNo: '231CS092',
        institutionEmail: '231cs092.sravan@giet.edu',
        personalEmail: '',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        semester: 8,
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: null,
        tenthPercentage: null,
        twelfthPercentage: null,
        backlogs: 0,
        activeBacklogs: 0,
        attendancePercentage: 0,
        placementStatus: 'UNPLACED',
        placementCount: 0,
        skills: [],
        certifications: [],
        projects: [],
        experience: [],
        hobbies: [],
        languages: [],
        careerObjective: '',
        willingToRelocate: false,
        willingToTravel: false,
        preferredWorkMode: '',
        resumeUrl: '',
        resumeVerified: false,
        profileCompletionPercent: 0,
      }
    }
  ];

  for (const s of studentsToCreate) {
    const existing = await User.findOne({ email: s.email });
    if (existing) {
      await User.updateOne({ email: s.email }, { $set: s });
      console.log(`Updated unfilled student account: ${s.name} (${s.email})`);
    } else {
      await User.create(s);
      console.log(`Created new unfilled student account: ${s.name} (${s.email})`);
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);

