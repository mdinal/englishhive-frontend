import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthResponse, User, Role } from '../models/auth.model';
import { ToastService } from './toast.service';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

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
      catchError(err => {
        const msg = err.error?.message || 'Invalid email or password';
        this.toast.error('Authentication Failed', msg);
        return throwError(() => err);
      })
    );
  }

  register(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => {
        this.handleAuthSuccess(res);
        this.toast.success('Account Created', `Welcome to EnglishHive, ${res.fullName}!`);
      }),
      catchError(err => {
        const msg = err.error?.message || 'Registration failed. Please check your inputs.';
        this.toast.error('Registration Failed', msg);
        return throwError(() => err);
      })
    );
  }

  private handleAuthSuccess(res: AuthResponse) {
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

  // Quick 1-Click Demo Logins
  loginAsStudent() {
    this.login({ email: 'student@englishhive.com', password: 'password123' }).subscribe(() => {
      this.router.navigate(['/student-dashboard']);
    });
  }

  loginAsInstructor() {
    this.login({ email: 'instructor@englishhive.com', password: 'password123' }).subscribe(() => {
      this.router.navigate(['/instructor-dashboard']);
    });
  }

  loginAsAdmin() {
    this.login({ email: 'admin@englishhive.com', password: 'password123' }).subscribe(() => {
      this.router.navigate(['/admin-dashboard']);
    });
  }
}
