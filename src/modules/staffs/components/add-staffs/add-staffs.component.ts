import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { StaffsService } from '../../services/staffs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from '../../../leads/components/activity/activity.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { MatTabGroup } from '@angular/material/tabs';
import { MatCardLgImage, MatCardModule } from '@angular/material/card';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { KafkaService } from '../../../leads/services/kafka.service';
// import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-staffs',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabGroup,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterLinkActive,
    LoaderComponent,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
  ],
  templateUrl: './add-staffs.component.html',
  styleUrl: './add-staffs.component.scss',
})
export class AddStaffsComponent implements OnInit {
  showCurrentAddress: boolean = true; // or false, depending on default
isActive: boolean = true; // sets toggle ON by default
selectedStatus: string = 'ACTIVE';
  formattedDate: string = '';
  showEmergencyContactDropdown = false;
  showEmergencyContactDropdown1 = false;
  districtFilterCtrl = new FormControl(); // Ensure this exists
  districts: any[] = []; // Holds the full list of districts
  filteredDistricts!: Observable<any[]>; // Filtered list based on search input
  isDistrictDropdownOpen = false; // Controls dropdown visibility
  selectedImage: string | ArrayBuffer | null = null;
  stateFilterCtrl = new FormControl('');
  isLoadingDistricts = false;

