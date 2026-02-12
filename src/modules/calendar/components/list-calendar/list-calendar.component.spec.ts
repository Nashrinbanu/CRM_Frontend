import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCalendarComponent } from './list-calendar.component';

describe('ListCalendarComponent', () => {
  let component: ListCalendarComponent;
  let fixture: ComponentFixture<ListCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
