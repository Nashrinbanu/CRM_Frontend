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
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
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
import { LeadsService } from '../../services/leads.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
// import { AngularEditorModule } from '@kolkov/angular-editor';
import { ActivityComponent } from '../activity/activity.component';
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
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-update-leads',
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
    ActivityComponent,
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

  templateUrl: './update-leads.component.html',
  styleUrl: './update-leads.component.scss',
})
export class UpdateLeadsComponent implements OnInit {
  private loadingTimeout: any;
  private isFormPatched = false;
  public apiCallsCompleted = {
    lead: false,
    contact: false,
    activity: false,
    status: false,
    assign: false,
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
  @HostBinding('@slideIn') animation = true;
  public selectedIndex: number = 0;
  public leadDetails: any;
  public isEditMode: boolean[] = [];
  public updateForm: FormGroup;
  public leadForm: any;
  public isSubmitting: boolean = false;
  public isFormSaved: boolean = false;
  public acivityType: any;
  public viewId: any;
  public serviceInterests: string[] = [];
  public activityDetails: any;
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
  public isLoading = true;
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
  @Output() closed = new EventEmitter<void>();
  public statusData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private eRef: ElementRef,
    private renderer: Renderer2,
    private leadsService: LeadsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.updateForm = this.fb.group({
      companyName: ['', [Validators.required, this.leadNameValidator]],
      revenue: ['', ],
      industryType: ['', ],
      companySize: [null, ],
      country: ['', ],
      state: ['', ],
      city: ['', ],
      postalCode: ['', ],
      address: ['', ],
      service_interest: [[]],
      companyMobileNumber: ['', [Validators.required, this.mobileNumberValidator]],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyWebsite: ['', [this.websiteValidator]],
      companyInfo: ['', ],
      comments: [''],
      social_media_url: this.fb.group({
        linkedin: [''],
        instagram: [''],
        facebook: [''],
        twitter: [''],
      }),
      contacts: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Loading timeout reached - forcing stop');
        this.isLoading = false;
      }
    }, 1000);

    if (!this.data?.id) {
      console.error('No ID provided for UpdateLeadsComponent');
      this.isLoading = false;
      return;
    }

    this.viewId = this.data.id;
    this.getAssignDetails();
    this.getLeadById(this.data.id);
    this.getContactId(this.data.id);
    // this.getStatusDetails();
    this.getCombinedActivityAndStatus(this.data.id);
    this.contacts = this.fb.array([this.createContactGroup('Primary')]);

