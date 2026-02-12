import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMessageComponent } from './data-message.component';

describe('DataMessageComponent', () => {
  let component: DataMessageComponent;
  let fixture: ComponentFixture<DataMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
