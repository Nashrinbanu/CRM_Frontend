import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { OtpVerificationComponent } from '../otp-verification/otp-verification.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-back-drop',
  standalone: true,
  imports: [
    LoginComponent,
    OtpVerificationComponent,
    SignUpComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterLinkActive,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './back-drop.component.html',
  styleUrl: './back-drop.component.scss'
})
export class BackDropComponent implements OnInit {
  public currentView: 'signup' | 'login' | 'otp' = 'login';
  public email!: string;
  isBrowser!: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (typeof window !== 'undefined') {
      console.log(window.innerWidth);
    }
  }

  onSignupSuccess() {
    this.currentView = 'login';
  }

  onLoginSuccess(email: string) {
    this.email = email;
    this.currentView = 'otp';
  }

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('crmAuthToken');
      return !!token;
    }
    return false;
  }

  

  
}

