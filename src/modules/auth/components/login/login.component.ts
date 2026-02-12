import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificatonService } from '../../../leads/services/notificaton.service';


@Component({
  selector: 'app-login',
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
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm: FormGroup;
  public isLoading: boolean = false;
  public hide: boolean = true;
  @Output() loginSuccess = new EventEmitter<string>();
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificatonService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;

    if (!password) {
      return { 'required': true };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?~`-]/.test(password);
    const minLength = password.length >= 8;
    const hasNoSpaces = !/\s/.test(password);
    if (!minLength) {
      return { 'minlength': true };
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar || !hasNoSpaces) {
      return { 'passwordStrength': true };
    }

    return null;
  }

  // login() {
  //   this.loginForm.markAllAsTouched();

  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   if (this.loginForm.valid) {
  //     this.isLoading = true;

  //     let params: any = {
  //       emailId: this.loginForm.value.email,
  //       password: this.loginForm.value.password,
  //     };

  //     this.authService.login(params).subscribe({
  //       next: () => {
  //         this.notificationService.showSuccessMessage('Login successful. Redirecting to your OTP...');
  //         this.loginSuccess.emit(this.loginForm.value.email);
  //       },
  //       error: (err: any) => {
  //         const msg = err.error.detail || 'Invalid User credentials, Please try again with valid credentials!';
  //         this.notificationService.showSuccessMessage(msg);
  //         this.isLoading = false;
  //       },
  //     });
  //   }
  // }
  private autoVerifyAdminOtp(email: string) {
    this.authService.verifyOtp(email, '1234').subscribe({
      next: (response) => {
        this.notificationService.showSuccessMessage('Admin auto-login successful.');
        const token = response.data.token;
        localStorage.setItem('crmAuthToken', token);
        this.router.navigate(['/leads']); // Redirect to leads page directly
      },
      error: () => {
        this.notificationService.showError('Failed to auto-login admin.');
        this.isLoading = false;
      },
    });
  }
  
  login() {
    this.loginForm.markAllAsTouched();
  
    if (this.loginForm.invalid) {
      return;
    }
  
    if (this.loginForm.valid) {
      this.isLoading = true;
  
      let params: any = {
        emailId: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
  
      this.authService.login(params).subscribe({
        next: (response) => {
          const email = this.loginForm.value.email;
          this.notificationService.showSuccessMessage('Login successful.');
  
          // If admin email, auto-verify OTP and skip OTP page
          if (email === 'crmsuperadmin@shenll.com') {
            this.autoVerifyAdminOtp(email);
          } else {
            this.loginSuccess.emit(email);
            this.router.navigate(['/otp'], { queryParams: { email } });
          }
          this.isLoading = false;
        },
        error: (err: any) => {
          const msg = err.error.detail || 'Invalid User credentials, Please try again!';
          this.notificationService.showSuccessMessage(msg);
          this.isLoading = false;
        },
      });
    }
  }
  
}
