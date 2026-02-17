import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLinkActive } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
// import { LeadsService } from '../../services/leads.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { ActivityComponent } from '../activity/activity.component';
import { MatChipsModule } from '@angular/material/chips';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SkeletonComponent } from '../../../leads/components/skeleton/skeleton.component';
import { StaffsService } from '../../services//staffs.service';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterLinkActive,
    MatCardModule,
    MatSnackBarModule,
    MatRadioModule,
    MatMenuModule,
    MatTabsModule,
    // ActivityComponent,
    MatChipsModule,
    MatIconModule,
    SkeletonComponent,
  ],
  animations: [
    trigger('slideIn', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(100%)' })),
      transition('open => closed', [animate('0.3s ease-in')]),
      transition('closed => open', [animate('0.3s ease-out')]),
    ]),
  ],
  templateUrl: './update-staff.component.html',
  styleUrl: './update-staff.component.scss',
})
export class UpdateStaffComponent implements OnInit {
  staffForm!: FormGroup;
  editing: any = {};
  private loadingTimeout: any;
public isSubmitting = false;
  showPassword = false;
  public apiCallsCompleted = {
    staff: false,
    // contact: false,
    // activity: false,
    // status: false,
    // assign: false,
  };
  public isIndustryDropdownOpen: boolean = false;
  public selectedIndustry: string = 'Select Industry Type';
  public searchTerm: string = '';
  public showDropdown: boolean = false;
  public hashtagSuggestions: string[] = [
    'flowers',
    'flowersofinstagram',
    'flowerstyles_gf',
    'flowerstagram',
    'flowerschool',
    'flowers_shotz',
    'flowerstyle',
  ];
  public filteredHashtags: string[] = [];
  public searchInput: string = '';
  public showHashtagDropdown = false;
  public editingField: string | null = null;
  public socialLinks1 = {
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
  };
  public industries: string[] = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Education',
  ];
