import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerificationComponent } from './otp-verification.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth.service';
import { NotificatonService } from '../../../leads/services/notificaton.service';
import { of, throwError } from 'rxjs';

describe('OtpVerificationComponent', () => {
  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificatonService>;

  beforeEach(async () => {
    // Create spies for your services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyOtp']);
    notificationServiceSpy = jasmine.createSpyObj('NotificatonService', ['showSuccessMessage']);

    await TestBed.configureTestingModule({
      imports: [
        OtpVerificationComponent, // Standalone component import
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatCardModule,
        NoopAnimationsModule // Required for Material animations in tests
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificatonService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;

    // Provide an email input explicitly for testing, since your component expects it
    component.email = 'test@example.com';

    fixture.detectChanges();  // Run change detection including ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize otpForm with 4 controls', () => {
    expect(component.otpForm).toBeDefined();
    expect(Object.keys(component.otpForm.controls)).toEqual(['digit1', 'digit2', 'digit3', 'digit4']);
  });

  it('should validate each digit as required and pattern', () => {
    const digits = ['digit1', 'digit2', 'digit3', 'digit4'];
    digits.forEach(digit => {
      const control = component.otpForm.get(digit);
      expect(control?.valid).toBeFalse();
      expect(control?.errors?.['required']).toBeTrue();

      control?.setValue('a');
      expect(control?.valid).toBeFalse();
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('5');
      expect(control?.valid).toBeTrue();
    });
  });

  it('should call authService.verifyOtp on verifyOtp', () => {
    // Set form values
    component.otpForm.setValue({ digit1: '1', digit2: '2', digit3: '3', digit4: '4' });
    // Mock service response
    authServiceSpy.verifyOtp.and.returnValue(of({ data: { token: 'fake-token' } }));

    component.verifyOtp();

    expect(component.isLoading).toBeTrue();
    expect(authServiceSpy.verifyOtp).toHaveBeenCalledWith('test@example.com', '1234');
  });

  it('should handle verifyOtp error correctly', () => {
    component.otpForm.setValue({ digit1: '1', digit2: '2', digit3: '3', digit4: '4' });
    authServiceSpy.verifyOtp.and.returnValue(throwError(() => new Error('Invalid OTP')));

    component.verifyOtp();

    expect(component.isLoading).toBeFalse();
    expect(notificationServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Please enter a valid OTP!');
  });
});
