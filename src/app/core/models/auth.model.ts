export type Role = 'ROLE_STUDENT' | 'ROLE_INSTRUCTOR' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  tenantId: string;
  avatarUrl?: string;
  targetExam?: string;
  targetScore?: string;
  phoneNumber?: string;
  bio?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  fullName: string;
  role: Role;
  tenantId: string;
  avatarUrl?: string;
  targetExam?: string;
  targetScore?: string;
}
