import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtServiceService {

  decodeToken(token: any): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid JWT Token', error);
      return null;
    }
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded: any = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  }

  isTokenExpired(token: any): boolean {
    const expiryDate = this.getTokenExpirationDate(token);
    if (!expiryDate) return true;
    return expiryDate < new Date();
  }
}
