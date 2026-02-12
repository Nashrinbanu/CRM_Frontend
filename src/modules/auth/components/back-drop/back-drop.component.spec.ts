import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';   // ✅
import { BackDropComponent } from './back-drop.component';

describe('BackDropComponent', () => {
  let component: BackDropComponent;
  let fixture: ComponentFixture<BackDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // ✅ supplies HttpClient
        BackDropComponent         // standalone component
      ]
      // No extra providers needed—AuthService will be resolved automatically
    }).compileComponents();

    fixture = TestBed.createComponent(BackDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
