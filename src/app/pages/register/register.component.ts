import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  accountType: 'STUDENT' | 'TEACHER' = 'STUDENT';
  fullName = '';
  email = '';
  password = '';
  targetExam = 'IELTS_ACADEMIC';
  targetScore = 'Band 8.0';
  loading = false;

  setAccountType(type: 'STUDENT' | 'TEACHER') {
    this.accountType = type;
    if (type === 'TEACHER') {
      this.targetExam = 'IELTS Speaking & Writing';
      this.targetScore = 'British Council Certified Examiner';
    } else {
      this.targetExam = 'IELTS_ACADEMIC';
      this.targetScore = 'Band 8.0';
    }
  }

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) return;
    this.loading = true;

    const role = this.accountType === 'TEACHER' ? 'ROLE_INSTRUCTOR' : 'ROLE_STUDENT';

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: role,
      targetExam: this.targetExam,
      targetScore: this.targetScore
    }).subscribe({
      next: () => {
        this.loading = false;
        if (role === 'ROLE_INSTRUCTOR') {
          this.router.navigate(['/instructor-dashboard']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
