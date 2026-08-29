import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const telemetryInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  const clientTraceId = 'trace-' + Math.random().toString(36).substring(2, 10);

  const telemetryReq = req.clone({
    setHeaders: {
      'X-Trace-Id': clientTraceId
    }
  });

  return next(telemetryReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const elapsed = Date.now() - startTime;
        if (elapsed > 2000) {
          console.warn(`[SLOW_API_WARNING] ${req.method} ${req.url} took ${elapsed}ms (Trace: ${clientTraceId})`);
        }
      }
    })
  );
};
