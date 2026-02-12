import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {  // Ensure it's running in the browser
    const token = localStorage.getItem('crmAuthToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const isExpired = payload.exp * 1000 < Date.now(); 

        if (isExpired) {
          localStorage.removeItem('crmAuthToken');
          router.navigate(['/login']);
          return false;
        }

        return true; 
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('crmAuthToken');
        router.navigate(['/login']);
        return false;
      }
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  return false; // Default to false in SSR context
};