isBloodGroupDropdownOpen = false;
bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-'];
genders = ['Male', 'Female', 'Other'];
isGenderDropdownOpen = false;
statuses = ['Active', 'Inactive'];
maritalStatuses = ['Single', 'Married', 'Divorced'];
isStatusDropdownOpen = false;
isMaritalStatusDropdownOpen = false;

  @HostBinding('@slideIn') animation = true;
  public selectedIndex: number = 0;
  public isEditMode: boolean[] = [];
  viewId: string = '';
  staffsDetails: any;
  isLoading = true;
  public leadForm: any;
  public isFormSaved: boolean = false;
  public acivityType: any;
  public serviceInterests: string[] = [];
  public activityDetails: any[] = [];
  public selectedStep: any;
  public users: any[] = [];
  private dialogElement: HTMLElement | null = null;
  public currentStageIndex = 0;
  public dropdownOpen: boolean = false;
  public comment = '';
  public showNextButton = true;
  public searchText: string = '';
  public selectedUser: any = null;
  public viewIdChange: any;
  public imageUrl = environment.galleryUrl;
  public invalidFields: string[] = [];
  public stages = [
    { name: 'New' },
    { name: 'Contacted' },
    { name: 'Qualified' },
    { name: 'Negotiation' },
    { name: 'Won' },
    { name: 'Lost' },
  ];
  public currentStage = this.stages[0];
  public selectedStatus: string = 'New';
  public contacts!: FormArray<FormGroup>;
  public assignedUsers: any[] = [];
  public assignedUser: any = null;
  public isDropdownOpen: boolean = false;
  public showDetails: boolean = false;
  public activeTab: string = 'details';
  public pinnedNote: any;
  public meetingUrl: string = '';
  public showTooltip: boolean = false;
  public safeMeetingUrl!: SafeResourceUrl;
  public upcomingMeeting: boolean = false;
  public validSocialLinks: { [key: string]: boolean } = {};
  public progressStages: any[] = [];
  public socialMediaFields = [
    {
      key: 'linkedin',
      placeholder: 'Enter LinkedIn profile URL',
      icon: 'LinkedIn.svg',
    },
    {
      key: 'instagram',
      placeholder: 'Enter Instagram handle or URL',
      icon: 'skill-icons_instagram.svg',
    },
    {
      key: 'facebook',
      placeholder: 'Enter Facebook profile or page URL',
      icon: 'Group.svg',
    },
    {
      key: 'twitter',
      placeholder: 'Enter Twitter/X profile URL',
      icon: 'fa6-brands_square-x-twitter.svg',
    },
  ];
  public dropdownPrimaryOpen: boolean[] = [];
  public dropdownOptions: string[] = ['Primary', 'Secondary'];
  // Report To dropdown logic
  public isReportDropdownOpen: boolean = false;
  public reportUsers: any[] = [];
  public assignedReportUser: any = null;
  public reportFilterCtrl = new FormControl('');
  public filteredReportUsersObservable!: Observable<any[]>;
  private pendingReportToValue: string | null = null;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateStaffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },

    private snackBar: MatSnackBar,
    private eRef: ElementRef,
    private renderer: Renderer2,
    private staffsService: StaffsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.meetingUrl = 'https://meet.google.com/xyz-abc-def';
    this.safeMeetingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.meetingUrl
    );
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Loading timeout reached');
        this.isLoading = false;
      }
    }, 1000);
    if (!this.data?.id) {
      console.error('No ID provided for UpdateStaffComponent');
      this.isLoading = false;
      return;
    }
    this.viewId = this.data.id;
    this.getStaffById(this.viewId);
    this.getAssignDetails();
    this.filteredReportUsersObservable = this.reportFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterReportUsers(value || ''))
    );
    document.addEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
  }

  initializeForm(): void {
    this.staffForm = this.fb.group({
      // Basic Information
      name: ['', Validators.required],
      status: ['Active', Validators.required],
      department:  [''],
      designation:  [''],
      employeeId: ['', Validators.required],
      joinDate: [''],
      officialEmail: ['', [Validators.required, Validators.email]],
      password: [''],
      reportTo:[''],
  profileImage: ['Manager'],
      // Personal Details
      gender: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      personalEmail: ['', [Validators.email]],
      fatherName: [''],
      alternateNumber: [''],
      bloodGroup: ['O+'],
      maritalStatus: ['Married'],

      // Emergency Contacts
      primaryContactName: [''],
      primaryContactRelationship: [''],
      primaryContactPhone: [''],
      secondaryContactName: [''],
      secondaryContactRelationship: [''],
      secondaryContactPhone: [''],

      // Current Address
      currentCountry: [''],
      currentState: [''],
      currentCity: [''],
      currentAddress: [''],

      // Permanent Address
      permanentCountry: [''],
      permanentState: [''],
      permanentCity: [''],
      permanentAddress: [''],
      sameAsCurrentAddress: [false],

      // Education
      educations: this.fb.array([]),
    });
  }

  getStaffById(id: string): void {
    console.log('Fetching staff with ID:', id);
    this.isLoading = true;

    this.staffsService.getStaffById(id).subscribe({
      next: (apiResponse) => {
        console.log('Full API Response:', apiResponse);
        if (apiResponse.data?.staff) {
          this.patchFormData(apiResponse); // Pass the entire response
        } else {
          console.error('No staff data in response');
        }
      },
      error: (err) => {
        console.error('Error fetching staff:', err);
        this.isLoading = false;
        clearTimeout(this.loadingTimeout);
      },
    });
  }

  patchFormData(apiResponse: any): void {
    if (!this.staffForm || !apiResponse.data?.staff) {
      console.error('Form not initialized or missing staff data');
      return;
    }

    const data = apiResponse.data.staff; // Extract the staff data

    console.log('Staff Data to Patch:', data);

    // Basic Information
    const basicInfo = {
      name: data.name || '',
      status: data.status === 'ACTIVE' ? 'Active' : 'Inactive', // Map API status to form values
      department: data.department || '',
      designation: data.designation || '',
      employeeId: data.id || '',
      joinDate: data.date_of_joining ? data.date_of_joining.split('T')[0] : '',
      officialEmail: data.official_email_id || '',
      password: data.password || '', // Placeholder
   reportTo: data.report_to || '',
      // reportTo: this.mapReportTo(data.report_to),
       profileImage: data.profile_image || '',
      pgDegree: data.pg || '',
    };
    this.staffForm.patchValue(basicInfo);

    // Personal Details
    const personalDetails = {
      gender: this.mapGender(data.gender), // Map to your form's expected values
      mobileNumber: data.mobile_number || '',
      personalEmail: data.email_id || '',
      fatherName: data.father_name || '',
      alternateNumber: data.alternate_number || '',

      bloodGroup: data.blood_group || 'O+',
      maritalStatus: this.mapMaritalStatus(data.marital_status), // Map to form values
    };
    this.staffForm.patchValue(personalDetails);

    // Emergency Contacts
    const emergencyContacts = {
      primaryContactName: data.emergency_contact_name1 || '',
      primaryContactRelationship: data.emergency_relationShip1 || '',
      primaryContactPhone: data.emergency_mobile_number1 || '',
      secondaryContactName: data.emergency_contact_name2 || '',
      secondaryContactRelationship: data.emergency_relationShip2 || '',
      secondaryContactPhone: data.emergency_mobile_number2 || '',
    };
    this.staffForm.patchValue(emergencyContacts);

    // Addresses
    const addresses = {
      currentCountry: data.primary_address?.country || '',
      currentState: data.primary_address?.state || '',
      currentCity: data.primary_address?.city || '',
      currentAddress: data.primary_address?.addressLine1 || '',
      permanentCountry: data.secondary_address?.country || '',
      permanentState: data.secondary_address?.state || '',
      permanentCity: data.secondary_address?.city || '',
      permanentAddress: data.secondary_address?.addressLine1 || '',
      sameAsCurrentAddress: false, // Default to false
    };
    this.staffForm.patchValue(addresses);

    // Handle education data
    this.handleEducationData(data);

    // Set Report To after patching
    this.pendingReportToValue = data.report_to;
    this.setReportToFromApi(data.report_to);

    console.log('Form After Patching:', this.staffForm.value);
  }

  // Helper methods for value mapping
  private mapGender(apiGender: string): string {
    switch (apiGender?.toUpperCase()) {
      case 'FEMALE':
        return 'Female';
      case 'MALE':
        return 'Male';
      default:
        return 'Other';
    }
  }
  private mapReportTo(apiReportTo: string): string {
    switch (apiReportTo?.toUpperCase()) {
      case 'MANAGER':
        return 'Manager';
    
      case 'DIRECTOR':
        return 'Director';
      default:
        return 'Other';
    }
  }

  private mapMaritalStatus(apiStatus: string): string {
    switch (apiStatus?.toUpperCase()) {
      case 'SINGLE':
        return 'Single';
      case 'MARRIED':
        return 'Married';
      case 'DIVORCED':
        return 'Divorced';
      default:
        return 'Single';
    }
  }

  private handleEducationData(data: any): void {
    // Clear existing education entries
    while (this.educations.length) {
      this.educations.removeAt(0);
    }

    // Add UG degree if exists
    if (data.ug) {
      this.educations.push(
        this.fb.group({
          institution: 'University', // Default value or empty if unknown
          degree: data.ug, // This will be "Bsc" from your API
          startYear: '', // Empty if not provided
          endYear: '', // Empty if not provided
        })
      );
    }

    // Add PG degree if exists
    if (data.pg) {
      this.educations.push(
        this.fb.group({
          institution: 'University', // Default value or empty if unknown
          degree: data.pg, // This will be "Msc" from your API
          startYear: '', // Empty if not provided
          endYear: '', // Empty if not provided
        })
      );
    }

    // If no education data at all, add one empty group
    if (this.educations.length === 0) {
      this.educations.push(this.createEducationGroup());
    }
  }

  private createEducationGroup(): FormGroup {
    return this.fb.group({
      institution: '',
      degree: '',
      startYear: '',
      endYear: '',
    });
  }

  get educations(): FormArray {
    return this.staffForm.get('educations') as FormArray;
  }

  // Make sure you have this getter for the educations FormArray

  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    document.removeEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
  }

  getFormControl(group: FormGroup, field: string): FormControl {
    return (group.get(field) as FormControl) ?? new FormControl('');
  }

  private checkAllApiCallsComplete() {
    if (Object.values(this.apiCallsCompleted).every((complete) => complete)) {
      this.isLoading = false;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    }
  }

  private checkIfAddressesSame(data: any): boolean {
    if (!data.primary_address || !data.secondary_address) return false;

    return (
      data.primary_address.addressLine1 ===
        data.secondary_address.addressLine1 &&
      data.primary_address.city === data.secondary_address.city &&
      data.primary_address.state === data.secondary_address.state &&
      data.primary_address.country === data.secondary_address.country
    );
  }

  updateEducationArray(ug: string, pg: string) {
    const educationArray = this.staffForm.get('educations') as FormArray;
    educationArray.clear();

    if (ug) {
      educationArray.push(
        this.createEducation(
          'Not specified', // Institution not in API
          ug,
          '', // Start year not in API
          '' // End year not in API
        )
      );
    }

    if (pg) {
      educationArray.push(
        this.createEducation(
          'Not specified', // Institution not in API
          pg,
          '', // Start year not in API
          '' // End year not in API
        )
      );
    }
  }

  toggleEditMode(index: number): void {
    this.isEditMode[index] = !this.isEditMode[index];
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

  refreshAllData(): void {
    this.getStaffById(this.viewId);
  }

  selectStep(step: any, index: any) {
    console.log(step, 'step');
    this.selectedStep = index;
    this.selectedStatus = step.name;
  }

  formatIndianCurrency(amount?: any) {
    if (amount === null || amount === undefined) return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(amount);
  }

  selectStage(stage: any) {
    this.selectedStatus = stage.name;
  }

  openDropdown(stage: any) {
    this.selectedStatus = stage.name;
    this.dropdownOpen = true;
  }

  removeTag(index: number) {
    this.serviceInterests.splice(index, 1);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  ngAfterViewInit(): void {
    this.dialogElement = this.eRef.nativeElement.closest('.cdk-overlay-pane');
  }

  close(): void {
    if (this.dialogElement) {
      this.renderer.addClass(this.dialogElement, 'dialog-exit');
      setTimeout(() => {
        this.dialogRef.close();
      }, 400);
    } else {
      this.dialogRef.close();
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filteredUsers() {
    return this.users.filter(
      (user) =>
        user?.name
          ?.toLowerCase()
          .includes(this.searchText?.toLowerCase() || '') &&
        !this.isAssigned(user)
    );
  }

  assignUser(user: any, event: Event) {
    event.stopPropagation();
    this.selectedUser = user;
    this.isDropdownOpen = true;
  }

  confirmAssignment(event: Event) {
    event.stopPropagation();
    if (this.selectedUser) {
      this.assignedUsers = [this.selectedUser];
      this.assignedUser = this.selectedUser;
      this.selectedUser = null;
      this.searchText = '';
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  closeStageDropdown() {
    this.dropdownOpen = false;
  }
  isAssigned(user: any): boolean {
    return this.assignedUsers.some(
      (assigned) => assigned.staff_id === user.staff_id
    );
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/lead/Avatar.png';
  }

  @ViewChildren('inputRef') inputRefs!: QueryList<ElementRef>;

  focusInput(field: string): void {
    const inputElement = this.inputRefs.find(
      (ref) => ref.nativeElement.getAttribute('formControlName') === field
    );
    inputElement?.nativeElement.focus();
  }

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      // Patch the base64 or image URL into the form
      this.staffForm.patchValue({ profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  }
}

getProfileImage(user: any): string {
  if (!user?.profileImage || user.profileImage === 'string') {
    return 'assets/lead/Avatar.png';
  }

  // Handle base64 image or image path
  return user.profileImage.startsWith('data:image')
    ? user.profileImage
    : this.imageUrl + user.profileImage;
}



  selectIndustry(type: string) {
    console.log('Raw Type:', type);
    this.selectedIndustry = type.trim();
    console.log('Updated selectedIndustry:', this.selectedIndustry);
    console.log(
      'Comparison:',
      this.selectedIndustry === 'Select Industry Type'
    );
    this.isIndustryDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.isIndustryDropdownOpen = false;
    }
  }

  toggleIndustryDropdown() {
    this.isIndustryDropdownOpen = !this.isIndustryDropdownOpen;
  }

  togglePrimaryDropdown(index: any): void {
    this.dropdownPrimaryOpen[index] = !this.dropdownPrimaryOpen[index];
  }

  selectOption(index: number, option: string): void {
    const formGroup = this.contacts.at(index) as FormGroup;
    formGroup.get('label')?.setValue(option);
    this.dropdownPrimaryOpen[index] = false;
  }
  startEditing(field: string) {
    this.editing[field] = true;
  }

  stopEditing(field: string) {
    this.editing[field] = false;
  }

  createEducation(
    institution: string,
    degree: string,
    startYear: string,
    endYear: string
  ): FormGroup {
    return this.fb.group({
      institution: [institution],
      degree: [degree],
      startYear: [startYear],
      endYear: [endYear],
    });
  }

  addEducation() {
    this.educations.push(this.createEducation('', '', '', ''));
  }

  removeEducation(index: number) {
    this.educations.removeAt(index);
  }

  copyCurrentAddress(event: any) {
    if (event.target.checked) {
      this.staffForm.patchValue({
        permanentCountry: this.staffForm.value.currentCountry,
        permanentState: this.staffForm.value.currentState,
        permanentCity: this.staffForm.value.currentCity,
        permanentAddress: this.staffForm.value.currentAddress,
      });
    }
  }

  onSubmit() {
    if (this.staffForm.valid) {
      console.log('Form submitted:', this.staffForm.value);
      // Handle form submission
    }
  }


updateStaff(): void {
    console.log('Form Data Before Submission:', this.staffForm.value); 
  // Mark all fields as touched to show validation errors
  this.markFormGroupTouched(this.staffForm);

  if (this.staffForm.invalid) {
    this.showError('Please fill all required fields correctly');
    return;
  }

  this.isSubmitting = true;

  const formData = this.prepareUpdateData(this.staffForm.value);

  this.staffsService.updateStaff(formData, this.viewId).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      this.showSuccess('Staff updated successfully');
      this.dialogRef.close({ success: true, data: response.data });
    },
    error: (err) => {
      this.isSubmitting = false;
      console.error('Error updating staff:', err);
      this.showError(err.error?.message || 'Failed to update staff. Please try again.');
    }
  });
}

// Helper method to mark all form controls as touched
private markFormGroupTouched(formGroup: FormGroup | FormArray) {
  Object.values(formGroup.controls).forEach(control => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      this.markFormGroupTouched(control);
    } else {
      control.markAsTouched();
    }
  });
}

