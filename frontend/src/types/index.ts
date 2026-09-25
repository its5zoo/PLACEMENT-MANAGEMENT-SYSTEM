export type PortalMode = 'STUDENT' | 'TNP' | 'COMPANY';

export type ActiveTab = 
  // Student Portal Tabs
  | 'dashboard'
  | 'profile'
  | 'job-listings'
  | 'recommendations'
  | 'readiness'
  | 'my-applications'
  | 'companies'
  | 'placement-drive'
  | 'documents'
  | 'offers'
  | 'resources'
  | 'training-skills'
  | 'messages'
  | 'settings'
  // TNP Portal Tabs
  | 'tnp-dashboard'
  | 'tnp-requests'
  | 'tnp-drives'
  | 'tnp-students'
  | 'tnp-documents'
  | 'tnp-cases'
  | 'tnp-announcements'
  | 'tnp-policy'
  | 'tnp-audit'
  // Company Portal Tabs
  | 'company-dashboard'
  | 'company-profile'
  | 'company-create-drive'
  | 'company-applicants'
  | 'company-offers';

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'In-Progress' | 'Selected' | 'Rejected' | 'SHORTLISTED' | 'ACCEPTED' | 'DECLINED' | string;
  date: string;
  logo: string;
  logoBg: string;
  location?: string;
  ctc?: string;
  currentRoundName?: string;
  eligibilitySnapshot?: any;
}

export interface JobListing {
  id: string;
  company: string;
  role: string;
  location: string;
  ctc: string;
  deadline: string;
  logoBg: string;
  logoText: string;
  tags: string[];
  eligibility?: any;
  status?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  activeDrives: number;
  avgPackage: string;
  logoBg: string;
  logoText: string;
  verificationStatus?: string;
  headOffice?: string;
  hrName?: string;
  hrEmail?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  priority?: string;
}