  states: any[] = [];
  emergencyContactOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
  ];
  emergencyContactOptions1 = [
    { value: 'parent', label: 'Parent' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
  ];
  cityFilterCtrl = new FormControl('');
  districtCtrl = new FormControl('');
  showReportDropdown = false;
  selectedReport: any;
  reportOptions = ['Manager', 'Director'];
  showStatusDropdown = false;
  statusOptions = ['Active', 'Inactive', 'Deleted'];
  showRoleDropdown = false;
  selectedRole = '';
  roleOptions = ['Admin', 'User', 'Manager'];
  showGenderDropdown = false;
  selectedGender = '';
  genderOptions = ['MALE', 'FEMALE', 'OTHER'];
  showCityDropdown = false;
  selectedCity: any = null;
  showCountryDropdown = false;
  selectedCountry: { name: string } | null = null;
  contactStatus = ['ACTIVE', 'INACTIVE'];
  showDistrictDropdown = false;
  showStateDropdown = false;
  selectedState: any = null;
  showIndustryDropdown = false;
  selectedIndustry: string = '';
  submitted = false;
  selectedMaritalStatus: any;
  public staffForm!: FormGroup;
  public name: string = 'Add';
  public button: string = 'Submit';
  public isLoading: boolean = false;
  public selectedFiles: FileList | null = null;
  public staffStatuses = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'NEGOTIATION',
    'WON',
    'LOST',
  ];
  public contactStatuses = ['ACTIVE', 'INACTIVE', 'DELETED'];
  public isSubmitting = false;
  public isLoadingCountries: boolean = false;
  public isLoadingStates: boolean = false;
  public isLoadingCities: boolean = false;
  public countries: any[] = [];
  public cities: any[] = [];
  @ViewChild('popup') popup!: ActivityComponent;
  public isFormSaved = false;
  public viewId: any;
  public selpublicectedTabIndex: number = 0;
  public isContactTabEnabled: boolean = false;
  public industryTypes: string[] = [
    'Technology',
    'Finance',
    'Healthcare & Pharmaceuticals',
    'Finance & Banking',
    'Retail & E-commerce',
    'Education & E-learning',
    'Real Estate & Property Management',
    'Manufacturing & Industrial',
    'Telecommunications',
    'Marketing & Advertising',
    'Media & Entertainment',
    'Automotive & Transportation',
    'Legal & Consulting',
    'Construction & Engineering',
    'Non-Profit & NGOs',
    'Government & Public Sector',
    'Hospitality & Tourism',
    'Energy & Utilities',
    'Agriculture & Farming',
    'Aerospace & Defense',
    'Food & Beverage',
  ];
  countryFilterCtrl = new FormControl('');
  filteredCountries!: Observable<any[]>;
  selectedCountryId: number | null = null;
  maritalStatusOptions = ['Single', 'Married'];
  bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  // departmentOptions = ['civil', 'EEE', 'cse', 'IT',  'Mechanic'];
  filteredStates!: Observable<any[]>;
  filteredCities!: Observable<any[]>;
  showMaritalStatusDropdown = false;
  showBloodGroupDropdown = false;
  // showDepartmentDropdown = false;
  showSecCountryDropdown = false;
  showSecStateDropdown = false;
  showSecCityDropdown = false;
  showSecDistrictDropdown = false;
  selectedTabIndex = 0;

  filteredSecCountries!: Observable<any[]>;
  filteredSecStates!: Observable<any[]>;
  filteredSecCities!: Observable<any[]>;
  filteredSecDistricts!: Observable<any[]>;

  secCountryFilterCtrl = new FormControl();
  secStateFilterCtrl = new FormControl();
  secCityFilterCtrl = new FormControl();
  secDistrictFilterCtrl = new FormControl();

  selectedDistrict: any;

  selectedSecCountry: any;
  selectedSecState: any;
  selectedSecCity: any;
  selectedSecDistrict: any;
  statusToggle: any;

  // Report To functionality properties (exactly like assigned to in update leads)
  public isReportDropdownOpen: boolean = false;
  public searchReportText: string = '';
  public selectedReportUser: any = null;
  public reportUsers: any[] = [];
  public assignedReportUser: any = null;
  
  // Report To dropdown with search functionality (like country dropdown)
  reportFilterCtrl = new FormControl('');
  filteredReportUsersObservable!: Observable<any[]>;
  private pendingReportToId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private staffsService: StaffsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private kafkaService: KafkaService
  ) {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      emailId: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      postalCode: [''],

      gender: ['', [Validators.required]],
      ug: [''],
      pg: [''],
      country: [''],
      state: [''],
      city: [''],
      district: [''],
      secCountry: [''],
      secState: [''],
      secCity: [''],
      secDistrict: [''],
      addressLine1: [''],
      addressLine2: [''],
      dateOfJoining: ['', [Validators.required]],
      officialEmailId: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [''],
      reportTo: [''],
      fatherName: [''],
      alternateNumber: [''],
      bloodGroup: [''],
      department: [''],
      maritalStatus: ['', [Validators.required]],
      emergencyContact1Name: [''],
      emergencyContact1Number: [''],
      emergencyContact1Relationship: [''],
      emergencyContact1Relationship1: [''],
      emergencyContact2Name: [''],
      emergencyContact2Number: [''],
      emergencyContact2Relationship: [''],
      role: ['', [Validators.required]],
      status: ['ACTIVE'],
      designation: [''],
      profileImage: ['',],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    this.getAssignDetails();
    this.filteredCountries = this.countryFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCountries(value || ''))
    );
    this.filteredStates = this.stateFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterStates(value || ''))
    );
    this.filteredCities = this.cityFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterSecCities(value || ''))
    );
    this.filteredSecCountries = this.secCountryFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterSecCountries(value || ''))
    );
    this.filteredSecStates = this.secStateFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterSecStates(value || ''))
    );
    this.filteredSecCities = this.secCityFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterSecCities(value || ''))
    );
    
    // Report To dropdown with search functionality
    this.filteredReportUsersObservable = this.reportFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterReportUsers(value || ''))
    );

    this.districts = [
      { name: 'District A' },
      { name: 'District B' },
      { name: 'District C' },
    ];

    // If reportTo is pre-set, try to set the display name
    if (typeof this.pendingReportToId === 'string') {
      this.setReportToFromId(this.pendingReportToId);
    }
  }

  // private _filter(value: string, list: { name: string }[]): { name: string }[] {
  //   const filterValue = value.toLowerCase();
  //   return list.filter(option => option.name.toLowerCase().includes(filterValue));
  // }

  onSecStateChange(selectedState: any) {
    console.log('Secondary state selected:', selectedState?.name);
    if (selectedState) {
      this.staffForm.get('secState')?.setValue(selectedState.name);
      this.secCityFilterCtrl.setValue('');
      this.cities = [];
      this.loadCitie(selectedState.id);
      this.selectedState = selectedState;
      this.secStateFilterCtrl.setValue(selectedState.name);
      this.showSecStateDropdown = false;
    }
  }

  onSecCityChange(selectedCity: any) {
    console.log('Secondary city selected:', selectedCity?.name);
    if (selectedCity) {
      this.staffForm.get('secCity')?.setValue(selectedCity.name);
      this.selectedCity = selectedCity;
      this.secCityFilterCtrl.setValue(selectedCity.name);
      this.showSecCityDropdown = false;
    }
  }

  onSecDistrictChange(district: any) {
    this.staffForm.get('secDistrict')?.setValue(district.id);
    this.showSecDistrictDropdown = false;
    // this.districtFilterCtrl.setValue(selectedDistrict.name); // Set input value
    // this.showDistrictDropdown = false;
  }

  toggleSecStateDropdown() {
    console.log('Toggling secondary state dropdown');
    this.showSecStateDropdown = !this.showSecStateDropdown;
  }

  toggleSecCityDropdown() {
    console.log('Toggling secondary city dropdown');
    this.showSecCityDropdown = !this.showSecCityDropdown;
  }

  toggleSecDistrictDropdown() {
    this.showSecDistrictDropdown = !this.showSecDistrictDropdown;
  }

  filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }
  filterSecCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  loadCountries() {
    this.isLoadingCountries = true;
    this.staffsService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
        this.isLoadingCountries = false;
      },
      error: () => {
        this.isLoadingCountries = false;
      },
    });
  }

  displayCountryName(country: any): string {
    return country ? country.name : '';
  }

  loadStates(countryId: any) {
    this.isLoadingStates = true;
    this.staffsService.getStates(countryId).subscribe({
      next: (data) => {
        this.states = data;
        this.isLoadingStates = false;
        this.filteredStates = this.stateFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterStates(value || ''))
        );
      },
      error: () => {
        this.isLoadingStates = false;
      },
    });
  }
  loadState(countryId: any) {
    this.isLoadingStates = true;
    this.staffsService.getStates(countryId).subscribe({
      next: (data) => {
        this.states = data;
        this.isLoadingStates = false;
        this.filteredSecStates = this.secStateFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterSecStates(value || ''))
        );
      },
      error: () => {
        this.isLoadingStates = false;
      },
    });
  }

  filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state) =>
      state.name.toLowerCase().includes(filterValue)
    );
  }
  filterSecStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state) =>
      state.name.toLowerCase().includes(filterValue)
    );
  }

  displayStateName(state: any): string {
    return state ? state.name : '';
  }

  loadCities(stateId: any) {
    this.isLoadingCities = true;
    this.staffsService.getCities(stateId).subscribe({
      next: (data) => {
        this.cities = data;
        this.isLoadingCities = false;
        this.filteredCities = this.cityFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterCities(value || ''))
        );
      },
      error: () => {
        this.isLoadingCities = false;
      },
    });
  }
  loadCitie(stateId: any) {
    this.isLoadingCities = true;
    this.staffsService.getCities(stateId).subscribe({
      next: (data) => {
        this.cities = data;
        this.isLoadingCities = false;
        this.filteredSecCities = this.secCityFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterSecCities(value || ''))
        );
      },
      error: () => {
        this.isLoadingCities = false;
      },
    });
  }

  filterCities(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter((city) =>
      city.name.toLowerCase().includes(filterValue)
    );
  }
  filterSecCities(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter((city) =>
      city.name.toLowerCase().includes(filterValue)
    );
  }

  displayCityName(city: any): string {
    return city ? city.name : '';
  }

  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }

  markAllAsTouched(): void {
    Object.keys(this.staffForm.controls).forEach((field) => {
      const control = this.staffForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Form values:', this.staffForm.value);
    console.log('Profile Image:', this.staffForm.value.profileImage);
    // if (!this.staffForm.value.profileImage) {
    //   this.showError('Profile image is required.');
    //   return;
    // }
    if (this.staffForm.valid) {
      this.isLoading = true;

      let formData: any = {
        name: this.staffForm.value.name,
        gender: this.selectedGender,
        emailId: this.staffForm.value.emailId,
        role: this.selectedRole,
        status: this.selectedStatus,
        mobileNumber: this.staffForm.value.mobileNumber,
        fatherName: this.staffForm.value.fatherName,
        alternateNumber: this.staffForm.value.alternateNumber,
        maritalStatus: this.staffForm.value.maritalStatus.toUpperCase(),
        bloodGroup: this.staffForm.value.bloodGroup,
        department: this.staffForm.value.department,
        dateOfJoining: this.staffForm.value.dateOfJoining,
        officialEmailId: this.staffForm.value.officialEmailId,
        password: this.staffForm.value.password,
        // reportTo: this.staffForm.value.reportTo,
        reportTo: this.assignedReportUser ? this.assignedReportUser.staff_id : null,
        designation: this.staffForm.value.designation,

        primaryAddress: {
          addressLine1: this.staffForm.get('addressLine1')?.value || '',
          country: this.staffForm.get('country')?.value || '',
          state: this.staffForm.get('state')?.value || '',
          city: this.staffForm.get('city')?.value || '',
        },
        secondryAddress: {
          addressLine1: this.staffForm.get('addressLine2')?.value || '',
          country: this.staffForm.get('secCountry')?.value || '',
          state: this.staffForm.get('secState')?.value || '',
          city: this.staffForm.get('secCity')?.value || '',
        },

        ug: this.staffForm.value.ug,
        pg: this.staffForm.value.pg,
        profileImage: this.staffForm.value.profileImage,

        emergencyContactName1: this.staffForm.value.emergencyContact1Name,
        emergencyMobileNumber1: this.staffForm.value.emergencyContact1Number,
        emergencyRelationShip1:
          this.staffForm.value.emergencyContact1Relationship1,

        emergencyContactName2: this.staffForm.value.emergencyContact2Name,
        emergencyMobileNumber2: this.staffForm.value.emergencyContact2Number,
        emergencyRelationShip2:
          this.staffForm.value.emergencyContact2Relationship,
      };

      // Log the form data to check its structure
      console.log(formData);
      console.log('Report To staff_id being sent:', this.assignedReportUser ? this.assignedReportUser.staff_id : null);
      console.log('Assigned Report User object:', this.assignedReportUser);

      // Make the HTTP request with the form data
      this.staffsService.addStaff(formData).subscribe({
        next: () => {
          this.showSuccess('Staff added successfully!');
          this.kafkaService.sendToStaffKafka(formData).subscribe({
            next: () => console.log('Kafka message sent'),
            error: (err) => console.error('Kafka message failed', err),
          });
          this.staffForm.reset();
          this.isSubmitting = false;
          this.isFormSaved = true;
          this.isLoading = false;
          this.router.navigate(['/staffs']);
        },
        error: () => {
          this.showError('Failed to add staff.');
          this.isSubmitting = false;
          this.isLoading = false;
          this.kafkaService.sendToStaffKafka(formData).subscribe({
            next: () => console.log('Kafka message sent'),
            error: (err) => console.error('Kafka message failed', err),
          });
        },
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  onDiscard() {
    this.router.navigate(['/staffs']);
  }

  goToNextTab(tabgroup: any, index: number): void {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      alert('Please fill in the required fields in the Basic Info tab.');
      return;
    }

    this.selectedTabIndex = index;
    this.isContactTabEnabled = true;
  }

  isCompanyDetailsValid(): boolean {
    return this.staffForm.valid; // This checks all fields inside the form
  }

  // isContactDetailsValid(): boolean {
  //   return this.contacts.controls.every(contact => contact.valid);
  // }

  isFormValid(): boolean {
    return this.isCompanyDetailsValid();
  }

  isBasicInfoValid(): boolean {
    return this.isCompanyDetailsValid();
  }

  goToBasicInfo(tabgroup: any): void {
    this.selectedTabIndex = 0;
  }

  goToEmploymentTab(): void {
    const requiredFields = [
      'name',
      'emailId',
      'mobileNumber',
      'gender',
      'maritalStatus',
    ];
    let hasError = false;
    requiredFields.forEach((field) => {
      const control = this.staffForm.get(field);
      console.log(`${field}:`, control?.value); // debug line
      if (control && control.invalid) {
        control.markAsTouched();
        hasError = true;
      }
    });

    // requiredFields.forEach(field => {
    //   const control = this.staffForm.get(field);
    //   if (control && control.invalid) {
    //     control.markAsTouched();
    //     hasError = true;
    //   }
    // });

    if (hasError) {
      this.showError('Please fill out all required fields in Basic Info.');
      return;
    }

    this.selectedTabIndex = 1;
  }

  validateCompanyDetails(tabgroup: any): void {
    Object.keys(this.staffForm.controls).forEach((key) => {
      this.staffForm.get(key)?.markAsTouched();
    });
    if (
      this.staffForm.get('name')?.valid &&
      this.staffForm.get('gender')?.valid &&
      this.staffForm.get('mobileNumber')?.valid &&
      this.staffForm.get('maritalStatus')?.valid &&
      this.staffForm.get('dateOfJoining')?.valid &&
      this.staffForm.get('role')?.valid &&
      this.staffForm.get('emailId')?.valid
    ) {
      tabgroup.selectedIndex = 1;
      this.isContactTabEnabled = true;
    } else {
      this.showError(
        'Please ensure all Basic Info fields are filled out correctly.'
      );
    }
  }

  get addressLine1Invalid(): boolean {
    return (
      !!this.staffForm.get('addressLine1')?.invalid &&
      (this.staffForm.get('addressLine1')?.dirty ||
        this.staffForm.get('addressLine1')?.touched ||
        this.submitted)
    );
  }

  get email() {
    return this.staffForm.get('emailId');
  }

  preventNonAlphabets(event: KeyboardEvent): void {
    const key = event.key;
    const allowedKeys = [
      'Backspace',
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const isAlphabet = /^[A-Za-z]$/.test(key);
    const isSingleSpace =
      key === ' ' && currentValue[currentValue.length - 1] !== ' ';
    if (!isAlphabet && !allowedKeys.includes(key) && !isSingleSpace) {
      event.preventDefault();
    }
  }

  toggleStatusDropdown(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  onCountryChange(selectedCountry: any) {
    if (selectedCountry) {
      this.staffForm.get('country')?.setValue(selectedCountry.name);
      this.stateFilterCtrl.setValue('');
      this.cityFilterCtrl.setValue('');
      this.states = [];
      this.cities = [];
      this.loadStates(selectedCountry.id);
      this.selectedCountry = selectedCountry;
      this.countryFilterCtrl.setValue(selectedCountry.name);
      this.showCountryDropdown = false;
    }
  }

  onSecCountryChange(country: any) {
    console.log('Setting secCountry:', country?.name);
    this.secCountryFilterCtrl.setValue(country.name); // This is setting the filter control, not the form

    // Add this line to actually set the form value:
    this.staffForm.get('secCountry')?.setValue(country.name);

    if (country) {
      this.secStateFilterCtrl.setValue('');
      this.secCityFilterCtrl.setValue('');
      this.states = [];
      this.cities = [];
      this.loadState(country.id);
      this.selectedCountry = country;
      this.secCountryFilterCtrl.setValue(country.name);
      this.showSecCountryDropdown = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.showCountryDropdown = false;
      this.showStateDropdown = false;
      this.showStatusDropdown = false;
      this.showIndustryDropdown = false;
      this.showCityDropdown = false;
      this.isReportDropdownOpen = false;
    }
  }

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  toggleStateDropdown() {
    console.log('Toggling primary state dropdown');
    this.showStateDropdown = !this.showStateDropdown;
  }

  toggleCityDropdown() {
    console.log('Toggling primary city dropdown');
    this.showCityDropdown = !this.showCityDropdown;
  }

  onStateChange(selectedState: any) {
    console.log('Primary state selected:', selectedState?.name);
    if (selectedState) {
      this.staffForm.get('state')?.setValue(selectedState.name);
      this.cityFilterCtrl.setValue('');
      this.cities = [];
      this.loadCities(selectedState.id);
      this.selectedState = selectedState;
      this.stateFilterCtrl.setValue(selectedState.name);
      this.showStateDropdown = false;
    }
  }

  onCityChange(selectedCity: any) {
    console.log('Primary city selected:', selectedCity?.name);
    if (selectedCity) {
      this.staffForm.get('city')?.setValue(selectedCity.name);
      this.selectedCity = selectedCity;
      this.cityFilterCtrl.setValue(selectedCity.name);
      this.showCityDropdown = false;
    }
  }

  goToListPage() {
    this.router.navigate(['/staffs']);
  }

  selectGender(gender: string) {
    this.staffForm.controls['gender'].setValue(gender);
    this.selectedGender = gender;
    this.showGenderDropdown = false;
  }
  selectRole(role: string) {
    this.staffForm.controls['role'].setValue(role);
    this.selectedRole = role;
    this.showRoleDropdown = false;
  }

  selectReport(report: string) {
    console.log(report, 'report');
    this.selectedReport = report;
    this.showReportDropdown = false;
  }

  fetchCitiesForState(stateId: string) {
    this.isLoadingCities = true;
    setTimeout(() => {
      this.cities = [
        { name: 'City A', id: 'cityA', stateId },
        { name: 'City B', id: 'cityB', stateId },
      ];
      this.isLoadingCities = false;
      this.cityFilterCtrl.setValue('');
    }, 1000);
  }

  // Toggle City Dropdown
  private filterDistricts(searchText: string): any[] {
    if (!searchText) return this.districts;
    return this.districts.filter((district) =>
      district.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  toggleDistrictDropdown() {
    this.isDistrictDropdownOpen = !this.isDistrictDropdownOpen;
  }

  onDistrictChange(selectedDistrict: any) {
    console.log('Selected District:', selectedDistrict);
    this.districtFilterCtrl.setValue(selectedDistrict.name); // Set input value
    this.showDistrictDropdown = false; // Close dropdown after selection
  }

  selectMaritalStatus(status: any) {
    console.log(status, 'status');
    this.staffForm.controls['maritalStatus'].setValue(status);
    this.showMaritalStatusDropdown = false;
  }

  selectBloodGroup(blood: string) {
    this.staffForm.controls['bloodGroup'].setValue(blood);
    this.showBloodGroupDropdown = false;
  }
  // selectDepartment(blood: string) {
  //   this.staffForm.controls['department'].setValue(blood);
  //   this.showDepartmentDropdown = false;
  // }

  selectEmergencyContact(relationship: any) {
    this.staffForm.controls['emergencyContact2Relationship'].setValue(
      relationship.value
    );
    this.showEmergencyContactDropdown = false;
  }
  selectEmergencyContact1(relationship1: any) {
    console.log(relationship1);
    this.staffForm.controls['emergencyContact1Relationship1'].setValue(
      relationship1.value
    );
    this.showEmergencyContactDropdown1 = false;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        this.staffForm.get('profileImage')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.staffForm.get('profileImage')?.setValue('');
    }
  }

  openDatePicker(dateInput: HTMLInputElement) {
    dateInput.showPicker(); // This will open the native datepicker
  }

  // Update the displayed date when a user selects a date
  updateDateDisplay(selectedDate: string) {
    if (selectedDate) {
      const date = new Date(selectedDate);
      this.formattedDate = date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
    } else {
      this.formattedDate = '';
    }
  }

  toggleAddress(type: 'current' | 'permanent') {
    this.showCurrentAddress = type === 'current';
  }

  activeEmergencyContact = 1;

  // emergencyContactOptions = [
  //   { label: 'Father' },
  //   { label: 'Mother' },
  //   { label: 'Spouse' },
  //   { label: 'Friend' },
  //   { label: 'Sibling' },
  //   { label: 'Other' }
  // ];

  // showEmergencyContactDropdown = false;
  showEmergencyContactDropdown2 = false;

  // selectEmergencyContact(relation: any) {
  //   if (this.activeEmergencyContact === 1) {
  //     this.staffForm.get('emergencyContact1Relationship')?.setValue(relation.label);
  //     this.showEmergencyContactDropdown = false;
  //   } else {
  //     this.staffForm.get('emergencyContact2Relationship')?.setValue(relation.label);
  //     this.showEmergencyContactDropdown2 = false;
  //   }
  // }

  onStatusToggle(isChecked: boolean): void {
    this.selectedStatus = isChecked ? 'ACTIVE' : 'INACTIVE';
    console.log('Profile data received:', this.selectedStatus);
  }
  toLowercaseEmail(): void {
    // const emailControl = this.leadForm.get('email');
    // if (emailControl) {
    //   const lowercaseValue = emailControl.value?.toLowerCase();
    //   emailControl.setValue(lowercaseValue, { emitEvent: false });
    // }
  }

  allowOnlyValidPhoneDigits(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode || event.which);
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length === 0 && !/[6-9]/.test(inputChar)) {
      event.preventDefault();
    }

    if (currentValue.length > 0 && !/\d/.test(inputChar)) {
      event.preventDefault();
    }

    if (currentValue.length >= 10) {
      event.preventDefault();
    }
  }

  blockInvalidPhonePaste(event: ClipboardEvent): void {
    const pasteData = event.clipboardData?.getData('text') || '';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(pasteData)) {
      event.preventDefault();
    }
  }
  allowOnlyLetters(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode || event.which);
    const isValid = /^[A-Za-z\s]$/.test(inputChar);

    if (!isValid) {
      event.preventDefault();
    }
  }

  blockPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const lettersOnly = pastedText.replace(/[^A-Za-z\s]/g, '');
    const input = event.target as HTMLInputElement;
    input.value = lettersOnly;
  }

  // Report To functionality methods (exactly like assigned to in update leads)
  getAssignDetails() {
    this.staffsService.getAssign().subscribe({
      next: (data) => {
        if (data && data.data) {
          this.reportUsers = data.data;
        } else if (Array.isArray(data)) {
          this.reportUsers = data;
        } else {
          this.reportUsers = [];
        }
        // If reportTo is pre-set, set the display name
        if (typeof this.pendingReportToId === 'string') {
          this.setReportToFromId(this.pendingReportToId);
        }
      },
      error: (err) => {
        this.reportUsers = [];
      },
    });
  }

  filteredReportUsers() {
    return this.reportUsers.filter(
      (user) =>
        user?.name
          ?.toLowerCase()
          .includes(this.searchReportText?.toLowerCase() || '') &&
        !this.isReportAssigned(user)
    );
  }

  assignReportUser(user: any, event: Event) {
    event.stopPropagation();
    this.selectedReportUser = user;
    this.isReportDropdownOpen = true;
  }

  confirmReportAssignment(event: Event) {
    event.stopPropagation();
    if (this.selectedReportUser) {
      this.assignedReportUser = this.selectedReportUser;
      this.staffForm.get('reportTo')?.setValue(this.selectedReportUser.staff_id);
      this.selectedReportUser = null;
      this.searchReportText = '';
      this.isReportDropdownOpen = false;
    }
  }

  isReportAssigned(user: any): boolean {
    return this.assignedReportUser && this.assignedReportUser.staff_id === user.staff_id;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/lead/Avatar.png';
  }

  getProfileImage(user: any): string {
    if (!user?.profileImage || user.profileImage === 'string') {
      return 'assets/lead/Avatar.png';
    }
    return 'https://crm.shenll.in/' + user.profileImage; // Using hardcoded URL instead of environment.galleryUrl
  }

  filterReportUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.reportUsers.filter((user) =>
      user?.name?.toLowerCase().includes(filterValue) &&
      !this.isReportAssigned(user)
    );
  }

  onReportUserChange(selectedUser: any) {
    if (selectedUser) {
      this.assignedReportUser = selectedUser;
      this.staffForm.get('reportTo')?.setValue(selectedUser.staff_id);
      this.reportFilterCtrl.setValue(selectedUser.name);
      this.isReportDropdownOpen = false;
    }
  }

  toggleReportDropdownSearch() {
    this.isReportDropdownOpen = !this.isReportDropdownOpen;
  }

  displayReportUserName(user: any): string {
    return user ? user.name : '';
  }

  private setReportToFromId(reportToId: string) {
    if (!reportToId || !this.reportUsers || this.reportUsers.length === 0) return;
    const match = this.reportUsers.find(user => user.staff_id?.toString() === reportToId.toString());
    if (match) {
      this.staffForm.get('reportTo')?.setValue(match.staff_id);
      this.reportFilterCtrl.setValue(match.name);
      this.assignedReportUser = match;
    } else {
      this.reportFilterCtrl.setValue(reportToId);
      this.staffForm.get('reportTo')?.setValue(reportToId);
    }
  }
}
