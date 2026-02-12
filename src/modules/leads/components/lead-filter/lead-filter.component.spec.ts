import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadFilterComponent } from './lead-filter.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LeadFilterComponent', () => {
  let component: LeadFilterComponent;
  let fixture: ComponentFixture<LeadFilterComponent>;
  
  // Create a mock for MatDialogRef
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LeadFilterComponent,
        NoopAnimationsModule // Add if using animations
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} } // Add if your component uses dialog data
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add additional tests for your dialog functionality
  it('should close dialog when calling close()', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});