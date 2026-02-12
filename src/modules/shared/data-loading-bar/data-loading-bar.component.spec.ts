import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLoadingBarComponent } from './data-loading-bar.component';

describe('DataLoadingBarComponent', () => {
  let component: DataLoadingBarComponent;
  let fixture: ComponentFixture<DataLoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLoadingBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataLoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
