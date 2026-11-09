import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Drive } from '../models/Drive.js';
import { Application } from '../models/Application.js';
import { Document } from '../models/Document.js';
import { Offer } from '../models/Offer.js';
import { PlacementCase } from '../models/PlacementCase.js';
import { Announcement } from '../models/Announcement.js';
import { AuditLog } from '../models/AuditLog.js';
import { PlacementPolicy } from '../models/PlacementPolicy.js';
import { Notification } from '../models/Notification.js';
import { Job } from '../models/Job.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tnp_database';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for comprehensive institutional seeding at ${mongoose.connection.host}/${mongoose.connection.name}`);

    // Clear existing collections
    await User.deleteMany();
    await Company.deleteMany();
    await Drive.deleteMany();
    await Application.deleteMany();
    await Document.deleteMany();
    await Offer.deleteMany();
    await PlacementCase.deleteMany();
    await Announcement.deleteMany();
    await AuditLog.deleteMany();
    await PlacementPolicy.deleteMany();
    await Notification.deleteMany();
    await Job.deleteMany();

    console.log('Cleared existing collections...');

    // 1. Placement Policy Configuration
    const policy = await PlacementPolicy.create({
      institutionName: 'GIET University (School of Computer Science)',
      institutionDomain: 'giet.edu',
      minCgpaForPlacement: 6.5,
      minAttendanceForPlacement: 75.0,
      maxActiveBacklogsAllowed: 0,
      allowMultipleApplications: true,
      allowMultipleOffers: true,
      allowOfferUpgrade: true,
      minPackageMultiplierForUpgrade: 1.3,
      placementFreezeOnAcceptance: true,
    });
    console.log('Created Placement Policy...');

    // 2. Create Companies
    const companies = await Company.create([
      {
        name: 'Google India',
        legalName: 'Google India Private Limited',
        industry: 'Technology & Cloud',
        headOffice: 'Bengaluru, Karnataka',
        locations: ['Bengaluru', 'Hyderabad', 'Gurgaon'],
        website: 'https://careers.google.com',
        hrName: 'Sneha Sharma',
        hrDesignation: 'Campus Talent Acquisition Head',
        hrEmail: 'sneha.sharma@google.com',
        hrContact: '+91 98111 22334',
        verificationStatus: 'VERIFIED',
        activeDrives: 2,
        avgPackage: 'Rs. 24.5 LPA',
        logoBg: '#eff6ff',
        logoText: 'G',
      },
      {
        name: 'Microsoft Corporation',
        legalName: 'Microsoft India R&D Pvt Ltd',
        industry: 'Software & Cloud Solutions',
        headOffice: 'Hyderabad, Telangana',
        locations: ['Hyderabad', 'Bengaluru', 'Noida'],
        website: 'https://careers.microsoft.com',
        hrName: 'Arjun Verma',
        hrDesignation: 'University Relations Lead',
        hrEmail: 'arjun.verma@microsoft.com',
        hrContact: '+91 98222 33445',
        verificationStatus: 'VERIFIED',
        activeDrives: 1,
        avgPackage: 'Rs. 22.0 LPA',
        logoBg: '#fffbeb',
        logoText: 'MS',
      },
      {
        name: 'Amazon Web Services',
        legalName: 'Amazon Development Centre India',
        industry: 'E-commerce & Cloud Computing',
        headOffice: 'Hyderabad, Telangana',
        locations: ['Hyderabad', 'Bengaluru', 'Gurgaon'],
        website: 'https://amazon.jobs',
        hrName: 'Priya Iyer',
        hrDesignation: 'Senior Technical Recruiter',
        hrEmail: 'priya.recruiter@amazon.com',
        hrContact: '+91 98333 44556',
        verificationStatus: 'VERIFIED',
        activeDrives: 1,
        avgPackage: 'Rs. 28.0 LPA',
        logoBg: '#f0fdf4',
        logoText: 'AMZ',
      },
      {
        name: 'Goldman Sachs',
        legalName: 'Goldman Sachs Services India Pvt Ltd',
        industry: 'Investment Banking & Fintech',
        headOffice: 'Bengaluru, Karnataka',
        locations: ['Bengaluru', 'Hyderabad'],
        website: 'https://goldmansachs.com/careers',
        hrName: 'Vikram Mehta',
        hrDesignation: 'Engineering Talent Partner',
        hrEmail: 'vikram.mehta@gs.com',
        hrContact: '+91 98444 55667',
        verificationStatus: 'VERIFIED',
        activeDrives: 1,
        avgPackage: 'Rs. 22.5 LPA',
        logoBg: '#faf5ff',
        logoText: 'GS',
      },
      {
        name: 'Infosys Limited',
        legalName: 'Infosys Limited',
        industry: 'IT Services & Consulting',
        headOffice: 'Bengaluru, Karnataka',
        locations: ['Pune', 'Bengaluru', 'Mysuru', 'Hyderabad'],
        website: 'https://infosys.com/careers',
        hrName: 'Rohan Deshmukh',
        hrDesignation: 'Campus Hiring Lead',
        hrEmail: 'rohan.d@infosys.com',
        hrContact: '+91 98555 66778',
        verificationStatus: 'VERIFIED',
        activeDrives: 2,
        avgPackage: 'Rs. 9.5 LPA',
        logoBg: '#eff6ff',
        logoText: 'INF',
      },
      {
        name: 'Innovaccer Analytics',
        legalName: 'Innovaccer Data Systems Pvt Ltd',
        industry: 'Healthcare Technology',
        headOffice: 'Noida, Uttar Pradesh',
        locations: ['Noida', 'Bengaluru'],
        website: 'https://innovaccer.com',
        hrName: 'Neha Kapoor',
        hrDesignation: 'HR Specialist',
        hrEmail: 'neha.k@innovaccer.com',
        hrContact: '+91 98666 77889',
        verificationStatus: 'PROFILE_SUBMITTED', // Pending TNP review
        activeDrives: 1,
        avgPackage: 'Rs. 16.0 LPA',
        logoBg: '#fef2f2',
        logoText: 'INV',
      },
    ]);
    console.log('Created Companies...');

    // 3. Create Users (Students, TNP Officers, Company Recruiter)
    const studentUser = await User.create({
      name: 'Faizaan',
      email: '231cs001.faizaan@giet.edu',
      password: 'password123',
      role: 'STUDENT',
      phone: '+91 98765 43210',
      location: 'Delhi, India',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS001',
        rollNo: '231CS001',
        institutionEmail: '231cs001.faizaan@giet.edu',
        personalEmail: 'faizaan@gmail.com',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        semester: 8,
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: 8.85,
        tenthPercentage: 94.0,
        twelfthPercentage: 92.4,
        backlogs: 0,
        activeBacklogs: 0,
        attendancePercentage: 88.0,
        placementStatus: 'IN_PROCESS',
        placementCount: 0,
        skills: ['React.js', 'Node.js', 'TypeScript', 'Java', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS'],
        certifications: [
          { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
          { title: 'Meta Front-End Developer Specialization', issuer: 'Coursera', year: '2023' },
        ],
        projects: [
          { title: 'Campus Placement System', description: 'Enterprise MERN portal with explainable eligibility engine', techStack: ['React', 'Node.js', 'MongoDB'] },
          { title: 'Algorithmic Trading Bot', description: 'High-frequency transaction monitoring engine', techStack: ['Python', 'FastAPI'] },
        ],
        resumeUrl: '/sample-resume.pdf',
        resumeVerified: true,
        profileCompletionPercent: 88,
      },
    });

    // Second student (Near match: 6.9 CGPA, 1 backlog, eligible for mass hiring drives)
    const studentUser2 = await User.create({
      name: 'Rahul Sharma',
      email: '231cs045.rahul@giet.edu',
      password: 'password123',
      role: 'STUDENT',
      phone: '+91 98123 45678',
      location: 'Bhubaneswar, Odisha',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS045',
        rollNo: '231CS045',
        institutionEmail: '231cs045.rahul@giet.edu',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        semester: 8,
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: 6.95,
        tenthPercentage: 82.0,
        twelfthPercentage: 78.0,
        backlogs: 1,
        activeBacklogs: 0,
        attendancePercentage: 76.5,
        placementStatus: 'UNPLACED',
        skills: ['Java', 'SQL', 'HTML/CSS'],
        resumeUrl: '/sample-resume.pdf',
        resumeVerified: true,
      },
    });

    // Unfilled Student: Dilip (For onboarding / fresh profile testing)
    await User.create({
      name: 'Dilip',
      email: '231cs088.dilip@giet.edu',
      password: 'password123',
      role: 'STUDENT',
      phone: '',
      location: '',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS088',
        rollNo: '231CS088',
        institutionEmail: '231cs088.dilip@giet.edu',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: null,
        tenthPercentage: null,
        twelfthPercentage: null,
        backlogs: 0,
        activeBacklogs: 0,
        attendancePercentage: 0,
        placementStatus: 'UNPLACED',
        skills: [],
        certifications: [],
        projects: [],
        hobbies: [],
        languages: [],
        careerObjective: '',
        resumeVerified: false,
        profileCompletionPercent: 0,
      },
    });

    // Unfilled Student: Sravan (For onboarding / fresh profile testing)
    await User.create({
      name: 'Sravan',
      email: '231cs092.sravan@giet.edu',
      password: 'password123',
      role: 'STUDENT',
      phone: '',
      location: '',
      avatar: '/doraemon.png',
      studentDetails: {
        rollNumber: '231CS092',
        rollNo: '231CS092',
        institutionEmail: '231cs092.sravan@giet.edu',
        department: 'Computer Science',
        branch: 'CSE',
        program: 'B.Tech',
        batch: '2023-2027',
        graduationYear: 2027,
        cgpa: null,
        tenthPercentage: null,
        twelfthPercentage: null,
        backlogs: 0,
        activeBacklogs: 0,
        attendancePercentage: 0,
        placementStatus: 'UNPLACED',
        skills: [],
        certifications: [],
        projects: [],
        hobbies: [],
        languages: [],
        careerObjective: '',
        resumeVerified: false,
        profileCompletionPercent: 0,
      },
    });

    // TNP Cell Officers
    const tnpOfficer = await User.create({
      name: 'Prof. Rajesh Mohanty',
      email: 'tnp@giet.edu',
      password: 'admin123',
      role: 'TNP_ADMIN',
      phone: '+91 91234 56789',
      location: 'T&P Administrative Wing, GIET University',
    });

    // Company HR User
    const companyUser = await User.create({
      name: 'Sneha Sharma (Google HR)',
      email: 'recruiter@google.com',
      password: 'password123',
      role: 'COMPANY',
      companyRef: companies[0]._id,
      phone: '+91 98111 22334',
    });

    console.log('Created Users...');

    // 4. Create Placement Drives across various Lifecycle States
    const drives = await Drive.create([
      {
        title: 'Google Campus Placement 2027',
        role: 'Software Engineer - Campus 2027',
        company: companies[0]._id,
        companyName: 'Google India',
        ctc: 'Rs. 24 - 28 LPA',
        baseSalary: 'Rs. 20 LPA',
        variablePay: 'Rs. 4 LPA + Stock Grants',
        location: 'Bengaluru, India',
        workMode: 'Hybrid',
        employmentType: 'Full Time',
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        description: 'Design and develop scalable distributed software systems powering billions of searches and cloud workloads.',
        eligibility: {
          minCgpa: 7.5,
          min10thPercentage: 70.0,
          min12thPercentage: 70.0,
          maxBacklogs: 1,
          maxActiveBacklogs: 0,
          minAttendance: 75.0,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          allowedGraduationYears: [2027],
          requiredSkills: ['Data Structures', 'Java', 'Python', 'C++'],
          preferredSkills: ['Distributed Systems', 'Cloud'],
        },
        rounds: [
          { roundIndex: 1, name: 'Online Coding Assessment (HackerEarth)', type: 'Coding Test', date: '25 May 2027', status: 'SCHEDULED' },
          { roundIndex: 2, name: 'Technical Round 1 (Algorithms & Systems)', type: 'Technical Interview', date: '28 May 2027', status: 'SCHEDULED' },
          { roundIndex: 3, name: 'Technical Round 2 (System Design)', type: 'Technical Interview', date: '30 May 2027', status: 'SCHEDULED' },
          { roundIndex: 4, name: 'Googliness & Leadership Fit', type: 'HR Interview', date: '02 June 2027', status: 'SCHEDULED' },
        ],
        status: 'APPLICATIONS_OPEN',
        reviewedBy: tnpOfficer._id,
        reviewedAt: new Date(),
        logoBg: '#eff6ff',
        logoText: 'G',
      },
      {
        title: 'Microsoft 365 Cloud Engineering',
        role: 'Frontend Software Engineer',
        company: companies[1]._id,
        companyName: 'Microsoft Corporation',
        ctc: 'Rs. 22 - 25 LPA',
        baseSalary: 'Rs. 18 LPA',
        variablePay: 'Rs. 4 LPA',
        location: 'Hyderabad, India',
        workMode: 'On-site',
        employmentType: 'Full Time',
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        description: 'Build enterprise-grade modern web applications using React, TypeScript, and Microsoft Fluent UI.',
        eligibility: {
          minCgpa: 7.0,
          min10thPercentage: 65.0,
          min12thPercentage: 65.0,
          maxBacklogs: 2,
          maxActiveBacklogs: 0,
          minAttendance: 75.0,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          allowedGraduationYears: [2027],
          requiredSkills: ['React.js', 'TypeScript', 'JavaScript'],
          preferredSkills: ['System Design', 'Cloud'],
        },
        rounds: [
          { roundIndex: 1, name: 'Cognitive & Coding Test', type: 'Coding Test', date: '18 May 2027', status: 'COMPLETED' },
          { roundIndex: 2, name: 'Technical Discussion 1', type: 'Technical Interview', date: '22 May 2027', status: 'LIVE' },
          { roundIndex: 3, name: 'Final Hiring Manager Round', type: 'Final Round', date: '26 May 2027', status: 'SCHEDULED' },
        ],
        status: 'INTERVIEWING',
        reviewedBy: tnpOfficer._id,
        reviewedAt: new Date(),
        logoBg: '#fffbeb',
        logoText: 'MS',
      },
      {
        title: 'AWS Distributed Cloud Platforms',
        role: 'SDE-1 (Graduate Engineer)',
        company: companies[2]._id,
        companyName: 'Amazon Web Services',
        ctc: 'Rs. 26 - 30 LPA',
        baseSalary: 'Rs. 22 LPA',
        variablePay: 'Rs. 4 LPA',
        location: 'Gurgaon, India',
        workMode: 'Hybrid',
        employmentType: 'Full Time',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        description: 'High-scale event-driven microservices architecture engineering.',
        eligibility: {
          minCgpa: 7.5,
          min10thPercentage: 70.0,
          min12thPercentage: 70.0,
          maxBacklogs: 0,
          maxActiveBacklogs: 0,
          minAttendance: 80.0,
          allowedBranches: ['CSE', 'IT'],
          allowedGraduationYears: [2027],
          requiredSkills: ['Java', 'AWS', 'Distributed Systems'],
        },
        rounds: [
          { roundIndex: 1, name: 'Online Assessment (CodeSignal)', type: 'Online Assessment' },
          { roundIndex: 2, name: 'Bar Raiser Interview', type: 'Final Round' },
        ],
        status: 'APPLICATIONS_OPEN',
        reviewedBy: tnpOfficer._id,
        reviewedAt: new Date(),
        logoBg: '#f0fdf4',
        logoText: 'AMZ',
      },
      // Drive pending review (Requested by Innovaccer)
      {
        title: 'Innovaccer Campus Drive 2027',
        role: 'Associate Data Engineer',
        company: companies[5]._id,
        companyName: 'Innovaccer Analytics',
        ctc: 'Rs. 16.0 LPA',
        baseSalary: 'Rs. 14 LPA',
        variablePay: 'Rs. 2 LPA',
        location: 'Noida, India',
        workMode: 'On-site',
        employmentType: 'Full Time',
        applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        description: 'Healthcare data pipeline processing and analytics infrastructure.',
        eligibility: {
          minCgpa: 7.0,
          min10thPercentage: 65.0,
          min12thPercentage: 65.0,
          maxBacklogs: 1,
          maxActiveBacklogs: 0,
          minAttendance: 75.0,
          allowedBranches: ['CSE', 'IT', 'ECE'],
          allowedGraduationYears: [2027],
          requiredSkills: ['Python', 'SQL', 'Data Pipelines'],
        },
        rounds: [
          { roundIndex: 1, name: 'Aptitude & SQL Challenge', type: 'Online Assessment' },
          { roundIndex: 2, name: 'Technical Interview', type: 'Technical Interview' },
        ],
        status: 'SUBMITTED', // Needs TNP approval!
        logoBg: '#fef2f2',
        logoText: 'INV',
      },
    ]);
    console.log('Created Drives...');

    // Keep the legacy jobs listing API in sync with placement drives.
    await Job.create(drives.map((drive) => ({
      company: drive.companyName,
      companyRef: drive.company,
      role: drive.role,
      location: drive.location,
      ctc: drive.ctc,
      deadline: drive.applicationDeadline.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      logoBg: drive.logoBg,
      logoText: drive.logoText,
      tags: drive.eligibility.requiredSkills,
      description: drive.description,
      eligibility: {
        minCgpa: drive.eligibility.minCgpa,
        allowedBranches: drive.eligibility.allowedBranches,
        backlogsAllowed: drive.eligibility.maxActiveBacklogs,
      },
      status: ['APPROVED', 'PUBLISHED', 'APPLICATIONS_OPEN'].includes(drive.status) ? 'active' : 'closed',
    })));
    console.log('Created Jobs...');

    // 5. Create Applications for Faizaan
    await Application.create([
      {
        student: studentUser._id,
        drive: drives[0]._id,
        company: companies[0]._id,
        companyName: 'Google India',
        role: 'Software Engineer - Campus 2027',
        status: 'APPLIED',
        appliedDate: '20 May 2027',
        eligibilitySnapshot: {
          cgpa: 8.85,
          attendancePercentage: 88.0,
          activeBacklogs: 0,
          branch: 'CSE',
          graduationYear: 2027,
          isEligible: true,
          matchPercentage: 92,
        },
        currentRoundIndex: 1,
        currentRoundName: 'Online Coding Assessment',
        logo: 'G',
        logoBg: '#eff6ff',
        location: 'Bengaluru, India',
        ctc: 'Rs. 24 - 28 LPA',
      },
      {
        student: studentUser._id,
        drive: drives[1]._id,
        company: companies[1]._id,
        companyName: 'Microsoft Corporation',
        role: 'Frontend Software Engineer',
        status: 'SHORTLISTED',
        appliedDate: '18 May 2027',
        eligibilitySnapshot: {
          cgpa: 8.85,
          attendancePercentage: 88.0,
          activeBacklogs: 0,
          branch: 'CSE',
          graduationYear: 2027,
          isEligible: true,
          matchPercentage: 95,
        },
        currentRoundIndex: 2,
        currentRoundName: 'Technical Discussion 1',
        roundResults: [
          { roundIndex: 1, roundName: 'Cognitive & Coding Test', status: 'CLEARED', score: '94/100', feedback: 'Exceptional JavaScript and React fundamentals.' },
        ],
        logo: 'MS',
        logoBg: '#fffbeb',
        location: 'Hyderabad, India',
        ctc: 'Rs. 22 - 25 LPA',
      },
      {
        student: studentUser._id,
        drive: drives[2]._id,
        company: companies[2]._id,
        companyName: 'Amazon Web Services',
        role: 'SDE-1 (Graduate Engineer)',
        status: 'APPLIED',
        appliedDate: '15 May 2027',
        eligibilitySnapshot: {
          cgpa: 8.85,
          attendancePercentage: 88.0,
          activeBacklogs: 0,
          branch: 'CSE',
          graduationYear: 2027,
          isEligible: true,
          matchPercentage: 88,
        },
        currentRoundIndex: 1,
        currentRoundName: 'Application Review',
        logo: 'AMZ',
        logoBg: '#f0fdf4',
        location: 'Gurgaon, India',
        ctc: 'Rs. 26 - 30 LPA',
      },
    ]);
    console.log('Created Applications...');

    // 6. Create Institutional Documents
    await Document.create([
      {
        owner: studentUser._id,
        ownerRole: 'STUDENT',
        title: 'Latest Verified Resume (Faizaan)',
        type: 'Resume',
        fileUrl: '/sample-resume.pdf',
        fileName: 'Faizaan_Resume_2027.pdf',
        fileSize: '1.2 MB',
        status: 'VERIFIED',
        verifiedBy: tnpOfficer._id,
        verifiedAt: new Date(),
      },
      {
        owner: studentUser._id,
        ownerRole: 'STUDENT',
        title: '10th Secondary Marksheet',
        type: '10th Marksheet',
        fileUrl: '/sample-marksheet.pdf',
        fileName: 'Class_X_Marksheet.pdf',
        fileSize: '2.1 MB',
        status: 'VERIFIED',
        verifiedBy: tnpOfficer._id,
        verifiedAt: new Date(),
      },
      {
        owner: studentUser._id,
        ownerRole: 'STUDENT',
        title: '12th Senior Secondary Marksheet',
        type: '12th Marksheet',
        fileUrl: '/sample-marksheet.pdf',
        fileName: 'Class_XII_Marksheet.pdf',
        fileSize: '2.3 MB',
        status: 'VERIFIED',
        verifiedBy: tnpOfficer._id,
        verifiedAt: new Date(),
      },
      {
        owner: studentUser._id,
        ownerRole: 'STUDENT',
        title: '6th Semester Consolidated Marksheet',
        type: 'Semester Marksheet',
        fileUrl: '/sample-marksheet.pdf',
        fileName: 'Sem_6_Marksheet.pdf',
        fileSize: '1.8 MB',
        status: 'UNDER_REVIEW', // Pending verification
      },
    ]);
    console.log('Created Documents...');

    // 7. Create Placement Cases
    await PlacementCase.create([
      {
        caseNumber: 'PMS-1042',
        student: studentUser._id,
        studentRoll: '231CS001',
        studentName: 'Faizaan',
        subject: 'Special Verification for AWS Cloud Certification Credits',
        category: 'Eligibility Discrepancy',
        status: 'UNDER_REVIEW',
        priority: 'HIGH',
        description: 'Requesting placement exemption for distributed systems certification completed via AWS Academy.',
        internalNotes: 'Checked verification ID with AWS badge registry. Ready to approve.',
        assignedTo: tnpOfficer._id,
      },
      {
        caseNumber: 'PMS-1088',
        student: studentUser2._id,
        studentRoll: '231CS045',
        studentName: 'Rahul Sharma',
        subject: 'Attendance Medical Exemption for Semester 7',
        category: 'Attendance Issue',
        status: 'WAITING_FOR_STUDENT',
        priority: 'NORMAL',
        description: 'Attendance shows 76.5%, requesting inclusion of hospital medical leave slip to reach 80%.',
        internalNotes: 'Medical certificate must be authenticated by University Medical Officer.',
        assignedTo: tnpOfficer._id,
      },
    ]);
    console.log('Created Placement Cases...');

    // 8. Create Announcements
    await Announcement.create([
      {
        title: 'Google India Campus Drive 2027 Scheduled',
        content: 'Google India has opened registrations for Software Engineer - Campus 2027 batch. Eligible students must apply through the PMS portal before 25 May 2027.',
        category: 'Placement Drive',
        priority: 'HIGH',
        author: tnpOfficer._id,
        authorName: 'Prof. Rajesh Mohanty (T&P Head)',
        isPinned: true,
      },
      {
        title: 'Mandatory Resume & Document Verification Deadline',
        content: 'All 8th semester students must ensure their consolidated semester marksheets and verified resumes are uploaded on PMS by end of this week.',
        category: 'Document Deadline',
        priority: 'URGENT',
        author: tnpOfficer._id,
        authorName: 'TNP Verification Cell',
      },
    ]);
    console.log('Created Announcements...');

    // 9. Create Notifications
    await Notification.create([
      {
        recipient: studentUser._id,
        recipientRole: 'STUDENT',
        title: 'Shortlisted for Microsoft Round 2',
        message: 'Your performance in Cognitive & Coding test was cleared. Technical Discussion 1 is scheduled.',
        type: 'DRIVE_SPECIFIC',
        priority: 'HIGH',
        time: '15m ago',
        unread: true,
      },
      {
        recipient: studentUser._id,
        recipientRole: 'STUDENT',
        title: 'New High-Fit Recommendation: Google Campus 2027',
        message: '92% match found based on your CGPA (8.85), CSE branch, and verified Java/Python skill tags.',
        type: 'PERSONAL',
        priority: 'NORMAL',
        time: '1h ago',
        unread: true,
      },
      {
        recipientRole: 'TNP',
        title: 'Drive Approval Required: Innovaccer Analytics',
        message: 'Innovaccer Analytics submitted Associate Data Engineer drive request requiring approval.',
        type: 'ROLE_BASED',
        priority: 'HIGH',
        time: '2h ago',
        unread: true,
      },
    ]);
    console.log('Created Notifications...');

    // 10. Create Initial Audit Logs
    await AuditLog.create([
      {
        actor: tnpOfficer._id,
        actorName: 'Prof. Rajesh Mohanty',
        actorRole: 'TNP_ADMIN',
        action: 'DRIVE_APPROVED',
        entityType: 'DRIVE',
        entityId: String(drives[0]._id),
        oldValue: { status: 'UNDER_REVIEW' },
        newValue: { status: 'APPLICATIONS_OPEN' },
        reason: 'Eligibility and package criteria verified with Google campus recruitment team.',
      },
      {
        actor: studentUser._id,
        actorName: 'Faizaan',
        actorRole: 'STUDENT',
        action: 'APPLICATION_SUBMITTED',
        entityType: 'APPLICATION',
        entityId: String(drives[0]._id),
        newValue: { company: 'Google India', role: 'Software Engineer - Campus 2027' },
        reason: 'Student applied within active window',
      },
    ]);
    console.log('Created Audit Logs...');

    console.log('====================================================');
    console.log('✅ Institutional PMS Database Seeding Completed!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
