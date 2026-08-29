import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tenantInterceptor } from './core/interceptors/tenant.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { telemetryInterceptor } from './core/interceptors/telemetry.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(
      withInterceptors([tenantInterceptor, authInterceptor, telemetryInterceptor])
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