// Helper method to prepare data for API
private prepareUpdateData(formValue: any): any {
  // Format date to YYYY-MM-DD
  const joinDate = formValue.joinDate ? 
    new Date(formValue.joinDate).toISOString().split('T')[0] : 
    null;

      if (!formValue.mobileNumber || !formValue.personalEmail) {
    console.warn('Missing critical fields:', {
      mobileNumber: formValue.mobileNumber,
      personalEmail: formValue.personalEmail
    });
  }

  return {
    name: formValue.name,
    status: formValue.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    department: formValue.department,
    designation: formValue.designation,
    id: formValue.employeeId,
    dateOfJoining: joinDate,
    officialEmailId: formValue.officialEmail,
    password: formValue.password,
    reportTo: formValue.reportTo,
      profileImage: formValue.profileImage,

    // Personal details
    gender: formValue.gender?.toUpperCase(),
      mobileNumber: formValue.mobileNumber, // Ensure this is included
    emailId: formValue.personalEmail, 
    fatherName: formValue.fatherName,
    alternateNumber: formValue.alternateNumber,
    bloodGroup: formValue.bloodGroup,
    maritalStatus: formValue.maritalStatus?.toUpperCase(),
    
    // Emergency contacts
    emergencyContactName1: formValue.primaryContactName,
    emergencyRelationShip1: formValue.primaryContactRelationship,
    emergencyMobileNumber1: formValue.primaryContactPhone,
    emergencyContactName2: formValue.secondaryContactName,
    emergencyRelationShip2: formValue.secondaryContactRelationship,
    emergencyMobileNumber2: formValue.secondaryContactPhone,
    
    // Addresses
    primary_address: {
      addressLine1: formValue.currentAddress,
      city: formValue.currentCity,
      state: formValue.currentState,
      country: formValue.currentCountry
    },
    secondary_address: {
      addressLine1: formValue.permanentAddress,
      city: formValue.permanentCity,
      state: formValue.permanentState,
      country: formValue.permanentCountry
    },
    
    // Education - extract UG and PG degrees
    ug: this.getDegree('ug'),
    pg: this.getDegree('pg')
  };
}

