import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule // Provides router dependencies including ActivatedRoute
      ],
      providers: [
        // Provide a mock ActivatedRoute if your component needs specific route data
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
              params: {},
              queryParams: {},
              fragment: null,
              outlet: '',
              routeConfig: null,
              root: null,
              parent: null,
              firstChild: null,
              children: [],
              paramMap: new Map(),
              queryParamMap: new Map(),
              url: []
            }
          }
        }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add your component-specific tests here
  it('should display the logo', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo')).toBeTruthy();
  });
});