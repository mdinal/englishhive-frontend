import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_TENANTS, Tenant } from '../models/tenant.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = 'http://localhost:8080/api/v1/tenants';

  tenants = signal<Tenant[]>(DEFAULT_TENANTS);
  currentTenant = signal<Tenant>(DEFAULT_TENANTS[0]);

  constructor(private http: HttpClient) {
    // Load persisted tenant or default
    const savedTenantId = localStorage.getItem('englishhive_tenant_id');
    if (savedTenantId) {
      const match = DEFAULT_TENANTS.find(t => t.id === savedTenantId);
      if (match) {
        this.selectTenant(match);
      }
    }
  }

  fetchTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiUrl).pipe(
      tap(res => {
        if (res && res.length > 0) {
          this.tenants.set(res);
        }
      })
    );
  }

  selectTenant(tenant: Tenant) {
    this.currentTenant.set(tenant);
    localStorage.setItem('englishhive_tenant_id', tenant.id);
    // Dynamically inject CSS variables for White-Labeling
    document.documentElement.style.setProperty('--primary-brand', tenant.primaryColor || '#10B981');
    document.documentElement.style.setProperty('--primary-glow', `${tenant.primaryColor}38` || 'rgba(16, 185, 129, 0.22)');
  }
}
