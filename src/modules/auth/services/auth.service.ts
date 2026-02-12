import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static getToken() {
    throw new Error('Method not implemented.');
  }
  private loginEndPoint = `${environment.apiUrl}auth/user/login`;
  private apiUrl = `${environment.apiUrl}auth/user/verifyOtp`

  constructor(private http :HttpClient) { }
  
  login(params:any):Observable<any>{
    return this.http.post<any[]>(`${this.loginEndPoint}`,params)
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authCrmToken');
  }

  verifyOtp(emailId: string, code: any): Observable<any> {
    return this.http.post<any>(this.apiUrl,  { emailId, code });
  }

  saveToken(token: string): void {
    localStorage.setItem('crmAuthToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('crmAuthToken');
  }

  clearToken(): void {
    localStorage.removeItem('crmAuthToken');
  }
}