// Helper method to get education degrees
private getDegree(type: 'ug' | 'pg'): string {
  const educations = this.staffForm.value.educations;
  if (!educations || educations.length === 0) return '';
  
  // Find the appropriate degree
  if (type === 'ug') {
    const ugEducation = educations.find((edu: { degree: string; }) => 
      edu.degree && edu.degree.toLowerCase().includes('bsc') || 
      edu.degree && edu.degree.toLowerCase().includes('bachelor'));
    return ugEducation?.degree || '';
  } else if (type === 'pg') {
    const pgEducation = educations.find((edu: { degree: string; }) => 
      edu.degree && edu.degree.toLowerCase().includes('msc') || 
      edu.degree && edu.degree.toLowerCase().includes('master'));
    return pgEducation?.degree || '';
  }
  return '';
}

selectBloodGroup(group: string) {
  const bloodGroupControl = this.staffForm.get('bloodGroup');
  if (bloodGroupControl) {
    bloodGroupControl.setValue(group);
  }
  this.isBloodGroupDropdownOpen = false;
}

selectGender(gender: string) {
  const genderControl = this.staffForm.get('gender');
  if (genderControl) {
    genderControl.setValue(gender);
  }
  this.isGenderDropdownOpen = false;
}

selectStatus(status: string) {
  const statusControl = this.staffForm.get('status');
  if (statusControl) {
    statusControl.setValue(status);
  }
  this.isStatusDropdownOpen = false;
}

