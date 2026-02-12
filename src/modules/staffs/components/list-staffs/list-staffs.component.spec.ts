import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStaffsComponent } from './list-staffs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';

describe('ListStaffsComponent', () => {
  let component: ListStaffsComponent;
  let fixture: ComponentFixture<ListStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListStaffsComponent,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatSortModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ListStaffsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should define displayedColumns correctly', () => {
    expect(component.displayedColumns).toEqual([
      'staffId',
      'staffName',
      'mobileNumber',
      'emailId',
      'designation',
      'department',
      'date_of_joining',
      'status',
    ]);
  });

  it('should instantiate dataSource as a MatTableDataSource', () => {
    expect(component.dataSource).toBeTruthy();
    expect(component.dataSource.constructor.name).toBe('MatTableDataSource');
  });

  it('should have isLoading default to false', () => {
    expect(component.isLoading).toBeFalse();
  });

it('should flip isLoading to true on init', () => {
  fixture.detectChanges();
  expect(component.isLoading).toBeTrue();
});

  it('should have pageIndex default to 0', () => {
    expect(component.pageIndex).toBe(0);
  });

  it('should set pageSize to environment default and populate pageSizeOptions', () => {
    expect(component.pageSize).toBe(environment.pageSizeOptions[0]);
    expect(component.pageSizeOptions).toEqual(environment.pageSizeOptions);
  });

  it('should have totalCount and totalPages undefined initially', () => {
    expect(component.totalCount).toBeUndefined();
    expect(component.totalPages).toBeUndefined();
  });

  it('should expose staff message correctly', () => {
    expect(component.staff).toBe('hi... im from staff');
  });

});
