import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const crmAuthToken = localStorage.getItem("crmAuthToken");
  const isFormData = req.body instanceof FormData;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${crmAuthToken}`,
    'ngrok-skip-browser-warning': 'true',
  };
  if (!isFormData) {
    headers['Content-Type'] = req.headers.get('Content-Type') || 'application/json';
  }
  const authReq = req.clone({
    setHeaders: headers,
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error('Unauthorized request:', err);
        } else if (err.status === 0) {
          console.error('CORS error: No response from server');
        } else {
          console.error('HTTP error:', err);
        }
      } else {
        console.error('An error occurred:', err);
      }
      return throwError(() => err);
    })
  );
};