selectMaritalStatus(status: string) {
  const maritalStatusControl = this.staffForm.get('maritalStatus');
  if (maritalStatusControl) {
    maritalStatusControl.setValue(status);
  }
  this.isMaritalStatusDropdownOpen = false;
}

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
      // Try to set Report To if pending
      if (this.pendingReportToValue) {
        this.setReportToFromApi(this.pendingReportToValue);
      }
    },
    error: (err) => {
      this.reportUsers = [];
    },
  });
}

filterReportUsers(value: string): any[] {
  const filterValue = value.toLowerCase();
  return this.reportUsers.filter((user) =>
    user?.name?.toLowerCase().includes(filterValue)
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

toggleReportDropdown(event: MouseEvent) {
  event.stopPropagation();
  this.isReportDropdownOpen = !this.isReportDropdownOpen;
}

private setReportToFromApi(reportToValue: string) {
  if (!reportToValue || !this.reportUsers || this.reportUsers.length === 0) return;
  const match = this.reportUsers.find(
    user => (user.name?.toLowerCase() === reportToValue.toLowerCase()) ||
            (user.staff_id?.toLowerCase() === reportToValue.toLowerCase())
  );
  if (match) {
    this.staffForm.get('reportTo')?.setValue(match.staff_id);
    this.reportFilterCtrl.setValue(match.name);
    this.assignedReportUser = match;
  } else {
    this.reportFilterCtrl.setValue(reportToValue);
    this.staffForm.get('reportTo')?.setValue(reportToValue);
  }
}

closeDropdownOnOutsideClick(event: MouseEvent) {
  this.isReportDropdownOpen = false;
}
}
