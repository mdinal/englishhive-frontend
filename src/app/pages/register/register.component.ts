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

  fullName = '';
  email = '';
  password = '';
  targetExam = 'IELTS_ACADEMIC';
  targetScore = 'Band 8.0';
  loading = false;

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) return;
    this.loading = true;
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      targetExam: this.targetExam,
      targetScore: this.targetScore
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/student-dashboard']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
