import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLeadsModalsComponent } from './import-leads-modals.component';

describe('ImportLeadsModalsComponent', () => {
  let component: ImportLeadsModalsComponent;
  let fixture: ComponentFixture<ImportLeadsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportLeadsModalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportLeadsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
