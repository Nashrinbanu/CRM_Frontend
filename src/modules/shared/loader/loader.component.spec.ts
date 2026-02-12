import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Add if using Angular Material

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoaderComponent,
        HttpClientTestingModule, // Provides HttpClient mock
        MatProgressSpinnerModule // Only if using Angular Material spinner
      ],
      providers: [
        // Add any other services your component needs
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-progress-spinner')).toBeTruthy(); // Adjust selector based on your template
  });
});