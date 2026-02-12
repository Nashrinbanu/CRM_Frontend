import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateLeadsComponent } from './update-leads.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('UpdateLeadsComponent', () => {
  let component: UpdateLeadsComponent;
  let fixture: ComponentFixture<UpdateLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateLeadsComponent,
        NoopAnimationsModule  // <-- Add this line
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
