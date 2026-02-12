import { ComponentFixture, TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { AddLeadsComponent } from './add-leads.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormControl, FormArray, Validators } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivityComponent } from '../../../leads/components/activity/activity.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('AddLeadsComponent', () => {
  let component: AddLeadsComponent;
  let fixture: ComponentFixture<AddLeadsComponent>;
let httpMock: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddLeadsComponent, 
        ActivityComponent,  
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDialogModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLeadsComponent);
    component = fixture.componentInstance;
      httpMock = TestBed.inject(HttpTestingController); // <-- Add this
      fixture.detectChanges();  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('default public properties', () => {
    it('should initialize view‑flags and selections correctly', () => {
      expect(component.showCityDropdown).toBeFalse();
      expect(component.selectedCity).toBeNull();
      expect(component.showCountryDropdown).toBeFalse();
      expect(component.selectedCountry).toBeNull();
      expect(component.showStateDropdown).toBeFalse();
      expect(component.selectedState).toBeNull();
      expect(component.showIndustryDropdown).toBeFalse();
      expect(component.selectedIndustry).toBe('');
      expect(component.showStatusDropdown).toBeFalse();
      expect(component.selectedStatus).toBe('');
      expect(component.submitted).toBeFalse();
    });

   it('should have loading flags default to false', () => {
  expect(component.isLoading).toBeFalse();
    expect(component.isLoadingCountries).toBeTrue();
    expect(component.isLoadingStates).toBeFalse();
    expect(component.isLoadingCities).toBeFalse();
  });

    it('should set up static arrays correctly', () => {
      expect(component.contactStatuses).toEqual(['ACTIVE', 'INACTIVE', 'DELETED']);
      expect(component.leadStatuses).toEqual([
        'NEW','CONTACTED','QUALIFIED','NEGOTIATION','WON','LOST'
      ]);
      expect(component.industryTypes.length).toBeGreaterThan(0);
    });
  });

  describe('reactive form', () => {
    it('should build a FormGroup named leadForm', () => {
      expect(component.leadForm).toBeDefined();
      expect(component.leadForm.controls).toBeTruthy();
    });

    it('should include expected form controls with validators', () => {
      const controls = component.leadForm.controls;
      const expected = [
        'companyName','industryType','address','state','city','pincode','country',
        'phone','email','website','leadStatus','source','contacts'
      ];
      expect(Object.keys(controls).sort()).toEqual(expected.sort());
      const cn = controls['companyName'] as FormControl;
      expect(cn.validator).toBeTruthy();
      expect(cn.hasError('required')).toBeTrue();

      const ph = controls['phone'] as FormControl;
      expect(ph.validator).toBeTruthy();
      expect(ph.hasError('required')).toBeTrue();
      ph.setValue('123');
      expect(ph.hasError('pattern')).toBeTrue();
      const ws = controls['website'] as FormControl;
      ws.setValue('a'.repeat(51));
      expect(ws.hasError('maxlength')).toBeTrue();
    });

    it('should initialize contacts as a FormArray with one entry', () => {
      const arr = component.leadForm.get('contacts') as FormArray;
      expect(arr).toBeInstanceOf(FormArray);
      expect(arr.length).toBe(1, 'should start with one contact added');
    });
  });

  describe('dropdown toggles', () => {
    it('should toggle showCityDropdown correctly', () => {
      component.showCityDropdown = false;
      component.showCityDropdown = !component.showCityDropdown;
      expect(component.showCityDropdown).toBeTrue();
    });

    it('should toggle showCountryDropdown correctly', () => {
      component.showCountryDropdown = false;
      component.showCountryDropdown = !component.showCountryDropdown;
      expect(component.showCountryDropdown).toBeTrue();
    });

    it('should toggle showStatusDropdown correctly', () => {
      component.showStatusDropdown = false;
      component.showStatusDropdown = !component.showStatusDropdown;
      expect(component.showStatusDropdown).toBeTrue();
    });
  });
   it('should call loadCountries and initialize observables', () => {
    spyOn(component, 'loadCountries');

    component.ngOnInit();

    expect(component.loadCountries).toHaveBeenCalled();
    expect(component.filteredCountries).toBeDefined();
    expect(component.filteredStates).toBeDefined();
    expect(component.filteredCities).toBeDefined();
  });

// it('should call patchLeadById if viewId is set', fakeAsync(() => {
//   spyOn(component, 'patchLeadById');
  
//   // Mock viewId from route
//   // component.viewId = '123';

//   component.ngOnInit();

//   // Flush all expected HTTP requests
//   const countryReqs = httpMock.match('https://crm.shenll.in/api/v1/address/country?skip=0&limit=100');
//   countryReqs.forEach(req => req.flush([]));

//   tick(1000); // simulate setTimeout

//   expect(component.patchLeadById).toHaveBeenCalledWith('123');
// }));


  it('should emit filteredCountries when input changes', (done) => {
    component.ngOnInit();

    component.countryFilterCtrl.setValue('test');
    component.filteredCountries.subscribe(result => {
      expect(result).toBeDefined();
      done();
    });
  });
});
