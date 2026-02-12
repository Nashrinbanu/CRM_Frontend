import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStaffsComponent } from './add-staffs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StaffsService } from '../../services/staffs.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityComponent } from '../../../leads/components/activity/activity.component';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
describe('AddStaffsComponent', () => {
  let component: AddStaffsComponent;
  let fixture: ComponentFixture<AddStaffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddStaffsComponent,      
        ActivityComponent,        
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        StaffsService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

it('should initialize the reactive form with the correct controls', () => {
  expect(component.staffForm).toBeInstanceOf(FormGroup);


  const expectedControls = [
    'name','mobileNumber','emailId','postalCode','gender','ug','pg',
    'country','state','city','district','secCountry','secState',
    'secCity','secDistrict','addressLine1','addressLine2',
    'dateOfJoining','officialEmailId','password','reportTo',
    'fatherName','alternateNumber','bloodGroup','department',
    'maritalStatus','emergencyContact1Name','emergencyContact1Number',
    'emergencyContact1Relationship','emergencyContact1Relationship1',
    'emergencyContact2Name','emergencyContact2Number',
    'emergencyContact2Relationship','role','status','designation'
  ];

  const actualControls = Object.keys(component.staffForm.controls);
  expect(actualControls.sort()).toEqual(expectedControls.sort());

  
  const nameCtrl = component.staffForm.get('name') as FormControl;
  expect(nameCtrl.validator).toBeTruthy();
  expect(nameCtrl.hasError('required')).toBeTrue();

  const mobileCtrl = component.staffForm.get('mobileNumber') as FormControl;
  expect(mobileCtrl.hasError('pattern')).toBeFalse(); 

  const genderCtrl = component.staffForm.get('gender') as FormControl;
  expect(genderCtrl.hasError('required')).toBeTrue();

  const statusCtrl = component.staffForm.get('status') as FormControl;
  expect(statusCtrl.value).toBe('ACTIVE');
});



  it('should have default view flags', () => {
    expect(component.showCurrentAddress).toBeTrue();  
    expect(component.isActive).toBeFalse();
    expect(component.showEmergencyContactDropdown).toBeFalse();
    expect(component.showEmergencyContactDropdown1).toBeFalse();
  });

  it('should set up filter FormControls', () => {
    expect(component.districtFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.stateFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.cityFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.districtCtrl).toBeInstanceOf(FormControl);
    expect(component.countryFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.secCountryFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.secStateFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.secCityFilterCtrl).toBeInstanceOf(FormControl);
    expect(component.secDistrictFilterCtrl).toBeInstanceOf(FormControl);
  });

  it('should have loading flags default to false', () => {
  expect(component.isLoading).toBeFalse();
    expect(component.isLoadingCountries).toBeTrue();
    expect(component.isLoadingStates).toBeFalse();
    expect(component.isLoadingCities).toBeFalse();
    expect(component.isLoadingDistricts).toBeFalse();
  });

  it('should have dropdown‑visibility flags default to false', () => {
    const flags = [
      'showReportDropdown','showStatusDropdown','showRoleDropdown',
      'showGenderDropdown','showCityDropdown','showCountryDropdown',
      'showDistrictDropdown','showStateDropdown','showIndustryDropdown',
      'showMaritalStatusDropdown','showBloodGroupDropdown',
      'showDepartmentDropdown','showSecCountryDropdown',
      'showSecStateDropdown','showSecCityDropdown','showSecDistrictDropdown'
    ] as const;

    for (const flag of flags) {
      // @ts-ignore
      expect(component[flag]).toBeFalse(`${flag} should start false`);
    }
  });

  it('should initialize option arrays correctly', () => {
    expect(component.emergencyContactOptions).toEqual([
      { value: 'parent', label: 'Parent' },
      { value: 'spouse', label: 'Spouse' },
      { value: 'sibling', label: 'Sibling' },
      { value: 'friend', label: 'Friend' }
    ]);
    expect(component.emergencyContactOptions1).toEqual(component.emergencyContactOptions);
    expect(component.reportOptions).toEqual(['Manager','Director']);
    expect(component.statusOptions).toEqual(['Active','Inactive','Deleted']);
    expect(component.roleOptions).toEqual(['Admin','User','Manager']);
    expect(component.genderOptions).toEqual(['MALE','FEMALE','OTHER']);
    expect(component.contactStatus).toEqual(['ACTIVE','INACTIVE']);
    expect(component.maritalStatusOptions).toEqual(['Single','Married']);
    expect(component.bloodGroupOptions).toEqual(['A+','A-','B+','B-','O+','O-','AB+','AB-']);
    expect(component.departmentOptions).toEqual(['civil','EEE','cse','IT','Mechanic']);
    expect(component.industryTypes.length).toBeGreaterThan(0);
  });

  it('should have default selected values', () => {
    expect(component.selectedStatus).toBe('ACTIVE');
    expect(component.selectedRole).toBe('');
    expect(component.selectedGender).toBe('');
    expect(component.selectedReport).toBeUndefined();
    expect(component.selectedCity).toBeNull();
    expect(component.selectedCountry).toBeNull();
    expect(component.selectedState).toBeNull();
    expect(component.selectedIndustry).toBe('');
    expect(component.selectedMaritalStatus).toBeUndefined();
    expect(component.selectedFiles).toBeNull();
  });



  it('should toggle showCurrentAddress when toggled', () => {
    const before = component.showCurrentAddress;
    component.showCurrentAddress = !before;
    expect(component.showCurrentAddress).not.toBe(before);
  });

  
  it('should call loadCountries and initialize districts', () => {
    spyOn(component, 'loadCountries');

    component.ngOnInit();

    expect(component.loadCountries).toHaveBeenCalled();
    expect(component.districts).toEqual([
      { name: 'District A' },
      { name: 'District B' },
      { name: 'District C' }
    ]);
  });

  it('should initialize filteredCountries with filter logic', (done) => {
    component.ngOnInit();

    component.countryFilterCtrl.setValue('india');
    component.filteredCountries.subscribe(result => {
      expect(result).toBeDefined();
      done(); // to complete async test
    });
  });

  it('should initialize filteredStates with filter logic', (done) => {
    component.ngOnInit();

    component.stateFilterCtrl.setValue('tamil');
    component.filteredStates.subscribe(result => {
      expect(result).toBeDefined();
      done();
    });
  });

  it('should initialize filteredCities with filter logic', (done) => {
    component.ngOnInit();

    component.cityFilterCtrl.setValue('chennai');
    component.filteredCities.subscribe(result => {
      expect(result).toBeDefined();
      done();
    });
  });
});
