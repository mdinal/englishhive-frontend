import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);
  private zone = inject(NgZone);

  handleError(error: any): void {
    console.error('[UNCAUGHT_CLIENT_EXCEPTION]', error);

    // Run within NgZone to ensure UI updates reliably
    this.zone.run(() => {
      const message = error?.message || 'An unexpected client error occurred.';
      // Don't show toast for benign cancellation errors
      if (!message.includes('ResizeObserver') && !message.includes('Navigation cancelled')) {
        this.toast.error('Application Notice', message);
      }
    });
  }
}
