import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  tenantService = inject(TenantService);
  router = inject(Router);

  email = '';
  password = '';
  loading = false;

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.role === 'ROLE_ADMIN' || res.role === 'ROLE_SUPER_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (res.role === 'ROLE_INSTRUCTOR') {
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
