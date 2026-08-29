import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TenantService } from '../../core/services/tenant.service';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { Tenant } from '../../core/models/tenant.model';

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

  showTenantDropdown = false;

  get dashboardLink(): string {
    if (this.authService.isAdmin()) return '/admin-dashboard';
    if (this.authService.isInstructor()) return '/instructor-dashboard';
    return '/student-dashboard';
  }

  toggleTenantDropdown() {
    this.showTenantDropdown = !this.showTenantDropdown;
  }

  selectTenant(tenant: Tenant) {
    this.tenantService.selectTenant(tenant);
    this.showTenantDropdown = false;
  }
}