    this.meetingUrl = 'https://meet.google.com/xyz-abc-def';
    this.safeMeetingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.meetingUrl
    );
  }
  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  getFormControl(group: FormGroup, field: string): FormControl {
    return (group.get(field) as FormControl) ?? new FormControl('');
  }

  addContact() {
    const label = 'Primary';
    this.contacts.push(this.createContactGroup(label));
    // const labels = ['Secondary'];
    // const currentCount = this.contacts.length;

    // if (currentCount < labels.length + 1) {
    //   this.contacts.push(this.createContactGroup(labels[currentCount - 1]));
    // }
  }

  toggleEdit(field: string): void {
    this.editingField = field;
    if (!this.updateForm.get(field)?.value) {
      this.updateForm.get(field)?.setValue('');
    }
  }

  get contactDetails(): FormArray {
    return this.updateForm.get('contactDetails') as FormArray;
  }

  private tryPatchAssignedUser() {
    if (!this.isFormPatched && this.leadDetails && this.users.length > 0) {
      this.patchData(this.leadDetails);
      this.isFormPatched = true;
    }
  }

  getLeadById(id: any) {
    this.isLoading = true;
    this.leadsService.getLeadById(id).subscribe({
      next: (data) => {
        this.leadDetails = data;
        // this.patchData(data); // Remove this direct call
        this.apiCallsCompleted.lead = true;
        this.tryPatchAssignedUser();
        this.checkAllApiCallsComplete();
      },
      error: (err) => {
        console.error('Error fetching lead:', err);
        this.apiCallsCompleted.lead = true;
        this.checkAllApiCallsComplete();
      },
    });
  }

  createContactGroup(label: string, contactData?: any, index?: number, total?: number): FormGroup {
    let finalLabel = label;
    if (total === 1) {
      finalLabel = 'Primary';
    } else if (contactData && typeof contactData.active_contact !== 'undefined') {
      finalLabel = contactData.active_contact ? 'Primary' : 'Secondary';
    }
    return this.fb.group({
      label: [finalLabel],
      name: [contactData?.name || '', Validators.required],
      job_title: [contactData?.job_title || '', Validators.required],
      email: [
        contactData?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        contactData?.phone || '', 
        [Validators.required, this.phoneValidator]
      ],
      id: [contactData?.id || null],
    });
  }

  // Custom phone number validator for Indian mobile numbers
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    }
    
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(control.value)) {
      return { invalidPhone: true };
    }
    
    return null;
  }

  getContactId(id: any) {
    console.log(id);
    this.isLoading = true;
    this.leadsService.getContactId(id).subscribe({
      next: (data) => {
        try {
          // Clear existing contacts first
          while (this.contacts.length !== 0) {
            this.contacts.removeAt(0);
          }

          // Process contacts data
          const contactList = Array.isArray(data) ? data : [];
          const totalContacts = contactList.length;
          const hasPrimary = contactList.some((c: any) => c.active_contact);

          contactList.forEach((contact: any, idx: number) => {
            // If no primary exists, make the first contact primary
            const isPrimary = hasPrimary ? contact.active_contact : idx === 0;
            this.contacts.push(this.createContactGroup(
              isPrimary ? 'Primary' : 'Secondary',
              contact,
              idx,
              totalContacts
            ));
          });

          this.apiCallsCompleted.contact = true;
          this.checkAllApiCallsComplete();
        } catch (error) {
          console.error('Error processing contacts:', error);
          this.apiCallsCompleted.contact = true;
          this.checkAllApiCallsComplete();
        }
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
        this.apiCallsCompleted.contact = true;
        this.checkAllApiCallsComplete();
      },
    });
  }

  // Corrected getActivityById method
  // getActivityById(id: any) {
  //   this.isLoading = true;
  //   this.leadsService.getActivityById(id).subscribe({
  //     next: (data) => {
  //       // Normalize to match old structure
  //       const activities = Array.isArray(data) ? data : [data];

  //       // Create structure that patchData expects
  //       const leadData = {
  //         ...this.leadDetails, // Preserve existing lead details
  //         activity_tracking: activities,
  //         // Map other required fields from first activity if needed
  //         service_interest: activities[0]?.service_interest,
  //         company_name: activities[0]?.company_name,
  //         // Include all other fields your patchData expects
  //       };

  //       this.activityDetails = activities[0];
  //       this.pinnedNote = activities[0]?.notes?.find((n: any) => n?.is_pinned);

  //       // Patch with the properly structured data
  //       // this.patchData(leadData);

  //       this.apiCallsCompleted.activity = true;
  //       this.checkAllApiCallsComplete();
  //     },
  //     error: (err) => {
  //       console.error('Error fetching activities:', err);
  //       this.apiCallsCompleted.activity = true;
  //       this.checkAllApiCallsComplete();
  //     },
  //   });
  //       this.isLoading = false;
  // }

  getCombinedActivityAndStatus(id: any) {
    this.isLoading = true;
  
    forkJoin({
      activityData: this.leadsService.getActivityById(id),
      statusData: this.leadsService.getLeadStageDetails(this.data.id)
    }).subscribe({
      next: ({ activityData, statusData }) => {
  
        // Handle activityData
        const activities = Array.isArray(activityData) ? activityData : [activityData];
        const leadData = {
          ...this.leadDetails,
          activity_tracking: activities,
          service_interest: activities[0]?.service_interest,
          company_name: activities[0]?.company_name,
        };
  
        this.activityDetails = activities[0];
        // First try to find a pinned note, if not found, show the first note
        this.pinnedNote = activities[0]?.notes?.find((n: any) => n?.is_pinned) || activities[0]?.notes?.[0];
        this.apiCallsCompleted.activity = true;
  
        // Set statusData for ActivityComponent
        this.statusData = statusData || [];
  
        // Handle statusData
        if (statusData && statusData.length > 0) {
          let extractedStages = statusData
            .map((item: any) => item.changed_fields?.lead_opportunity?.new)
            .filter(
              (status: any) =>
                status &&
                this.stages.some(
                  (s) => s.name.toLowerCase() === status.toLowerCase()
                )
            );
  
          extractedStages.forEach((stage: any) => {
            const matchedStage = this.stages.find(
              (s) => s.name.toLowerCase() === stage.toLowerCase()
            )?.name;
            if (matchedStage && !this.progressStages.includes(matchedStage)) {
              this.progressStages.push(matchedStage);
            }
          });
  
          this.progressStages = this.progressStages.sort(
            (a, b) => this.getStageIndex(a) - this.getStageIndex(b)
          );
  
          this.currentStage =
            this.stages.find(
              (s) =>
                s.name === this.progressStages[this.progressStages.length - 1]
            ) || this.stages[0];
        } else {
          this.progressStages = ['New'];
          this.currentStage = this.stages[0];
        }
  
        // Final check for both APIs completion
        this.checkAllApiCallsComplete();
      },
      error: (err) => {
        console.error('Error in combined API calls:', err);
  
        // Fallback handling
        this.apiCallsCompleted.activity = true;
        this.progressStages = ['New'];
        this.currentStage = this.stages[0];
  
        this.checkAllApiCallsComplete();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  patchData(data?: any): void {
    try {
      this.serviceInterests = data?.service_interest
        ? data?.service_interest.split(',').map((tag: string) => tag.trim())
        : [];
          // Format revenue for display if it exists
    const formattedRevenue = data?.revenue !== null && data?.revenue !== undefined
    ? this.formatIndianCurrency(data.revenue)
    : '';

      this.updateForm.patchValue({
        companyName: data?.company_name || '',
    
        industryType: data?.industry_type || '',
        companySize: data?.company_size || null,
        revenue: data?.revenue || null, // Keep raw value for form
        // score: data?.score || null,
        companyMobileNumber: data?.company_mobile_number || '',
        companyEmail: data?.company_email || '',
        companyWebsite: data?.company_website || '',
        address: data?.address || '',
        country: data?.country || '',
        state: data?.state || '',
        city: data?.city || '',
        postalCode: data?.postal_code || '',
        companyInfo: data?.company_info || '',
        comments: data?.comment || '',
      });
      const revenueControl = this.updateForm.get('revenue');
      if (revenueControl) {
        revenueControl.setValue(data?.revenue || null, { emitEvent: false });
      }
      
      this.selectedIndustry = data?.industry_type || 'Select Industry Type';

      // Handle lead opportunity stage
      if (data?.lead_opportunity) {
        const matchedStage = this.stages.find(
          (stage) =>
            stage.name.toUpperCase() === data?.lead_opportunity.toUpperCase()
        );
        if (matchedStage) {
          this.selectStage(matchedStage);
        }
      }

      this.assignedUsers = [];
      if (data?.assigned_to) {
        const assignedUser = this.users.find(
          (user) => String(user.staff_id) === String(data?.assigned_to)
        );
        if (assignedUser) {
          this.assignedUsers.push(assignedUser);
          this.assignedUser = assignedUser;
        }
      }

      const socialMediaFormValue: any = {
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
      };

      const regexMap: { [key: string]: RegExp } = {
        instagram: /instagram\.com\/([a-zA-Z0-9._-]+)/,
        facebook: /facebook\.com\/([a-zA-Z0-9._-]+)/,
        linkedin: /linkedin\.com\/in\/([a-zA-Z0-9-._]+)/,
        twitter: /(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/,
      };

      if (Array.isArray(data?.social_media_url)) {
        data?.social_media_url.forEach((url: string) => {
          for (const platform in regexMap) {
            const match = url.match(regexMap[platform]);
            if (match) {
              socialMediaFormValue[platform] = match[match.length - 1];
              this.validSocialLinks[platform] = true;
            }
          }
        });
      }

      this.updateForm.patchValue({ social_media_url: socialMediaFormValue });
    } catch (error) {
      console.error('Error patching data:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  toggleEditMode(index: number): void {
    this.isEditMode[index] = !this.isEditMode[index];
  }

  private showError(message: string): void {
    this.snackBar.dismiss(); // Dismiss any open snackbar first
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  // updateLead(): void {
  //   this.isLoading = true;
  //   const allContacts = this.contacts.value.map(
  //     (contact: any, index: number) => ({
  //       name: contact.name || '',
  //       email: contact.email || '',
  //       phone: contact.phone || '',
  //       job_title: contact.job_title || '',
  //       active_contact: contact.label === 'Primary',
  //       id: contact.id || null, // Include contact ID for updates
  //     })
  //   );

  //   const socialMediaFormValue =
  //     this.updateForm.get('social_media_url')?.value || {};

  //   const baseUrls: { [key: string]: string } = {
  //     instagram: 'https://instagram.com/',
  //     facebook: 'https://facebook.com/',
  //     linkedin: 'https://linkedin.com/in/',
  //     twitter: 'https://x.com/',
  //   };

  //   const linksToSend: string[] = Object.entries(socialMediaFormValue)
  //     .filter(
  //       ([platform, username]) => username && (username as string).trim() !== ''
  //     )
  //     .map(
  //       ([platform, username]) =>
  //         baseUrls[platform] + (username as string).trim()
  //     );

  //   const notes = {
  //     activity_id: 0,
  //     title: this.selectedStatus.toUpperCase(),
  //     description: this.comment || '',
  //     is_pinned: false,
  //     attachments: [],
  //   };

  //   const updatedData = {
  //     company_name: this.updateForm.value.companyName || '',
  //     industry_type: this.selectedIndustry || '',
  //     address: this.updateForm.value.address || '',
  //     city: this.updateForm.value.city || '',
  //     postal_code: this.updateForm.value.postalCode || '',
  //     state: this.updateForm.value.state || '',
  //     country: this.updateForm.value.country || '',
  //     company_mobile_number: this.updateForm.value.companyMobileNumber || '',
  //     company_email: this.updateForm.value.companyEmail || '',
  //     company_website: this.updateForm.value.companyWebsite || '',
  //     company_info: this.updateForm.value.companyInfo || '',
  //     company_size: this.updateForm.value.companySize
  //       ? Number(this.updateForm.value.companySize) || null
  //       : null,
  //     comment: this.updateForm.value.comments || '',
  //     status: 'ACTIVE',
  //     source: this.leadDetails.source,
  //     contacts: allContacts,
  //     service_interest:
  //       this.serviceInterests.length > 0
  //         ? this.serviceInterests.join(', ')
  //         : '',
  //     social_media_url: linksToSend,
  //     lead_opportunity: this.selectedStatus.toUpperCase(),
  //     assigned_to: this.assignedUser?.staff_id || null,
  //     notes: notes,
  //   };

  //   this.leadsService.updateLead(updatedData, this.viewId).subscribe({
  //     next: (response) => {
  //       this.showSuccess('Lead updated successfully!');
  //       this.isLoading = false;
  //       // Refresh all data after update
  //       this.getLeadById(this.viewId);
  //       this.getContactId(this.viewId);
  //       this.getActivityById(this.viewId);
  //       this.getStatusDetails();
  //     },
  //     error: (err: any) => {
  //       console.error('API Error:', err);
  //       this.showError('Failed to update lead.');
  //       this.isLoading = false;
  //     },
  //   });
  // }

  updateLead(): void {
    this.isLoading = true;
  
    // Debug: Log the current form value before building the payload
    console.log('Current form value:', this.updateForm.value);
  
    // 1. First prepare and update LEAD data
    const socialMediaFormValue = this.updateForm.get('social_media_url')?.value || {};
  
    const baseUrls: { [key: string]: string } = {
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      linkedin: 'https://linkedin.com/in/',
      twitter: 'https://x.com/',
    };
  
    const linksToSend: string[] = Object.entries(socialMediaFormValue)
      .filter(
        ([platform, username]) => username && (username as string).trim() !== ''
      )
      .map(
        ([platform, username]) =>
          baseUrls[platform] + (username as string).trim()
      );
  
    const notes = {
      activity_id: 0,
      title: this.selectedStatus.toUpperCase(),
      description: this.comment || '',
      is_pinned: false,
      attachments: [],
    };
  
    // Get the revenue value from the form
    const revenueValue = this.updateForm.value.revenue;
    
    // Prepare the lead data with revenue included
    const leadData = {
      company_name: this.updateForm.value.companyName || '',
      revenue: revenueValue !== '' && revenueValue !== null
        ? Number(revenueValue)  // Convert to number if not empty
        : null,  // Send null if empty
      industry_type: this.selectedIndustry || '',
      address: this.updateForm.value.address || '',
      city: this.updateForm.value.city || '',
      postal_code: this.updateForm.value.postalCode || '',
      state: this.updateForm.value.state || '',
      country: this.updateForm.value.country || '',
      company_mobile_number: this.updateForm.value.companyMobileNumber || '',
      company_email: this.updateForm.value.companyEmail || '',
      company_website: this.updateForm.value.companyWebsite || '',
      company_info: this.updateForm.value.companyInfo || '',
      company_size: this.updateForm.value.companySize
        ? Number(this.updateForm.value.companySize) || null
        : null,
      comment: this.updateForm.value.comments || '',
      status: 'ACTIVE',
      source: this.leadDetails.source,
      service_interest:
        this.serviceInterests.length > 0
          ? this.serviceInterests.join(', ')
          : '',
      social_media_url: linksToSend,
      lead_opportunity: this.selectedStatus.toUpperCase(),
      assigned_to: (this.assignedUser && this.assignedUser.staff_id) ? this.assignedUser.staff_id : null,
    };
  
    console.log('Payload being sent:', leadData);
  
    // LEAD API CALL
    this.leadsService.updateLead(leadData, this.viewId).subscribe({
      next: (response) => {
        this.showSuccess('Lead updated successfully!');
        this.isLoading = false;
        // Refresh all data after update
        this.getLeadById(this.viewId);
        this.getContactId(this.viewId);
        this.getCombinedActivityAndStatus(this.viewId);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.showError('Failed to update lead.');
        this.isLoading = false;
      },
    });
  }

  updateContacts(): void {
    this.isLoading = true;
  
    const contactData = this.contacts.value.map((contact: any) => ({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      job_title: contact.job_title || '',
      active_contact: contact.label === 'Primary',

      lead_id: this.viewId,
    }));
  
    if (!contactData.length) {
      this.showError('No contact available to update');
      return;
    }

    // Use this.viewId as contactId in the API call, and send the array of contacts
    this.leadsService.updateContacts(this.viewId, contactData[0]).subscribe({
      next: (response) => {
        this.showSuccess('Contacts updated successfully!');
        this.refreshAllData();
      },
      error: (error) => {
        console.error('Contact update failed:', error);
        this.showError('Failed to update contacts');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  refreshAllData(): void {
    this.getLeadById(this.viewId);
    this.getContactId(this.viewId);
    this.getCombinedActivityAndStatus(this.viewId);
    // this.getStatusDetails();
  }

  private checkAllApiCallsComplete() {
    if (Object.values(this.apiCallsCompleted).every((complete) => complete)) {
      this.isLoading = false;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    }
  }

  private processContacts(contactList: any[]) {
    // Clear existing contacts
    this.contacts.clear();

    // Return early if no contacts
    if (!contactList.length) return;

    // Sort contacts - active first, then by most recent
    const sortedContacts = [...contactList].sort((a, b) => {
      // Sort active contacts first
      if (a.active_contact && !b.active_contact) return -1;
      if (!a.active_contact && b.active_contact) return 1;

      // Then sort by most recent updated_at
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    // Add sorted contacts to FormArray
    sortedContacts.forEach((contact) => {
      this.contacts.push(this.createContactFormGroup(contact));
    });
  }

  private createContactFormGroup(contact: any): FormGroup {
    return this.fb.group({
      label: [contact.active_contact ? 'Primary' : 'Secondary'],
      name: [contact.name || '', Validators.required],
      job_title: [contact.job_title || '', Validators.required],
      email: [contact.email || '', [Validators.required, Validators.email]],
      phone: [contact.phone || '', Validators.required],
    });
  }

  selectStep(step: any, index: any) {
    console.log(step, 'step');
    this.selectedStep = index;
    this.selectedStatus = step.name;
  }

  // formatIndianCurrency(amount?: any) {
  //   if (amount === null || amount === undefined) return '0';
  //   return new Intl.NumberFormat('en-IN', {
  //     maximumFractionDigits: 2,
  //   }).format(amount);
  // }
  socialMedia: { [key: string]: string } = {
    linkedin: 'assets/lead/LinkedIn.png',
    facebook: 'assets/lead/facebook.png',
    instagram: 'assets/lead/insta.png',
    twitter: 'assets/lead/twitter.png',
  };

  socialLinks: {
    url: string;
    imageUrl: string;
    username: string;
    id: number;
  }[] = [{ url: '', imageUrl: '', username: '', id: 1 }];

  dynamicIcons: { [key: string]: string } = {
    linkedin: 'assets/New-Icons/LinkedIn.svg',
    instagram: 'assets/New-Icons/skill-icons_instagram.svg',
    facebook: 'assets/New-Icons/Group.svg',
    twitter: 'assets/New-Icons/fa6-brands_square-x-twitter.svg',
  };

  openSocialProfile(platform: string): void {
    let url = this.updateForm.get('social_media_url')?.value[platform];

    if (url) {
      if (!url.startsWith('http')) {
        const domainMap: { [key: string]: string } = {
          linkedin: 'https://www.linkedin.com/in/',
          facebook: 'https://www.facebook.com/',
          instagram: 'https://www.instagram.com/',
          twitter: 'https://x.com/',
        };

        if (domainMap[platform]) {
          url = domainMap[platform] + url;
        } else {
          url = 'https://' + url;
        }
      }

      window.open(url, '_blank');
    } else {
      console.log(`No URL available for ${platform}`);
    }
  }

  copyToClipboard(field: any) {
    const url = this.updateForm.get('social_media_url')?.get(field)?.value;

    if (url) {
      const domainMap: { [key: string]: string } = {
        linkedin: 'https://www.linkedin.com/in/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        twitter: 'https://x.com/',
      };

      const fullUrl = url.startsWith('http') ? url : domainMap[field] + url;

      navigator.clipboard.writeText(fullUrl).then(() => {
        console.log('Copied: ' + fullUrl);
      });
    }
  }

  updateSocialMedia(event: any, field: string): void {
    const link = event.target.value.trim().toLowerCase();
    const detectedPlatform = this.getPlatform(link);
    let username = '';

    this.invalidFields = this.invalidFields.filter((f) => f !== field);

    if (detectedPlatform) {
      username = this.extractUsername(link, detectedPlatform);

      if (detectedPlatform !== field) {
        this.updateForm.get('social_media_url')?.get(field)?.setValue('');
        this.invalidFields.push(field);
        this.validSocialLinks[field] = false;
        return;
      }

      event.target.value = username;
      this.updateForm.get('social_media_url')?.get(field)?.setValue(username);
      this.validSocialLinks[field] = true;
    } else {
      this.updateForm.get('social_media_url')?.get(field)?.setValue('');
      this.invalidFields.push(field);
      this.validSocialLinks[field] = false;
    }
  }

  extractUsername(url: string, platform: string): string {
    let username = '';
    const regexMap: { [key: string]: RegExp } = {
      instagram: /instagram\.com\/([a-zA-Z0-9._-]+)/,
      facebook: /facebook\.com\/([a-zA-Z0-9._-]+)/,
      linkedin: /linkedin\.com\/in\/([a-zA-Z0-9-._]+)/,
      twitter: /(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/,
    };

    const match = url.match(regexMap[platform]);

    if (match) {
      username = match[platform === 'twitter' ? 2 : 1];
      console.log(`Extracted Username for ${platform}:`, username);
    } else {
    }

    return username;
  }

  addNewInputField(): void {
    const newId = this.socialLinks.length + 1;
    this.socialLinks.push({ url: '', imageUrl: '', username: '', id: newId });
  }

  patchSocialLinks(urls: any): void {
    this.updateForm.patchValue({
      social_media_url: {
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
      },
    });

    if (Array.isArray(urls)) {
      const socialLinksObject: any = {};
      urls.forEach((url) => {
        const platform = this.getPlatform(url);
        if (platform) {
          socialLinksObject[platform] = url;
        }
      });

      this.updateForm.patchValue({ social_media_url: socialLinksObject });
    } else if (typeof urls === 'object') {
      this.updateForm.patchValue({ social_media_url: urls });
    }
  }

  getPlatform(url: string): string {
    if (url.includes('linkedin')) return 'linkedin';
    if (url.includes('facebook')) return 'facebook';
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
    return '';
  }

  // getStatusDetails() {
  //   this.leadsService.getLeadStageDetails(this.data.id).subscribe({
  //     next: (data) => {
  //       if (data && data.length > 0) {
  //         let extractedStages = data
  //           .map((item: any) => item.changed_fields?.lead_opportunity?.new)
  //           .filter(
  //             (status: any) =>
  //               status &&
  //               this.stages.some(
  //                 (s) => s.name.toLowerCase() === status.toLowerCase()
  //               )
  //           );
  //         extractedStages.forEach((stage: any) => {
  //           const matchedStage = this.stages.find(
  //             (s) => s.name.toLowerCase() === stage.toLowerCase()
  //           )?.name;
  //           if (matchedStage && !this.progressStages.includes(matchedStage)) {
  //             this.progressStages.push(matchedStage);
  //           }
  //         });
  //         // extractedStages.forEach((stage: any) => {
  //         //   if (!this.progressStages.includes(stage)) {
  //         //     this.progressStages.push(stage);
  //         //   }
  //         // });

  //         this.progressStages = this.progressStages.sort(
  //           (a, b) => this.getStageIndex(a) - this.getStageIndex(b)
  //         );
  //         this.currentStage =
  //           this.stages.find(
  //             (s) =>
  //               s.name === this.progressStages[this.progressStages.length - 1]
  //           ) || this.stages[0];
  //       } else {
  //         this.progressStages = ['New'];
  //         this.currentStage = this.stages[0];
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching lead stage details', err);
  //       this.progressStages = ['New'];
  //       this.currentStage = this.stages[0];
  //     },
  //   });
  // }

  getStageIndex(stageName: string): number {
    console.log(stageName, 'stageName');
    return this.stages.findIndex((stage) => stage.name === stageName);
  }

  selectStage(stage: any) {
    this.selectedStatus = stage.name;
  }

  openDropdown(stage: any) {
    this.selectedStatus = stage.name;
    this.dropdownOpen = true;
  }

  saveStage() {
    if (!this.comment.trim()) {
      this.showSuccess('Pls enter valid comment for to change stage');
      return;
    }
    this.currentStage =
      this.stages.find((s) => s.name === this.selectedStatus) || this.stages[0];
    this.dropdownOpen = false;
    this.updateLead();
  }

  updateStageFromAPI(response: any) {
    if (
      response &&
      response.length > 0 &&
      response[0].changed_fields &&
      response[0].changed_fields.lead_opportunity
    ) {
      const newStageName = response[0].changed_fields.lead_opportunity.new;
      const foundStage = this.stages.find(
        (stage) => stage.name === newStageName
      );
      this.currentStage = foundStage ? foundStage : this.stages[0];
    } else {
      this.currentStage = this.stages[0];
    }
  }

  filterHashtags() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredHashtags = this.hashtagSuggestions.filter(
      (tag) =>
        tag.toLowerCase().includes(searchTermLower) &&
        !this.serviceInterests.includes(tag)
    );
    this.showDropdown = this.filteredHashtags.length > 0;
  }

  selectHashtag(tag: string) {
    if (!this.serviceInterests.includes(tag)) {
      this.serviceInterests.push(tag);
    }
    this.searchTerm = '';
    this.showDropdown = false;
  }

  addServiceInterest(event: any) {
    event.preventDefault();
    const value = this.searchTerm.trim();
    if (value && !this.serviceInterests.includes(value)) {
      this.serviceInterests.push(value);
    }
    this.searchTerm = '';
    this.showDropdown = false;
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
    if (this.dialogRef) {
      if (this.dialogElement) {
        this.renderer.addClass(this.dialogElement, 'dialog-exit');
        setTimeout(() => {
          this.dialogRef.close();
        }, 400);
      } else {
        this.dialogRef.close();
      }
    } else {
      this.closed.emit();
    }
  }

  getAssignDetails() {
    this.leadsService.getAssign().subscribe({
      next: (data) => {
        this.users = data.data;
        this.tryPatchAssignedUser();
      },
      error: (err) => {
        console.error('Error fetching lead:', err);
      },
    });
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

  getStageClass(index: number): string {
    const stageClasses = [
      'bg-green-500',
      'bg-blue-500',
      'bg-gray-800',
      'bg-purple-500',
      'bg-gray-500',
      'bg-red-500',
    ];

    return `${stageClasses[index] || 'bg-gray-400'} ${
      index > this.currentStageIndex ? 'opacity-50' : ''
    }`;
  }

  @ViewChildren('inputRef') inputRefs!: QueryList<ElementRef>;

  focusInput(field: string): void {
    const inputElement = this.inputRefs.find(
      (ref) => ref.nativeElement.getAttribute('formControlName') === field
    );
    inputElement?.nativeElement.focus();
  }

  loadActivityId() {
    const activityData = {
      lead_id: this.data.id,
    };

    this.leadsService.addActivity(activityData).subscribe({
      next: (data) => {},
      error: () => {},
    });
  }

  getProfileImage(user: any): string {
    if (!user?.profileImage || user.profileImage === 'string') {
      return 'assets/lead/Avatar.png';
    }
    return this.imageUrl + user.profileImage;
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
    this.reorderContacts();
  }

  private reorderContacts(): void {
    const contactsArray = this.contacts.controls.map(control => control.value);
    // Primary first, then secondary
    contactsArray.sort((a, b) => {
      if (a.label === 'Primary' && b.label !== 'Primary') return -1;
      if (a.label !== 'Primary' && b.label === 'Primary') return 1;
      return 0;
    });
    // Clear and re-add in order
    while (this.contacts.length) {
      this.contacts.removeAt(0);
    }
    contactsArray.forEach(contact => {
      this.contacts.push(this.createContactGroup(contact.label, contact));
    });
  }

  /**
   * Save an individual contact using the createContact API
   * @param contactGroup The FormGroup for the contact
   * @param index The index of the contact in the FormArray
   */
  public saveContact(contactGroup: FormGroup, index: number): void {
    if (contactGroup.invalid) {
      contactGroup.markAllAsTouched();
      this.snackBar.open('Please fill all required fields for this contact.', 'Close', { duration: 3000 });
      return;
    }
    const contactData = {
      ...contactGroup.value,
      id: 0,
      status: 'ACTIVE',
      active_contact: contactGroup.value.label === 'Primary',
      updated_at: new Date().toISOString(),
    };
    this.leadsService.createContact(this.viewId, contactData).subscribe({
      next: (response) => {
        this.snackBar.open('Contact saved successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error saving contact. Please try again.', 'Close', { duration: 3000 });
        console.error('Error saving contact:', error);
      }
    });
  }

  public updateContact(contactGroup: FormGroup, index: number): void {
  
    if (contactGroup.invalid) {
      contactGroup.markAllAsTouched();
      this.snackBar.open('Please fill all required fields for this contact.', 'Close', { duration: 3000 });
      return;
    }
  
    const contactId = contactGroup.value.id;
    
    if (!contactId || contactId === 0) {
      this.snackBar.open('Contact ID is missing or invalid for update.', 'Close', { duration: 3000 });
      return;
    }
  
    const contactData = {
      ...contactGroup.value,
      status: 'ACTIVE',
      active_contact: contactGroup.value.label === 'Primary',
      updated_at: new Date().toISOString(),
    };
  
    this.leadsService.updateContacts(contactId, contactData).subscribe({
      next: (response) => {
        this.snackBar.open('Contact updated successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error updating contact. Please try again.', 'Close', { duration: 3000 });
        console.error('Error updating contact:', error);
      }
    });
  }
  
  isFieldInvalid(group: FormGroup, field: string): boolean {
    const control = group.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldErrorMessage(group: FormGroup, field: string): string {
    const control = group.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['invalidPhone']) return 'Please enter a valid phone number';
    if (control.errors['invalidMobile']) return 'Please enter a valid 10-digit mobile number';
    if (control.errors['invalidWebsite']) return 'Please enter a valid website URL';
    if (control.errors['invalidLeadName']) return 'Please enter only letters (no numbers allowed)';
    if (control.errors['maxlength']) return 'Maximum length exceeded';
    return 'Invalid value';
  }

  formatPhoneNumber(event: any, contactGroup: FormGroup) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.substring(0, 10);
    contactGroup.get('phone')?.setValue(value, { emitEvent: false });
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const input = event.target as HTMLInputElement;
    if (charCode === 8 || charCode === 9 || charCode === 27 || charCode === 13 || charCode === 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (input.value.length === 0) {
      const digit = String.fromCharCode(charCode);
      if (digit < '6' || digit > '9') {
        return false;
      }
    }
    return true;
  }
  onlyNumber(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const input = event.target as HTMLInputElement;
    if (charCode === 8 || charCode === 9 || charCode === 27 || charCode === 13 || charCode === 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (input.value.length === 0) {
      const digit = String.fromCharCode(charCode);
     
    }
    return true;
  }

  onPhonePaste(event: ClipboardEvent, contactGroup: FormGroup) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const numericOnly = pastedText.replace(/[^0-9]/g, '');
    if (numericOnly.length > 0) {
      const firstDigit = parseInt(numericOnly.charAt(0));
      if (firstDigit >= 6 && firstDigit <= 9) {
        const input = event.target as HTMLInputElement;
        const currentValue = input.value;
        const newValue = currentValue + numericOnly.substring(0, 10 - currentValue.length);
        contactGroup.get('phone')?.setValue(newValue, { emitEvent: false });
      }
    }
  }

  // Custom mobile number validator for 10 digits only
  mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    }
    
    // Remove any non-digit characters
    const cleanValue = control.value.toString().replace(/\D/g, '');
    
    if (cleanValue.length !== 10) {
      return { invalidMobile: true };
    }
    
    // Check if it starts with 6, 7, 8, or 9 (Indian mobile numbers)
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(cleanValue)) {
      return { invalidMobile: true };
    }
    
    return null;
  }

  // Custom website validator
  websiteValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const websitePattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
    if (!websitePattern.test(control.value)) {
      return { invalidWebsite: true };
    }
    
    return null;
  }

  // Custom company size validator (allow words)
  companySizeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    }
    
    // Allow any value (words, numbers, etc.)
    return null;
  }

  // Custom lead name validator (letters only, no numbers)
  leadNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    }
    
    // Check if it contains numbers
    const numberPattern = /[0-9]/;
    if (numberPattern.test(control.value.toString())) {
      return { invalidLeadName: true };
    }
    
    return null;
  }

  // Restrict input to letters only for lead name
  onlyLettersForLeadName(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 8 || charCode === 9 || charCode === 27 || charCode === 13 || charCode === 46 || charCode === 32) {
      return true; // Allow backspace, tab, escape, enter, delete, and space
    }
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false; // Allow only letters A-Z and a-z
    }
    return true;
  }

  // Format lead name input to remove numbers
  formatLeadName(event: any) {
    let value = event.target.value;
    value = value.replace(/[0-9]/g, '');
    this.updateForm.get('companyName')?.setValue(value, { emitEvent: false });
  }

  // Restrict input to numbers only for mobile number (6-9 as first digit)
  onlyNumbersForMobile(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const input = event.target as HTMLInputElement;
    
    if (charCode === 8 || charCode === 9 || charCode === 27 || charCode === 13 || charCode === 46) {
      return true; // Allow backspace, tab, escape, enter, delete
    }
    
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false; // Allow only numbers
    }
    
    // For first digit, only allow 6, 7, 8, 9
    if (input.value.length === 0) {
      const digit = String.fromCharCode(charCode);
      if (digit < '6' || digit > '9') {
        return false;
      }
    }
    
    // Limit to 10 digits
    if (input.value.length >= 10) {
      return false;
    }
    
    return true;
  }

  // Format mobile number input to remove non-numeric characters
  formatMobileNumber(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.substring(0, 10);
    this.updateForm.get('companyMobileNumber')?.setValue(value, { emitEvent: false });
  }

  formatRevenueInput(event: any) {
    let value = event.target.value.replace(/,/g, '');
    if (value) {
      value = parseInt(value, 10);
      if (!isNaN(value)) {
        event.target.value = this.formatIndianCurrency(value);
        this.updateForm.get('revenue')?.setValue(value, { emitEvent: false });
      }
    } else {
      this.updateForm.get('revenue')?.setValue(null, { emitEvent: false });
    }
  }
  
// Format for display with ₹ symbol
getFormattedRevenue(): string {
  const value = this.updateForm.get('revenue')?.value;
  if (value === null || value === undefined || value === '') return '';
  return '₹' + this.formatIndianCurrency(value);
}

// Original formatIndianCurrency method (keep this)
formatIndianCurrency(amount?: any): string {
  if (amount === null || amount === undefined || amount === '') return '';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(amount);
}

// Handle input changes
onRevenueInput(event: any) {
  // Remove all non-digit characters and ₹ symbol
  let value = event.target.value.replace(/[^0-9]/g, '');
  
  // Convert to number (or null if empty)
  const numericValue = value ? parseInt(value, 10) : null;
  
  // Update the form control with the raw numeric value
  this.updateForm.get('revenue')?.setValue(numericValue, { emitEvent: false });
  
  // Format the display value
  event.target.value = this.getFormattedRevenue();
}

// Returns true if there are any notes, emails, or call logs in activityDetails
hasActivities(): boolean {
  const details = this.activityDetails;
  return !!(
    (details?.notes && details.notes.length > 0) ||
    (details?.emails && details.emails.length > 0) ||
    (details?.callLogs && details.callLogs.length > 0)
  );
}

}
