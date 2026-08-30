import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TenantService } from '../../core/services/tenant.service';
import { MarketplaceService } from '../../core/services/marketplace.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  tenantService = inject(TenantService);
  marketplaceService = inject(MarketplaceService);

  get dashboardLink(): string {
    if (this.authService.isAdmin()) return '/admin-dashboard';
    if (this.authService.isInstructor()) return '/instructor-dashboard';
    return '/student-dashboard';
  }
}
