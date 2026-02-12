import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  public createAccountForm: FormGroup;
  public isLoading = false;
  public hidePassword = true;
  @Output() signupSuccess = new EventEmitter<void>(); 
  constructor(private fb: FormBuilder, private router: Router) {
    this.createAccountForm = this.fb.group({
      firstName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  get firstName() {
    return this.createAccountForm.get('firstName');
  }

  get mobileNumber() {
    return this.createAccountForm.get('mobileNumber');
  }

  get email() {
    return this.createAccountForm.get('email');
  }

  get password() {
    return this.createAccountForm.get('password');
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) return null;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const minLength = password.length >= 8;

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar || !minLength) {
      return { passwordStrength: true };
    }
    return null;
  }

  createAccount(): void {
    if (this.createAccountForm.invalid ) return;

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      alert('Account created successfully!');
      this.isLoading = false;
      this.router.navigate(['/otp']);
    }, 2000);
  }
}
