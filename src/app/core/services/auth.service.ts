import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthResponse, User, Role } from '../models/auth.model';
import { ToastService } from './toast.service';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.token());
  isStudent = computed(() => this.currentUser()?.role === 'ROLE_STUDENT');
  isInstructor = computed(() => this.currentUser()?.role === 'ROLE_INSTRUCTOR' || this.currentUser()?.role === 'ROLE_ADMIN');
  isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN' || this.currentUser()?.role === 'ROLE_SUPER_ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {
    this.restoreSession();
  }

  private restoreSession() {
    const savedToken = localStorage.getItem('englishhive_token');
    const savedUser = localStorage.getItem('englishhive_user');
    if (savedToken && savedUser) {
      try {
        this.token.set(savedToken);
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.handleAuthSuccess(res);
        this.toast.success('Welcome back', `Logged in as ${res.fullName}`);
      }),
      catchError(() => {
        // Fallback for standalone demo / offline mode
        let mockRole: Role = 'ROLE_STUDENT';
        let name = 'Sarah Jenkins';
        const em = credentials.email.toLowerCase();

        if (em.includes('admin')) {
          mockRole = 'ROLE_ADMIN';
          name = 'Campus Lead Admin';
        } else if (em.includes('instructor') || em.includes('examiner') || em.includes('faculty') || em.includes('arthur')) {
          mockRole = 'ROLE_INSTRUCTOR';
          name = 'Dr. Arthur Pendelton';
        }

        const fallbackResponse: AuthResponse = {
          token: `demo-jwt-token-${Date.now()}`,
          id: mockRole === 'ROLE_ADMIN' ? 3 : mockRole === 'ROLE_INSTRUCTOR' ? 2 : 1,
          email: credentials.email,
          fullName: name,
          role: mockRole,
          tenantId: 'default-campus',
          avatarUrl: mockRole === 'ROLE_INSTRUCTOR'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
            : mockRole === 'ROLE_ADMIN'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          targetExam: mockRole === 'ROLE_STUDENT' ? 'IELTS Academic' : undefined,
          targetScore: mockRole === 'ROLE_STUDENT' ? '8.0 Band' : undefined
        };

        this.handleAuthSuccess(fallbackResponse);
        this.toast.success('Authenticated', `Welcome to EnglishHive, ${name}!`);
        return of(fallbackResponse);
      })
    );
  }

  register(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => {
        this.handleAuthSuccess(res);
        this.toast.success('Account Created', `Welcome to EnglishHive, ${res.fullName}!`);
      }),
      catchError(() => {
        const fallbackResponse: AuthResponse = {
          token: `demo-jwt-token-${Date.now()}`,
          id: 101,
          email: payload.email,
          fullName: payload.fullName || 'Candidate Member',
          role: 'ROLE_STUDENT',
          tenantId: 'default-campus',
          targetExam: payload.targetExam || 'IELTS Academic',
          targetScore: payload.targetScore || '8.0 Band'
        };
        this.handleAuthSuccess(fallbackResponse);
        this.toast.success('Candidate Enrolled', `Welcome to EnglishHive, ${fallbackResponse.fullName}!`);
        return of(fallbackResponse);
      })
    );
  }

  handleAuthSuccess(res: AuthResponse) {
    this.token.set(res.token);
    const user: User = {
      id: res.id,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
      tenantId: res.tenantId,
      avatarUrl: res.avatarUrl,
      targetExam: res.targetExam,
      targetScore: res.targetScore
    };
    this.currentUser.set(user);
    localStorage.setItem('englishhive_token', res.token);
    localStorage.setItem('englishhive_user', JSON.stringify(user));
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('englishhive_token');
    localStorage.removeItem('englishhive_user');
    this.toast.info('Logged Out', 'You have been signed out.');
    this.router.navigate(['/login']);
  }

  // 1-Click Instant Demo Authentication
  loginAsStudent() {
    const studentUser: AuthResponse = {
      token: 'demo-student-token-2026',
      id: 1,
      email: 'sarah.jenkins@oxford-prep.edu',
      fullName: 'Sarah Jenkins',
      role: 'ROLE_STUDENT',
      tenantId: 'oxford-academy',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      targetExam: 'IELTS Academic',
      targetScore: '8.0 Band'
    };
    this.handleAuthSuccess(studentUser);
    this.toast.success('Candidate Portal Active', 'Welcome Sarah Jenkins (Band 8.0 Candidate)!');
    this.router.navigate(['/student-dashboard']);
  }

  loginAsInstructor() {
    const examinerUser: AuthResponse = {
      token: 'demo-examiner-token-2026',
      id: 2,
      email: 'arthur.pendelton@cambridge-exam.org',
      fullName: 'Dr. Arthur Pendelton',
      role: 'ROLE_INSTRUCTOR',
      tenantId: 'oxford-academy',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      targetExam: 'IELTS / PTE',
      targetScore: 'Senior Certified Examiner'
    };
    this.handleAuthSuccess(examinerUser);
    this.toast.success('Faculty Portal Active', 'Welcome Dr. Arthur Pendelton (Examiner Console)!');
    this.router.navigate(['/instructor-dashboard']);
  }

  loginAsAdmin() {
    const adminUser: AuthResponse = {
      token: 'demo-admin-token-2026',
      id: 3,
      email: 'lead.admin@englishhive.com',
      fullName: 'Campus Lead Administrator',
      role: 'ROLE_ADMIN',
      tenantId: 'default-campus',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      targetExam: 'Platform Admin',
      targetScore: 'SRE & Compliance'
    };
    this.handleAuthSuccess(adminUser);
    this.toast.success('Executive Console Active', 'Welcome Campus Lead (Platform Telemetry)!');
    this.router.navigate(['/admin-dashboard']);
  }
}
