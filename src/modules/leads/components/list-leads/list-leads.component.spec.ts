import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLeadsComponent } from './list-leads.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LeadsService } from '../../services/leads.service'; // Import your service
import { environment } from '../../../../environments/environment';

describe('ListLeadsComponent', () => {
  let component: ListLeadsComponent;
  let fixture: ComponentFixture<ListLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListLeadsComponent,
        HttpClientTestingModule, // Add this import
      ],
      // If LeadsService is not providedIn: 'root', add it here:
      providers: [LeadsService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListLeadsComponent);
    component = fixture.componentInstance;
  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

it('should have isDropdownOpen default to false', () => {
  expect(component.isDropdownOpen).toBeFalse();
});

it('should have isLoading default to false before init', () => {
  expect(component.isLoading).toBeFalse();
});

// then, in other tests you can call detectChanges to test post-init behavior
it('should flip isLoading to true on init', () => {
  fixture.detectChanges();
  expect(component.isLoading).toBeTrue();
});

  it('should have selectedStatus default to empty string', () => {
    expect(component.selectedStatus).toBe('');
  });

  it('should define statuses array with correct entries', () => {
    expect(component.statuses).toEqual([
      { value: '', label: 'All Status' },
      { value: 'NEW', label: 'New' },
      { value: 'CONTACTED', label: 'Contacted' },
      { value: 'QUALIFIED', label: 'Qualified' },
      { value: 'NEGOTIATION', label: 'Negotiation' },
      { value: 'WON', label: 'Won' },
      { value: 'LOST', label: 'Lost' },
    ]);
  });

  it('should have selectedOption default to "Technology"', () => {
    expect(component.selectedOption).toBe('Technology');
  });

  it('should define options array correctly', () => {
    expect(component.options).toEqual([
      'Technology',
      'Finance',
      'Healthcare & Pharmaceuticals',
      'Finance & Banking',
    ]);
  });

  it('should define displayedColumns correctly', () => {
    expect(component.displayedColumns).toEqual([
      'sno',
      'leadId',
      'leadName',
      'accountName',
      'mobileNumber',
      'email',
      'score',
      'createdDate',
      'status',
    ]);
  });

  it('should instantiate dataSource as a MatTableDataSource', () => {
    expect(component.dataSource).toBeTruthy();
    expect(component.dataSource.constructor.name).toBe('MatTableDataSource');
  });

  it('should have pageIndex default to 0', () => {
    expect(component.pageIndex).toBe(0);
  });

  it('should set pageSize from environment', () => {
    expect(component.pageSize).toBe(environment.pageSizeOptions[0]);
    expect(component.pageSizeOptions).toEqual(environment.pageSizeOptions);
  });

  it('should have totalCount and totalPages undefined initially', () => {
    expect(component.totalCount).toBeUndefined();
    expect(component.totalPages).toBeUndefined();
  });

  it('should define statusColorMap with expected keys', () => {
    expect(Object.keys(component.statusColorMap)).toEqual([
      'In Progress',
      'Completed',
      'Converted',
      'Recycled',
    ]);
  });

  it('should have filter fields default to empty or undefined', () => {
    expect(component.filterStatus).toBe('');
    expect(component.filterCompanyName).toBe('');
    expect(component.filterAssignedTo).toBe('');
    expect(component.filterIndustryType).toBeUndefined();
    expect(component.filterId).toBeUndefined();
    expect(component.filterFromDate).toBeUndefined();
    expect(component.filterToDate).toBeUndefined();
  });

  it('should initialize view flags correctly', () => {
    expect(typeof component.isMobileView).toBe('boolean');
    expect(component.isFilterOpen).toBeFalse();
    expect(component.isSearchOpen).toMatch(/true|false/);
    expect(component.isFilterVisible).toBeFalse();
  });

  it('should call checkScreenSize, getLeads, and checkScreenSize1 on init', () => {
  const checkScreenSizeSpy = spyOn(component, 'checkScreenSize');
  const getLeadsSpy = spyOn(component, 'getLeads');
  const checkScreenSize1Spy = spyOn(component, 'checkScreenSize1');

  fixture.detectChanges(); // triggers ngOnInit()

  expect(checkScreenSizeSpy).toHaveBeenCalled();
  expect(getLeadsSpy).toHaveBeenCalledWith(component.event);
  expect(checkScreenSize1Spy).toHaveBeenCalled();
});

it('should add resize event listener on window during ngOnInit', () => {
  const addEventListenerSpy = spyOn(window, 'addEventListener');
  fixture.detectChanges(); // triggers ngOnInit()
  expect(addEventListenerSpy).toHaveBeenCalledWith('resize', component.checkScreenSize1);
});

});
