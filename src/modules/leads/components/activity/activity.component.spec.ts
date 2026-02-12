import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivityComponent } from './activity.component';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActivityComponent,
        HttpClientTestingModule // For any HTTP dependencies in the component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;

    // Provide mock activities data - IMPORTANT to prevent 'not iterable' error
    component.activities = [
      { type: 'call', date: new Date() },
      { type: 'email', date: new Date() }
    ];

    fixture.detectChanges();  // triggers ngOnInit and runs aggregateActivities
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
