export type ActiveTab = 
  | 'dashboard'
  | 'profile'
  | 'job-listings'
  | 'my-applications'
  | 'companies'
  | 'placement-drive'
  | 'resources'
  | 'training-skills'
  | 'messages'
  | 'settings';

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'In-Progress' | 'Selected' | 'Rejected';
  date: string;
  logo: string;
  logoBg: string;
  location?: string;
  ctc?: string;
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
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  activeDrives: number;
  avgPackage: string;
  logoBg: string;
  logoText: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}
