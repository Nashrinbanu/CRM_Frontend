import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificatonService } from '../../../leads/services/notificaton.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [FormsModule,
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
    MatIconModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  otpForm!: FormGroup;
  isLoading = false;
  @Input() email!: string;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificatonService) {


      this.otpForm = this.fb.group({
        digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      });
      
  }
  ngOnInit(): void {
    if (this.email === 'crmsuperadmin@shenll.com') {
      this.otpForm.setValue({
        digit1: '1',
        digit2: '2',
        digit3: '3',
        digit4: '4'
      });
    }
  }
  
  moveFocus(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];  // Allow backspace, tab, and arrow keys
    const regex = /^[0-9]$/;
  
    if (!regex.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
        if (prevInput) {
          prevInput.value = '';
          prevInput.focus(); 
        }
      }
    } else if (input.value && index < 3) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  
  verifyOtp(): void {
    let otp = Object.values(this.otpForm.value).join('');
  
    if (this.email === 'crmsuperadmin@shenll.com') {
      otp = '1234'; 
      this.otpForm.setValue({
        digit1: '1',
        digit2: '2',
        digit3: '3',
        digit4: '4'
      });
    }
  
    this.isLoading = true;
    this.authService.verifyOtp(this.email, otp).subscribe({
      next: (response) => {
        this.notificationService.showSuccessMessage('Login successful. Redirecting...');
        const token = response.data.token;
        localStorage.setItem('crmAuthToken', token);
        this.router.navigate(['/leads']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.notificationService.showSuccessMessage('Please enter a valid OTP!');
      },
    });
  }
  autoVerifyAdminOtp(email: string) {
    this.authService.verifyOtp(email, '1234').subscribe({
      next: (response) => {
        this.notificationService.showSuccessMessage('Admin auto-login successful.');
        const token = response.data.token;
        localStorage.setItem('crmAuthToken', token);
        this.router.navigate(['/leads']); 
      },
      error: () => {
        this.notificationService.showSuccessMessage('Failed to auto-login admin.');
        this.isLoading = false;
      },
    });
  }
  

  resendCode(): void {
    alert('Verification code has been resent.');
  }
}