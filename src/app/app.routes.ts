import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CoursePlayerComponent } from './pages/course-player/course-player.component';
import { MockInterviewsComponent } from './pages/mock-interviews/mock-interviews.component';
import { LiveRoomComponent } from './pages/live-room/live-room.component';
import { ScorecardReportComponent } from './pages/scorecard-report/scorecard-report.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { InstructorDashboardComponent } from './pages/instructor-dashboard/instructor-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'EnglishHive - Global Language Academy' },
  { path: 'login', component: LoginComponent, title: 'Sign In - EnglishHive Portal' },
  { path: 'register', component: RegisterComponent, title: 'Enroll - EnglishHive Candidate Portal' },
  { path: 'courses', component: CoursesComponent, title: 'Exam Masterclasses - EnglishHive' },
  { path: 'courses/:slug', component: CoursePlayerComponent, title: 'Masterclass Player - EnglishHive' },
  { path: 'mock-interviews', component: MockInterviewsComponent, title: '1-on-1 Examiner Mock Speaking - EnglishHive' },
  { path: 'live-room', component: LiveRoomComponent, title: 'Live Examination Room - EnglishHive' },
  { path: 'scorecard-report', component: ScorecardReportComponent, title: 'Verified Official Scorecard - EnglishHive' },
  { path: 'marketplace', component: MarketplaceComponent, title: 'Bookstore & Digital PDFs - EnglishHive' },
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent, 
    canActivate: [authGuard],
    title: 'Candidate Dashboard - EnglishHive'
  },
  { 
    path: 'instructor-dashboard', 
    component: InstructorDashboardComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_INSTRUCTOR', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])],
    title: 'Examiner Faculty Dashboard - EnglishHive'
  },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])],
    title: 'Campus Governance & SRE Telemetry - EnglishHive'
  },
  { path: '**', redirectTo: '' }
];
