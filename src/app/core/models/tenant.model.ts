export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string;
  primaryColor: string;
  tagline: string;
  plan: string;
  maxStudents: number;
  active: boolean;
}

export const DEFAULT_TENANTS: Tenant[] = [
  {
    id: 'default-campus',
    name: 'EnglishHive Global Campus',
    subdomain: 'global',
    logoUrl: 'assets/logos/englishhive-logo.svg',
    primaryColor: '#10b981',
    tagline: 'Global Language Academy & Exam Preparation Hub',
    plan: 'ENTERPRISE',
    maxStudents: 50000,
    active: true
  },
  {
    id: 'oxford-academy',
    name: 'Oxford International Language Academy',
    subdomain: 'oxford',
    logoUrl: 'assets/logos/oxford-logo.svg',
    primaryColor: '#3b82f6',
    tagline: 'Excellence in IELTS, PTE & Academic English',
    plan: 'CAMPUS_PRO',
    maxStudents: 10000,
    active: true
  },
  {
    id: 'apex-institute',
    name: 'Apex Global Test Prep Institute',
    subdomain: 'apex',
    logoUrl: 'assets/logos/apex-logo.svg',
    primaryColor: '#8b5cf6',
    tagline: 'Fast-Track High Band Score Preparation',
    plan: 'ENTERPRISE',
    maxStudents: 25000,
    active: true
  }
];
