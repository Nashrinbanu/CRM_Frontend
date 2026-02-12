import { Component, HostListener, OnInit, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LeadsService } from '../../services/leads.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from '../activity/activity.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { KafkaService } from '../../services/kafka.service';
@Component({
  selector: 'app-add-leads',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
    MatAutocompleteModule
  ],
  templateUrl: './add-leads.component.html',
  styleUrl: './add-leads.component.scss',
  providers: [],
})
export class AddLeadsComponent implements OnInit {
  public showCityDropdown = false;
  public selectedCity: any = null;
  public showCountryDropdown = false;
  public selectedCountry: { name: string } | null = null;
  public contactStatus = ['ACTIVE', 'INACTIVE'];
  public selectedStatus: string = '';
  public showStatusDropdown = false;
  public showStateDropdown = false;
  public selectedState: any = null;
  public showIndustryDropdown = false;
  public selectedIndustry: string = '';
  public submitted = false;
  public leadForm!: FormGroup;
  public name: string = 'Add';
  public button: string = 'Submit';
  public isLoading: boolean = false;
  public selectedFiles: FileList | null = null;
  public leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST'];
  public contactStatuses = ["ACTIVE", "INACTIVE", "DELETED"]
  public isSubmitting = false;
  public isLoadingCountries: boolean = false;
  public isLoadingStates: boolean = false;
  public isLoadingCities: boolean = false;
  public countries: any[] = [];
  public states: any[] = [];
  public cities: any[] = [];
  @ViewChild('popup') popup!: ActivityComponent;
  public isFormSaved = false;
  public viewId: any;
  public selpublicectedTabIndex: number = 0;
  public isContactTabEnabled: boolean = false;
  public industryTypes: string[] = [
    "Technology",
    "Finance",
    "Healthcare & Pharmaceuticals",
    "Finance & Banking",
    "Retail & E-commerce",
    "Education & E-learning",
    "Real Estate & Property Management",
    "Manufacturing & Industrial",
    "Telecommunications",
    "Marketing & Advertising",
    "Media & Entertainment",
    "Automotive & Transportation",
    "Legal & Consulting",
    "Construction & Engineering",
    "Non-Profit & NGOs",
    "Government & Public Sector",
    "Hospitality & Tourism",
    "Energy & Utilities",
    "Agriculture & Farming",
    "Aerospace & Defense",
    "Food & Beverage"
  ];
  public selectedTabIndex = 0;
  public countryFilterCtrl = new FormControl('');
  public filteredCountries!: Observable<any[]>;
  public selectedCountryId: number | null = null;
  public stateFilterCtrl = new FormControl('');
  public cityFilterCtrl = new FormControl('');
  public filteredStates!: Observable<any[]>;
  public filteredCities!: Observable<any[]>;
  public selectedContactStatuses: string[] = [];
  public showContactStatusDropdown: boolean[] = [false];

