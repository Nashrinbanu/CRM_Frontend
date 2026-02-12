import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '../../services/leads.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabLink, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { FileUploadService } from '../../../../services/file-upload/file-upload.service';
import { KafkaService } from '../../services/kafka.service';
import { KeyValuePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

interface EmailData {
  recipients: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
}

@Pipe({ name: 'orderByPinned', standalone: true })
export class OrderByPinnedPipe implements PipeTransform {
  transform(items: any[]): any[] {
    if (!Array.isArray(items)) return items;
    return [...items].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
  }
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    QuillModule,
    CommonModule,
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    RouterLinkActive,
    MatCardModule,
    MatSnackBarModule,
    MatRadioModule,
    MatMenuModule,
    MatTabsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
    KeyValuePipe,
    OrderByPinnedPipe,
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityComponent implements OnInit, OnChanges {
  editorConfig = {
    toolbarAdaptive: false, // Ensures toolbar placement is fixed
    height: 200,
    buttons: 'bold,italic,underline,strikethrough',
  };
   @Input() activities: Array<{ type: string; date: Date }> = [];
  mailForm!: FormGroup;
  showComposeEmail = false;
  showCC = false;
  showBCC = false;
  activeTab: string = 'activity';
  callLogForm!: FormGroup;
  tabs = [
    { id: 'activity', label: 'Activity' },
    { id: 'email', label: 'Email' },
    { id: 'call', label: 'Call' },
    { id: 'meeting', label: 'Meeting' },
    { id: 'notes', label: 'Notes' },
  ];
  noteContent: string = '';
  @Input() leadId: any;
  @Input() activityData: any;
  scheduleCallForm!: FormGroup;
  notesForm!: FormGroup
  isLoading: boolean = false;
  aggregatedActivities: any[] = [];
  attachedImages: any[] = [];
  attachedFiles: any[] = [];
  public attachedBoolean: boolean = false;
  public isPinned: boolean = false;
  @Output() getByIdApiTrigger = new EventEmitter<string>();
  editorContent = '';
  @Input() statusHistory: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Show 10 records per page
  
  // Merged pagination properties for Activity tab
  mergedPage: number = 1;
  mergedPageSize: number = 10; // Show 10 records per page in Activity tab
  mergedActivities: any[] = [];
  
  // Individual tab pagination properties
  emailPage: number = 1;
  emailPageSize: number = 10;
  callPage: number = 1;
  callPageSize: number = 10;
  notesPage: number = 1;
  notesPageSize: number = 10;
  
  quillConfig = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ],
  };
  selectedFiles: any[] = [];
  public filepath: any[] = [];
  callForOptions = [
    { value: 'newContact', label: 'New Contact' },
    { value: 'existingContact', label: 'Existing Contact' }
  ];

  selectedCallFor: string | null = null;
  showCallForDropdown = false;
  callTypeOptions = [
    { value: 'incoming', label: 'Incoming' },
    { value: 'outgoing', label: 'Outgoing' },
    { value: 'missed', label: 'Missed' }
  ];

  selectedCallType: string | null = null;
  showCallTypeDropdown = false;
  callPurposeOptions = [
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' }
  ];

  callStatusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'canceled', label: 'Canceled' }
  ];

  selectedCallPurpose: string | null = null;
  showCallPurposeDropdown = false;

  selectedCallStatus: string | null = null;
  showCallStatusDropdown = false;
  @ViewChild('editor', { static: false }) editor!: ElementRef;

  editingNoteId: string | null = null;
  editNoteContent: string = '';
  editNoteTitle: string = '';
  editNoteDescription: string = '';

  visibleMergedCount = 10;
  visibleNotesCount = 10;
  visibleCallsCount = 10;

  loadingMerged = false;
  loadingNotes = false;
  loadingCalls = false;

  users: any[] = [];

  public imageUrl = environment.galleryUrl;

  constructor(
    private fb: FormBuilder,
    private leadsService: LeadsService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private fileUploadService: FileUploadService,
    private kafkaService: KafkaService
  ) { }

  ngOnInit(): void {
    // Fetch users for mapping IDs to names
    this.leadsService.getAssign().subscribe({
      next: (data) => {
        this.users = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
    (this.activityData, "activity")
    this.initForms();
    this.aggregateActivities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityData'] && changes['activityData'].currentValue) {
      this.aggregateActivities();
    }
  }

  initForms(): void {
    this.mailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [this.optionalEmailValidator]],
      bcc: ['', [this.optionalEmailValidator]],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
    this.scheduleCallForm = this.fb.group({
      callTo: ['', Validators.required],
      callType: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      callPurpose: ['', Validators.required],
      agenda: ['', [Validators.required, Validators.maxLength(500)]]
    });
    this.notesForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      notes: ['', Validators.required],
    });

    this.callLogForm = this.fb.group({
      callFor: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      callType: [''],
      date: ['', Validators.required],
      startTime: ['', [Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      endTime: ['', [Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      callDuration: [''],
      callPurpose: [''],
      callStatus: [''],
      description: ['']
    });
  }

  optionalEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null; // valid if empty
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : { email: true };
  }

  markFormGroupTouched() {
    Object.keys(this.callLogForm.controls).forEach(key => {
      const control = this.callLogForm.get(key);
      control?.markAsTouched();
    });
  }

  get cc() {
    return this.mailForm.get('cc');
  }

  get bcc() {
    return this.mailForm.get('bcc');
  }


  toggleCC(): void {
    this.showCC = !this.showCC;
  }

  toggleBCC(): void {
    this.showBCC = !this.showBCC;
  }
  setActiveTabSocial(tabId?: any) {
    this.activeTab = tabId;
    if (tabId === 'activity') {
      this.aggregateActivities();
      this.mergedPage = 1; // Reset merged pagination
    } else if (tabId === 'email') {
      this.emailPage = 1; // Reset email pagination
    } else if (tabId === 'call') {
      this.callPage = 1; // Reset call pagination
    } else if (tabId === 'notes') {
      this.notesPage = 1; // Reset notes pagination
    }
    this.showComposeEmail = false;
  }

aggregateActivities(): void {
  console.log('Aggregating:', this.activityData);
  this.aggregatedActivities = [
    ...(this.activityData?.message ?? []).map((item: any) => ({ ...item, type: 'email' })),
    ...(this.activityData?.call ?? []).map((item: any) => ({ ...item, type: 'call' })),
    ...(this.activityData?.notes ?? []).map((item: any) => ({ ...item, type: 'notes' })),
  ];
  console.log('Aggregated:', this.aggregatedActivities);
  
  // Create merged activities array for Activity tab with pagination, including status
  this.mergedActivities = [
    ...(this.activityData?.message ?? []).map((item: any) => ({ ...item, _type: 'email', _date: item.created_at })),
    ...(this.activityData?.call ?? []).map((item: any) => ({ ...item, _type: 'call', _date: item.created_at })),
    ...(this.activityData?.notes ?? []).map((item: any) => ({ ...item, _type: 'notes', _date: item.created_at })),
    ...(this.statusHistory ?? []).map((status: any) => ({ ...status, _type: 'status', _date: status.change_timestamp })),
  ].sort((a, b) => new Date(b._date).getTime() - new Date(a._date).getTime());
  
  console.log('Merged Activities:', this.mergedActivities);
}

  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.native;
    const bodyControl = this.mailForm.get('body');
    if (bodyControl) {
      bodyControl.setValue((bodyControl.value || '') + emoji);
    }
  }


  closePopup() {
    this.showComposeEmail = false;
  }

  togglePin(noteId: any) {
    this.isPinned = !this.isPinned;
    this.leadsService.addPinnedNote(this.activityData?.id, noteId).subscribe({
      next: (response) => {
        this.showSuccess(response);
        this.isLoading = false;
        this.getByIdApiTrigger.emit(this.leadId);
      },
      error: (err) => {
        this.showError(err);
        this.isLoading = false;
      },
    });
  }

  
  private showError(message: string): void {
    this.snackBar.dismiss(); // Dismiss any open snackbar first
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 1000
    });
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 1000,
      panelClass: ['snackbar-success'],
    });
  }

  get attachments(): FormArray {
    return this.mailForm.get('attachments') as FormArray;
  }

  get images(): FormArray {
    return this.mailForm.get('images') as FormArray;
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.attachedBoolean = true;
      this.selectedFiles = Array.from(fileInput.files);
      this.fileUpload();
    } else {
      console.warn('No files selected.');
    }
  }

  fileUpload(): void {
    const formData = new FormData();

    this.selectedFiles.forEach((file) => {
      formData.append('file', file);
    });

    this.fileUploadService.fileUpload(formData).subscribe({
      next: (response: any) => {
        const uploadedFiles = Array.isArray(response.data) ? response.data : [response.data];

        uploadedFiles.forEach((file: any) => {
          const fileObj = { name: file.originalname, path: file.path, size: file.size };

          if (this.isImage(file.originalname)) {
            this.attachedImages.push(fileObj);
          } else {
            this.attachedFiles.push(fileObj);
          }
        });
      },
      error: (error) => {
        this.showError(error);
        this.isLoading = false;
      },
    });
  }


  isImage(fileName: string): boolean {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  removeFile(index: number, isImage: boolean): void {
    if (isImage) {
      this.attachedImages.splice(index, 1);
    } else {
      this.attachedFiles.splice(index, 1);
    }

    this.selectedFiles.splice(index, 1);

    if (this.attachedImages.length === 0 && this.attachedFiles.length === 0) {
      this.attachedBoolean = false;
    }
  }

  resetFileData(): void {
    this.attachedBoolean = false;
    this.attachedImages = [];
    this.attachedFiles = [];
    this.selectedFiles = [];
  }


  sendContent() {
    const content = this.editor.nativeElement.innerHTML; // or .innerText for plain text
    console.log('Sending Content:', content);

    const emailBody = { body: content };

    this.onSubmit(emailBody);
  }



  private extractErrorMessage(error: any, fallback: string): string {
    if (typeof error === 'string') return error;
    if (error?.error?.detail) return error.error.detail;
    if (error?.error && typeof error.error === 'string') return error.error;
    if (error?.message) return error.message;
    if (error?.statusText) return error.statusText;
    return fallback;
  }

  onSubmit(emailBody?: any): void {
    try {
 
  
      if (this.activeTab === 'call') {
        // Check if form is valid before submitting
        if (this.callLogForm.invalid) {
          this.markFormGroupTouched();
          this.showError('Please fill in all required fields correctly.');
          return;
        }

        // Validate required fields
        if (!this.selectedCallFor) {
          this.showError('Please select Call For.');
          return;
        }

        if (!this.callLogForm.value.contactNumber) {
          this.showError('Please enter Contact Number.');
          return;
        }

        if (!this.callLogForm.value.date) {
          this.showError('Please select Date.');
          return;
        }

        const callData = {
          id: 0,
          activity_id: this.activityData?.id,
          call_for: this.selectedCallFor || '',
          contact_number: this.callLogForm.value.contactNumber,
          call_type: this.selectedCallType || '',
          from_time: this.callLogForm.value.startTime,
          to_time: this.callLogForm.value.endTime,
          duration: this.callLogForm.value.callDuration,
          purpose: this.selectedCallPurpose || '',
          call_status: this.selectedCallStatus || '',
          description: this.callLogForm.value.description,
          call_date: this.callLogForm.value.date,
        };
  
        this.leadsService.addCall(callData).subscribe({
          next: (response) => {
            console.log('✅ addCall response:', response);
            this.showSuccess('Call log added successfully!');
            this.getByIdApiTrigger.emit(this.leadId);
            this.closePopup();
            this.isLoading = false;
            this.cd.detectChanges(); 
          },
          error: (err) => {
            console.error('❌ addCall error:', err);
            this.showError('Failed to add call log.');
            this.isLoading = false;
            this.cd.detectChanges(); 
          },
          complete: () => {
            console.log('ℹ️ addCall complete');
            this.isLoading = false;
            this.cd.detectChanges(); 
          }
        });
        
  
      } 
      else if (this.activeTab === 'email') {

        if (!this.activityData?.id) {
          this.showError('Invalid activity ID');
          return;
        }

        const formData = new FormData();

        formData.append('activity_id', String(this.activityData.id));
        formData.append('recipients', this.mailForm.value.to);
        formData.append('subject', this.mailForm.value.subject);
        formData.append('body', emailBody?.body || '');

        if (this.mailForm.value.cc) {
          formData.append('cc', this.mailForm.value.cc);
        }

        if (this.mailForm.value.bcc) {
          formData.append('bcc', this.mailForm.value.bcc);
        }

        // Attach selected files
        this.selectedFiles.forEach(file => {
          if (this.isImage(file.name)) {
            formData.append('image', file);
          } else {
            formData.append('file', file);
          }
        });

        this.kafkaService.sendEmailRequest(formData).subscribe({
          next: () => {
            this.showSuccess('Email sent successfully!');
            this.getByIdApiTrigger.emit(this.leadId);
            this.closePopup();
          },
          error: (err) => {
            console.error('Email API error:', err);
            this.showError('Failed to send email');
          }
        });
        // this.leadsService.addEmail(emailData, this.activityData?.id).subscribe({
        //   next: (response) => {
        //     this.showSuccess('Email sent successfully!');
        //     this.getByIdApiTrigger.emit(this.leadId);
        //     this.closePopup();
        //     this.triggerEmailApi(emailData); // NO isLoading here
        //     this.isLoading = false;
        //   },
        //   error: (err) => {
        //     this.showError('Failed to send email.');
        //     this.triggerEmailApi(emailData); // still try to send
        //     this.isLoading = false;
        //   },
        //   complete: () => {
        //     this.isLoading = false;
        //   }
        // });
  
      } else if (this.activeTab === 'notes') {
        const noteData = {
          activity_id: this.activityData?.id,
          title: this.notesForm.value.title,
          description: this.notesForm.value.description || emailBody?.body || '',
          attachments: this.attachedFiles.map(file => ({
            fileName: String(file.name || ''),
            fileType: String(file.type || ''),
            data: String(file.base64 || file.path || file.url || '')
          })),
          images: this.attachedImages.map(file => ({
            fileName: String(file.name || ''),
            fileType: String(file.type || ''),
            data: String(file.base64 || file.path || file.url || '')
          })),
          is_pinned: this.isPinned
        };
  
        this.leadsService.addNotes(noteData, this.activityData?.id).subscribe({
          next: (response) => {
            this.showSuccess('Note added successfully!');
            this.getByIdApiTrigger.emit(this.leadId);
            this.closePopup();
            this.isLoading = false;
          },
          error: (err) => {
            this.showError('Failed to add note.');
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
      this.isLoading = false;
    } catch (e: any) {
      this.isLoading = false;
      this.showError('Unexpected error occurred.');
      console.error('Submit Error:', e);
    }
  }
  

  

  getFileIcon(file: string): string {
    if (!file || typeof file !== 'string') return 'assets/lead/css.svg fill.svg';
    const ext = file.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'assets/lead/pdf.svg fill.svg';
      case 'doc':
      case 'docx':
        return 'assets/lead/doc.svg fill.svg';
      case 'css':
        return 'assets/lead/css.svg fill.svg';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return file;
      default:
        return 'assets/lead/css.svg fill.svg';
    }
  }

  getFileName(file: string): string {
    if (!file || typeof file !== 'string') return 'Unknown';
    return file.split('/').pop() || 'Unknown';
  }

  onImageError(event: any) {
    event.target.src = 'assets/lead/css.svg fill.svg';
  }

  toggleComposeEmail(): void {
    this.showComposeEmail = !this.showComposeEmail;
  }

  cancelScheduleCall() {
    this.scheduleCallForm.reset();
  }

  onClose() {
    this.showComposeEmail = false
  }

  formatTimeAndDifference(createdAt: string): string {
    // Convert UTC to IST (UTC+5:30)
    const createdDate = new Date(createdAt);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(createdDate.getTime() + istOffset);
    
    let hours = istDate.getHours();
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const formattedTime = `${hours}:${minutes} ${amPm}`;

    const now = new Date();
    const nowIST = new Date(now.getTime() + istOffset);
    const timeDifference = Math.abs(nowIST.getTime() - istDate.getTime());
    const diffHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const diffMinutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    let timeAgo = `${diffHours} hrs ago`;
    if (diffHours === 0) {
      timeAgo = `${diffMinutes} mins ago`;
    } else if (diffHours === 1) {
      timeAgo = `${diffHours} hr ago`;
    }

    // return `${formattedTime} (${timeAgo})`;
    return `${formattedTime}`
  }

  // Helper method to format dates in IST
  formatDateIST(dateString: string): string {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    return istDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  }

  // Helper method to format time in IST
  formatTimeIST(dateString: string): string {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    return istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  onFormatText() {
    console.log('Format text clicked');
  }

  onAttachFile() {
    console.log('Attach file clicked');
  }

  onInsertLink() {
    console.log('Insert link clicked');
  }

  onAddEmoji() {
    console.log('Add emoji clicked');
  }

  onWarning() {
    console.log('Warning clicked');
  }

  onInsertImage() {
    console.log('Insert image clicked');
  }

  onColorPicker() {
    console.log('Color picker clicked');
  }

  onSchedule() {
    console.log('Schedule clicked');
  }

  onDelete() {
    console.log('Delete clicked');
  }

  onMoreOptions() {
    console.log('More options clicked');
  }

  // emails: { name: string, email: string, avatar?: string }[] = [];
  // emailInput = '';

  // addEmail(event: KeyboardEvent) {
  //   const input = event.target as HTMLInputElement;
  //   const email = input.value.trim();

  //   if ((event.key === 'Enter' || event.key === ',') && email) {
  //     event.preventDefault();

  //     const name = email.split('@')[0].replace('.', ' ');

  //     if (!this.emails.find(e => e.email === email)) {
  //       this.emails.push({ name, email, avatar: this.getAvatar(email) });
  //     }

  //     this.emailInput = '';
  //   }
  // }

  // removeEmail(index: number) {
  //   this.emails.splice(index, 1);
  // }

  // getAvatar(email: string) {
  //   return `https://ui-avatars.com/api/?name=${email.charAt(0).toUpperCase()}&background=random&color=fff`;
  // }
  toggleAccordion(item: any) {
    item.expanded = !item.expanded;
  }

  onTrixChange(event: any) {
    const content = event.target.innerHTML;
    console.log(content);
  }
  selectCallFor(option: { value: string; label: string }) {
    this.selectedCallFor = option.label;
    this.callLogForm.get('callFor')?.setValue(option.value);
    console.log(this.selectedCallFor, "this.selectedCallFor")
    this.showCallForDropdown = false;
  }
  selectCallType(option: { value: string; label: string }) {
    this.selectedCallType = option.label;
    this.showCallTypeDropdown = false;
  }

  selectCallPurpose(option: { value: string; label: string }) {
    this.selectedCallPurpose = option.label;
    this.showCallPurposeDropdown = false;
  }

  selectCallStatus(option: { value: string; label: string }) {
    this.selectedCallStatus = option.label;
    this.showCallStatusDropdown = false;
  }

  selectedEmail: { name: string, email: string, profileImage?: string } | null = null;



  getRandomAvatar(email: string): string {
    return `https://ui-avatars.com/api/?name=${email.charAt(0).toUpperCase()}&background=random`;
  }

  // emails: { address: string, avatar?: string }[] = [];

  // addEmail(email: string) {
  //   if (email && this.validateEmail(email)) {
  //     const avatar = this.getAvatar(email);
  //     this.emails.push({ address: email, avatar });
  //   }
  // }

  // removeEmail(emailToRemove: any) {
  //   this.emails = this.emails.filter(email => email !== emailToRemove);
  // }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  getAvatar(email: string): string {
    return `https://www.gravatar.com/avatar/${btoa(email)}?d=identicon`;
  }

  emailList: string[] = [];

  addEmail(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const email = input.value.trim();

    if ((event.key === 'Enter' || event.key === ',') && email) {
      event.preventDefault(); // Prevent newline or comma input
      if (this.isValidEmail(email)) {
        this.emailList.push(email);
        input.value = ''; // Clear input after adding
      }
    }
  }

  removeEmail(index: number) {
    this.emailList.splice(index, 1);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  formatTime(field: 'startTime' | 'endTime') {
    let val = this.callLogForm.get(field)?.value;

    val = val.replace(/[^0-9:]/g, '');

    if (val.length === 1 && /^[0-9]$/.test(val)) {
      val = '0' + val + ':';
    }

    if (val.length === 2 && /^[0-9]{2}$/.test(val)) {
      val = val + ':';
    }

    if (val.length > 5) {
      val = val.slice(0, 5);
    }

    this.callLogForm.get(field)?.setValue(val, { emitEvent: false });
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const input = event.target as HTMLInputElement;
    
    // Allow backspace, delete, tab, escape, enter
    if (charCode === 8 || charCode === 9 || charCode === 27 || charCode === 13 || charCode === 46) {
      return true;
    }
    
    // Only allow numbers
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    
    // If this is the first character, only allow 6-9
    if (input.value.length === 0) {
      const digit = String.fromCharCode(charCode);
      if (digit < '6' || digit > '9') {
        return false;
      }
    }
    
    return true;
  }

  formatContactNumber(event: any) {
    let value = event.target.value;
    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    value = value.substring(0, 10);
    // Update the form control
    this.callLogForm.get('contactNumber')?.setValue(value, { emitEvent: false });
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const numericOnly = pastedText.replace(/[^0-9]/g, '');
    
    if (numericOnly.length > 0) {
      // Check if first digit is 6-9
      const firstDigit = parseInt(numericOnly.charAt(0));
      if (firstDigit >= 6 && firstDigit <= 9) {
        const input = event.target as HTMLInputElement;
        const currentValue = input.value;
        const newValue = currentValue + numericOnly.substring(0, 10 - currentValue.length);
        this.callLogForm.get('contactNumber')?.setValue(newValue, { emitEvent: false });
      }
    }
  }

  triggerEmailApi(emailData: any) {
    this.kafkaService.sendEmailRequest(emailData).subscribe({
      next: (response: any) => {
        this.showSuccess('Triggered email API successfully.');
      },
      error: (error: any) => {
        this.showError('Failed to trigger email API.');
      }
    });
  }

 

  get to() {
    return this.mailForm.get('to');
  }

  toLowercaseEmail(): void {
    const emailControl = this.mailForm.get('to');
    if (emailControl) {
      const lowercaseValue = emailControl.value?.toLowerCase();
      emailControl.setValue(lowercaseValue, { emitEvent: false });
    }
  }

  getOldNewValue(field: unknown, type: 'old' | 'new'): any {
    if (field && typeof field === 'object' && field !== null && ('old' in field) && ('new' in field)) {
      return (field as any)[type];
    }
    return '';
  }

  normalizeValue(val: any): any {
    if (typeof val === 'string' && val.startsWith('LeadStatusEnum.')) {
      return val.replace('LeadStatusEnum.', '');
    }
    if (typeof val === 'string' && val.startsWith('StatusEnum.')) {
      return val.replace('StatusEnum.', '');
    }
    return val;
  }

  isRealChange(field: unknown): boolean {
    const oldVal = this.normalizeValue(this.getOldNewValue(field, 'old'));
    const newVal = this.normalizeValue(this.getOldNewValue(field, 'new'));
    return oldVal !== newVal && (oldVal || newVal);
  }

  hasAnyRealChange(changedFields: any): boolean {
    if (!changedFields) return false;
    return Object.values(changedFields).some(field => this.isRealChange(field));
  }

  fieldLabelMap: { [key: string]: string } = {
    lead_opportunity: 'Lead Status',
    status: 'Status',
    company_mobile_number: 'Mobile Number',
    company_size: 'Company Size',
    company_info: 'Company Info',
    social_media_url: 'Social Media',
    company_name: 'Company Name',
    industry_type: 'Industry Type',
    address: 'Address',
    company_email: 'Company Email',
    company_website: 'Company Website',
    assigned_to: 'Assigned To',
    service_interest: 'Service Interest'
    // Add more mappings as needed
  };

  enumLabelMap: { [key: string]: string } = {
    'LeadStatusEnum.NEW': 'New',
    'LeadStatusEnum.CONTACTED': 'Contacted',
    'LeadStatusEnum.QUALIFIED': 'Qualified',
    'LeadStatusEnum.LOST': 'Lost',
    'LeadStatusEnum.WON': 'Won',
    'StatusEnum.ACTIVE': 'Active',
    'StatusEnum.INACTIVE': 'Inactive',
    // Add more mappings as needed
  };

  public getFieldLabel(key: unknown): string {
    return this.fieldLabelMap[String(key)] || String(key);
  }

  public getEnumLabel(val: any): string {
    if (typeof val === 'string' && this.enumLabelMap[val]) {
      return this.enumLabelMap[val];
    }
    // Fallback: remove enum prefix and capitalize
    if (typeof val === 'string' && val.includes('.')) {
      const last = val.split('.').pop();
      return last ? last.charAt(0).toUpperCase() + last.slice(1).toLowerCase() : val;
    }
    return val;
  }

  public formatValue(value: any, field: string): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      // Custom handling for specific fields
      if (field === 'notes' && value.title) {
        return value.title;
      }
      if (Array.isArray(value)) {
        return value.length ? value.join(', ') : 'None';
      }
      // Fallback: show JSON for debugging
      return JSON.stringify(value);
    }
    return this.getEnumLabel(value) || value;
  }

  get totalPages(): number {
    return this.statusHistory ? Math.ceil(this.statusHistory.length / this.pageSize) : 0;
  }
  
  get paginatedStatusHistory() {
    if (!this.statusHistory) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.statusHistory.slice(startIndex, startIndex + this.pageSize);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Merged pagination methods for Activity tab
  get mergedTotalPages(): number {
    return this.mergedActivities ? Math.ceil(this.mergedActivities.length / this.mergedPageSize) : 0;
  }
  
  get paginatedMergedActivities() {
    if (!this.mergedActivities) {
      return [];
    }
    const startIndex = (this.mergedPage - 1) * this.mergedPageSize;
    return this.mergedActivities.slice(startIndex, startIndex + this.mergedPageSize);
  }
  
  setMergedPage(page: number) {
    if (page >= 1 && page <= this.mergedTotalPages) {
      this.mergedPage = page;
    }
  }

  // Individual tab pagination methods
  get emailTotalPages(): number {
    return this.activityData?.message ? Math.ceil(this.activityData.message.length / this.emailPageSize) : 0;
  }
  
  get paginatedEmails() {
    if (!this.activityData?.message) {
      return [];
    }
    const startIndex = (this.emailPage - 1) * this.emailPageSize;
    return this.activityData.message.slice(startIndex, startIndex + this.emailPageSize);
  }
  
  setEmailPage(page: number) {
    if (page >= 1 && page <= this.emailTotalPages) {
      this.emailPage = page;
    }
  }

  get callTotalPages(): number {
    return this.activityData?.call ? Math.ceil(this.activityData.call.length / this.callPageSize) : 0;
  }
  
  get paginatedCalls() {
    if (!this.activityData?.call) {
      return [];
    }
    const startIndex = (this.callPage - 1) * this.callPageSize;
    return this.activityData.call.slice(startIndex, startIndex + this.callPageSize);
  }
  
  setCallPage(page: number) {
    if (page >= 1 && page <= this.callTotalPages) {
      this.callPage = page;
    }
  }

  get notesTotalPages(): number {
    return this.activityData?.notes ? Math.ceil(this.activityData.notes.length / this.notesPageSize) : 0;
  }
  
  get paginatedNotes() {
    if (!this.activityData?.notes) {
      return [];
    }
    const startIndex = (this.notesPage - 1) * this.notesPageSize;
    return this.activityData.notes.slice(startIndex, startIndex + this.notesPageSize);
  }
  
  setNotesPage(page: number) {
    if (page >= 1 && page <= this.notesTotalPages) {
      this.notesPage = page;
    }
  }

  canEditNote(note: any): boolean {
    if (!note?.created_at) return false;
    // Ensure UTC: append 'Z' if not present
    const createdAtStr = note.created_at.endsWith('Z') ? note.created_at : note.created_at + 'Z';
    const created = new Date(createdAtStr).getTime();
    const now = Date.now();
    const diff = now - created;
    console.log('canEditNote debug:', { created_at: note.created_at, created, now, diff });
    return diff < 5 * 60 * 1000;
  }

  startEditNote(note: any) {
    this.editingNoteId = note.id;
    this.editNoteContent = note.body;
    this.editNoteTitle = note.title;
    this.editNoteDescription = note.description;
  }

  saveEditNote(note: any) {
    // Replace with your actual service call
    // this.notesService.updateNote(note.id, { body: this.editNoteContent, title: this.editNoteTitle, description: this.editNoteDescription }).subscribe(() => {
    //   note.body = this.editNoteContent;
    //   note.title = this.editNoteTitle;
    //   note.description = this.editNoteDescription;
    //   this.editingNoteId = null;
    // });
    // For now, just update locally:
    note.body = this.editNoteContent;
    note.title = this.editNoteTitle;
    note.description = this.editNoteDescription;
    this.editingNoteId = null;
  }

  cancelEdit() {
    this.editingNoteId = null;
  }

  onScrollMerged(event: any) {
    const element = event.target;
    if (
      !this.loadingMerged &&
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10 &&
      this.visibleMergedCount < this.mergedActivities.length
    ) {
      this.loadingMerged = true;
      setTimeout(() => {
        this.visibleMergedCount += 10;
        this.loadingMerged = false;
      }, 3000);
    }
  }

  onScrollNotes(event: any) {
    const element = event.target;
    if (
      !this.loadingNotes &&
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10 &&
      this.visibleNotesCount < (this.activityData?.notes?.length || 0)
    ) {
      this.loadingNotes = true;
      setTimeout(() => {
        this.visibleNotesCount += 10;
        this.loadingNotes = false;
      }, 3000);
    }
  }

  onScrollCalls(event: any) {
    const element = event.target;
    if (
      !this.loadingCalls &&
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10 &&
      this.visibleCallsCount < (this.activityData?.call?.length || 0)
    ) {
      this.loadingCalls = true;
      setTimeout(() => {
        this.visibleCallsCount += 10;
        this.loadingCalls = false;
      }, 3000);
    }
  }

  getUserNameById(userId: string): string {
    const user = this.users.find(u => u.staff_id === userId || u.id === userId);
    return user ? user.name : userId;
  }

  getProfileImage(user: any): string {
    if (!user?.profileImage || user.profileImage === 'string') {
      return 'assets/lead/Avatar.png';
    }
    // Use environment.galleryUrl if available
    if (typeof this.imageUrl !== 'undefined') {
      return this.imageUrl + user.profileImage;
    }
    return user.profileImage;
  }

  getChangedByUser(item: any): any {
    if (!this.users) return null;
    return this.users.find(u => u.staff_id === item.changed_by || u.id === item.changed_by);
  }
}