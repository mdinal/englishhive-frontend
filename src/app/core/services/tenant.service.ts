import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_TENANTS, Tenant } from '../models/tenant.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = `${environment.apiUrl}/tenants`;

  tenants = signal<Tenant[]>(DEFAULT_TENANTS);
  currentTenant = signal<Tenant>(DEFAULT_TENANTS[0]);

  constructor(private http: HttpClient) {
    this.detectCampusFromUrl();
  }

  /**
   * Automatically resolves campus/tenant based on URL subdomain or query parameters.
   * e.g., oxford.englishhive.com -> 'oxford'
   * e.g., englishhive.com/?campus=oxford -> 'oxford'
   */
  detectCampusFromUrl(): void {
    if (typeof window === 'undefined') {
      return;
    }

    let detectedIdentifier: string | null = null;

    // 1. Check URL Query Parameters (?campus=oxford, ?tenant=apex, ?institution=oxford)
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('campus') || urlParams.get('tenant') || urlParams.get('institution');
    if (queryParam) {
      detectedIdentifier = queryParam.trim().toLowerCase();
    }

    // 2. Check Subdomain (e.g. oxford.englishhive.com or apex.domain.com)
    if (!detectedIdentifier) {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      if (parts.length > 2) {
        const sub = parts[0].toLowerCase();
        if (sub !== 'www' && sub !== 'app' && sub !== 'api' && sub !== 'dev' && sub !== 'staging') {
          detectedIdentifier = sub;
        }
      }
    }

    // 3. Match against known tenants or fallback to saved / default
    if (detectedIdentifier) {
      const match = this.tenants().find(t =>
        t.subdomain.toLowerCase() === detectedIdentifier ||
        t.id.toLowerCase() === detectedIdentifier ||
        t.name.toLowerCase().includes(detectedIdentifier!)
      );

      if (match) {
        this.selectTenant(match);
        return;
      }
    }

    // 4. Check previously saved tenant or default
    const savedTenantId = localStorage.getItem('englishhive_tenant_id');
    if (savedTenantId) {
      const match = this.tenants().find(t => t.id === savedTenantId);
      if (match) {
        this.selectTenant(match);
        return;
      }
    }

    // Default to the primary campus
    this.selectTenant(DEFAULT_TENANTS[0]);
  }

  fetchTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiUrl).pipe(
      tap(res => {
        if (res && res.length > 0) {
          this.tenants.set(res);
          this.detectCampusFromUrl();
        }
      })
    );
  }

  selectTenant(tenant: Tenant) {
    this.currentTenant.set(tenant);
    localStorage.setItem('englishhive_tenant_id', tenant.id);

    // Dynamically inject CSS variables for White-Labeling
    if (typeof document !== 'undefined') {
      const primary = tenant.primaryColor || '#002d62';
      document.documentElement.style.setProperty('--primary-brand', primary);
      document.documentElement.style.setProperty('--primary-glow', `${primary}2e`);
      document.documentElement.style.setProperty('--primary-light', `${primary}14`);
    }
  }
}