  constructor(
    private fb: FormBuilder,
    private leadsService: LeadsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private kafkaService: KafkaService,
  ) {
    this.leadForm = this.fb.group({
      companyName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      industryType: ['', [Validators.required]],
      address: [''],
      state: [''],
      city: [''],
      pincode: [''],
      country: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
      ]],
      website: ['', [
        Validators.maxLength(50),
        this.websiteValidator(),
      ],],
      leadStatus: ['', [Validators.required]],
      source: [''],
      contacts: this.fb.array([]),
    });
    this.addContact();
  }

  ngOnInit(): void {
    
    this.loadCountries();
    this.filteredCountries = this.countryFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCountries(value || ''))
    );

    this.filteredStates = this.stateFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStates(value || ''))
    );

    this.filteredCities = this.cityFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCities(value || ''))
    );
    this.viewId = this.route.snapshot.paramMap.get('id')!;
    setTimeout(() => {
      if (this.viewId) {

        this.name = 'View';
        this.button = 'Update';
        this.patchLeadById(this.viewId);
      }
    }, 1000);
  }

  filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  websiteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
      const value = control.value || '';
      const isValid = urlRegex.test(value);
      return isValid ? null : { invalidWebsite: true };
    };
  }

  selectIndustry(type: string) {
    this.selectedIndustry = type;
    this.showIndustryDropdown = false;
    this.leadForm.controls['industryType'].setValue(type);
  }

  goToListPage() {
    this.router.navigate(['/leads']);
  }

  get contacts(): FormArray {
    return this.leadForm.get('contacts') as FormArray;
  }

  addContact(): void {
    const contactForm = this.fb.group({
      contactName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      designation: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      comments: [''],
      status: [''],
      alternateEmail: ['', Validators.email],
      alternateMobile: ['', [Validators.pattern(/^\d{10}$/)]]
    });
    this.contacts.push(contactForm);
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  loadCountries() {
    this.isLoadingCountries = true;
    this.leadsService.getCountries().subscribe({
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

  loadStates(countryId: any, selectedStateName?: any, selectedCityName?: any) {
    this.isLoadingStates = true;
    this.leadsService.getStates(countryId).subscribe({
      next: (data) => {
        this.states = data;
        this.isLoadingStates = false;
        this.filteredStates = this.stateFilterCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterStates(value || ''))
        );
      },
      error: () => {
        this.isLoadingStates = false;
      },
    });
  }

  filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  displayStateName(state: any): string {
    return state ? state.name : '';
  }

  loadCities(stateId: any) {
    this.isLoadingCities = true;
    this.leadsService.getCities(stateId).subscribe({
      next: (data) => {
        this.cities = data;
        this.isLoadingCities = false;
        this.filteredCities = this.cityFilterCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterCities(value || ''))
        );
      },
      error: () => {
        this.isLoadingCities = false;
      },
    });
  }

  filterCities(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
  }

  displayCityName(city: any): string {
    return city ? city.name : '';
  }
  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }

  markAllAsTouched(): void {
    Object.keys(this.leadForm.controls).forEach(field => {
      const control = this.leadForm.get(field);
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
    if (this.leadForm.invalid) {
      this.markAllAsTouched();
      console.log('Form errors:', this.leadForm.errors, this.leadForm);
      this.showError('Please fill out all required fields correctly.');
      return;
    }
    const selectedCountry = this.countries.find(country => country.id === this.leadForm.value.country);
    const selectedState = this.states.find(state => state.id === this.leadForm.value.state);
    const selectedCity = this.cities.find(city => city.id === this.leadForm.value.city);

    if (this.leadForm.valid) {
      this.isLoading = true;
      let formData: any = {
        company_name: this.leadForm.value.companyName || '',
        industry_type: this.leadForm.value.industryType || '',
        address: this.leadForm.value.address || '',
        city: selectedCity ? selectedCity.name : '',
        postal_code: this.leadForm.value.pincode || '',
        country: selectedCountry ? selectedCountry.name : '',
        company_mobile_number: this.leadForm.value.phone || '',
        company_email: this.leadForm.value.email || '',
        company_website: this.leadForm.value.website || '',
        leadOpportunity: this.leadForm.value.leadStatus || '',
        state: selectedState ? selectedState.name : '',
        source: this.leadForm.value.source || '',
        // social_media_url: ["https://linkedin.com/company/techsolutions"],
        // company_info: 'k'
      };

      formData.contacts = this.leadForm.value.contacts.map((contact: any, index: number) => ({
        id: 0,
        name: contact.contactName,
        job_title: contact.designation,
        email: contact.contactEmail,
        phone: contact.mobile,
        comment: contact.comments,
        status: contact.status,
        alternateEmail: contact.alternateEmail,
        alternatePhone: contact.alternateMobile,
        active_contact: index === 0
      }));
      
      this.leadsService.addLead(formData).subscribe({
        next: () => {
          this.showSuccess('Lead added successfully!');
          this.kafkaService.sendToKafka(formData).subscribe({
            next: () => console.log('Kafka message sent'),
            error: err => console.error('Kafka message failed', err)
          });
          this.leadForm.reset();
          this.contacts.clear();
          this.addContact();
          this.isSubmitting = false;
          this.isFormSaved = true;
          this.isLoading = false;
          this.router.navigate(['/leads']);

        },
        error: (err: any) => {
          this.showError('Failed to add lead.');
             this.kafkaService.sendToKafka(formData).subscribe({
            next: () => console.log('Kafka message sent'),
            error: err => console.error('Kafka message failed', err)
          });
          this.isSubmitting = false;
          this.isLoading = false;
        },
      });
    }
  }

  patchLeadById(id: any): void {
    this.leadsService.getLeadById(id).subscribe({
      next: (data: any) => {
        const selectedCountry = this.countries.find(country => country.name === data.country);
        if (selectedCountry) {
          this.leadForm.get('country')!.patchValue(selectedCountry.id);
          this.loadStates(selectedCountry.id, data?.state, data?.city);
        }

        this.leadForm.patchValue({
          companyName: data.company_name,
          industryType: data.industry_type,
          address: data.address,
          pincode: data.postal_code,
          phone: data.company_mobile_number,
          email: data.company_email,
          website: data.company_website,
          leadStatus: data.lead_opportunity,
          source: data.source,
        });

        this.leadForm.patchValue({
          companyName: data.company_name,
          industryType: data.industry_type,
          address: data.address,
          pincode: data.postal_code,
          phone: data.company_mobile_number,
          email: data.company_email,
          website: data.company_website,
          leadStatus: data.lead_opportunity,
          source: data.source,
        });

        this.contacts.clear();

        const primaryContact = {
          contactName: data.contact_person_name || '',
          designation: data.designation || '',
          contactEmail: data.email || '',
          mobile: data.mobile_number || '',
          comments: data.comment || '',
          status: data.status || '',
          alternateEmail: data.alternateEmail || '',
          alternateMobile: data.alternatePhone || ''
        };

        const primaryContactForm = this.fb.group({
          contactName: [primaryContact.contactName, Validators.required],
          designation: [primaryContact.designation],
          contactEmail: [primaryContact.contactEmail, Validators.email],
          mobile: [primaryContact.mobile, [Validators.pattern(/^\d{10}$/)]],
          comments: [primaryContact.comments],
          status: [primaryContact.status],
          alternateEmail: [primaryContact.alternateEmail, Validators.email],
          alternateMobile: [primaryContact.alternateMobile, [Validators.pattern(/^\d{10}$/)]],
        });

        this.contacts.push(primaryContactForm);

        data.contacts.forEach((contact: any) => {
          const secondaryContactForm = this.fb.group({
            contactName: [contact.name, Validators.required],
            designation: [contact.job_title || ''],
            contactEmail: [contact.email, Validators.email],
            mobile: [contact.phone, [Validators.pattern(/^\d{10}$/)]],
            comments: [contact.comment || ''],
            status: [contact.status],
            alternateEmail: [contact.alternateEmail, Validators.email],
            alternateMobile: [contact.alternatePhone, [Validators.pattern(/^\d{10}$/)]],
          });

          this.contacts.push(secondaryContactForm);
        });
      },
      error: (err: any) => {
        console.error('Failed to fetch lead data', err);
        this.showError('Failed to load lead details.');
      },
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
  }

  onDiscard() {
    this.router.navigate(['/leads']);
  }

  openPopupActivity() {
    const dialogRef = this.dialog.open(ActivityComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Activity Scheduled:', result);
      } else {
        console.log('Popup closed without scheduling.');
      }
    });
  }

  goToNextTab(tabgroup: any, index: number): void {
    if (this.leadForm.valid) {
      this.selectedTabIndex = index;
      this.isContactTabEnabled = true;
    } else {
      alert('Please fill in the required fields in the Company Details tab.');
    }
  }

  goToCompanyDetails(tabgroup: any): void {
    this.selectedTabIndex = 0;
  }

  validateCompanyDetails(tabgroup: any): void {
    Object.keys(this.leadForm.controls).forEach(key => {
      this.leadForm.get(key)?.markAsTouched();
    });

    if (this.leadForm.get('companyName')?.valid &&
      this.leadForm.get('phone')?.valid &&
      this.leadForm.get('email')?.valid &&
      this.leadForm.get('website')?.valid &&
      this.leadForm.get('leadStatus')?.valid &&
      this.leadForm.get('industryType')?.valid) {
      tabgroup.selectedIndex = 1;
      this.isContactTabEnabled = true;
    } else {
      this.showError('Please ensure all Company Details fields are filled out correctly.');
    }
  }

  isCompanyDetailsValid(): any {
    return this.leadForm.get('companyName')?.valid &&
      this.leadForm.get('phone')?.valid &&
      this.leadForm.get('email')?.valid &&
      this.leadForm.get('leadStatus')?.valid &&
      this.leadForm.get('industryType')?.valid;
  }

  isContactDetailsValid(): boolean {
    return this.contacts.controls.every(contact => contact.valid);
  }

  isFormValid(): boolean {
    return this.isCompanyDetailsValid() && this.isContactDetailsValid();
  }

  get email() {
    return this.leadForm.get('email');
  }

  preventNonAlphabets(event: KeyboardEvent): void {
    const key = event.key;

    const allowedKeys = [
      'Backspace', 'Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    const isAlphabet = /^[A-Za-z]$/.test(key);

    const isSingleSpace = key === ' ' && currentValue[currentValue.length - 1] !== ' ';

    if (!isAlphabet && !allowedKeys.includes(key) && !isSingleSpace) {
      event.preventDefault();
    }
  }

  isAllContactsValid(): boolean {
    const contacts = this.leadForm.get('contacts') as FormArray;
    return contacts && contacts.controls.every(contact => contact.valid);
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.showStatusDropdown = false;
    this.leadForm.controls['leadStatus'].setValue(status);
  }

  selectContactStatus(status: string, index: number): void {
    this.selectedContactStatuses[index] = status;
    const contactForm = this.contacts.at(index) as FormGroup;
    contactForm.get('status')?.setValue(status);
    this.showContactStatusDropdown[index] = false;
  }

  toggleStatusDropdown(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  toggleContactStatusDropdown(index: number): void {
    this.showContactStatusDropdown[index] = !this.showContactStatusDropdown[index];
  }

  status(status: string): void {
    this.selectedStatus = status;
    this.leadForm.get('status')?.setValue(status);
    this.showStatusDropdown = false;
  }

  onCountryChange(selectedCountry: any) {
    if (selectedCountry) {
      this.leadForm.get('country')?.setValue(selectedCountry.id);
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.showCountryDropdown = false;
      this.showStateDropdown = false;
      this.showStatusDropdown = false;
      this.showIndustryDropdown = false;
      this.showCityDropdown = false;
    }
  }

  toggleCityDropdown() {
    this.showCityDropdown = !this.showCityDropdown;
  }

  onCityChange(selectedCity: any) {
    if (selectedCity) {
      this.leadForm.get('city')?.setValue(selectedCity.id);
      this.selectedCity = selectedCity;
      this.cityFilterCtrl.setValue(selectedCity.name);
      this.showCityDropdown = false;
    }
  }

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  toggleStateDropdown() {
    this.showStateDropdown = !this.showStateDropdown;
  }

  onStateChange(selectedState: any) {
    if (selectedState) {
      this.leadForm.get('state')?.setValue(selectedState.id);
      this.cityFilterCtrl.setValue('');
      this.cities = [];
      this.loadCities(selectedState.id);

      this.selectedState = selectedState;
      this.stateFilterCtrl.setValue(selectedState.name);
      this.showStateDropdown = false;
    }
  }

  toLowercaseEmail(): void {
    const emailControl = this.leadForm.get('email');
    if (emailControl) {
      const lowercaseValue = emailControl.value?.toLowerCase();
      emailControl.setValue(lowercaseValue, { emitEvent: false });
    }
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
    const pasteData = event.clipboardData?.getData('text') || '';
    const isValid = /^[A-Za-z\s]+$/.test(pasteData);

    if (!isValid) {
      event.preventDefault(); 
    }
  }



onTabChange(newIndex: number, tabgroup: any): void {
  if (newIndex === 1 && !this.isCompanyDetailsValid()) {
    this.selectedTabIndex = 0; // stay on current tab
    this.showError('Please complete Company Details before proceeding.');
    this.markCompanyFieldsTouched(); // Optional: Show validation errors
  } else {
    this.selectedTabIndex = newIndex;
  }
}

markCompanyFieldsTouched(): void {
  ['companyName', 'phone', 'email', 'website', 'leadStatus', 'industryType'].forEach(field => {
    this.leadForm.get(field)?.markAsTouched();
  });
}
}