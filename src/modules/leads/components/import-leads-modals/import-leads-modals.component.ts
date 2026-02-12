import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsService } from '../../services/leads.service';
import { HttpClient, HttpHeaders, HttpEventType, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-leads-modals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-leads-modals.component.html',
  styleUrl: './import-leads-modals.component.scss'
})
export class ImportLeadsModalsComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() importSuccess = new EventEmitter<any>();

  isDragging = false;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadTimeLeft = 0;
  uploadInterval: any;
  isPaused = false;
  uploadError: string | null = null;
  uploadSuccess = false;
  rejectedDatas: any[] = [];

  constructor(private leadsService: LeadsService) {}

  close() {
    this.closed.emit();
  }

  save() {
    if (this.selectedFile && !this.isUploading) {
      this.uploadFile();
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;
    this.uploadProgress = 0;

    this.leadsService.bulkImportLeads(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 100;
          this.isUploading = false;
          this.uploadSuccess = true;
          this.rejectedDatas = event.body?.rejectedDatas || [];
          this.importSuccess.emit(event.body);
          setTimeout(() => {
            this.close();
          }, 2000);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isUploading = false;
        this.uploadError = error.error?.message || 'Upload failed. Please try again.';
        console.error('Upload error:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Please select a valid CSV or Excel file.';
        return;
      }
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.uploadError = 'File size must be less than 10MB.';
        return;
      }
      this.uploadError = null;
      this.selectedFile = file;
      this.uploadFile(); // Start upload automatically
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      // Validate file type
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Please select a valid CSV or Excel file.';
        return;
      }
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.uploadError = 'File size must be less than 10MB.';
        return;
      }
      this.uploadError = null;
      this.selectedFile = file;
      this.uploadFile(); // Start upload automatically
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  removeFile() {
    this.selectedFile = null;
    this.isUploading = false;
    this.uploadProgress = 0;
    this.uploadTimeLeft = 0;
    this.uploadError = null;
    this.uploadSuccess = false;
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
    }
  }

  pauseUpload() {
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
    }
    this.isPaused = true;
  }

  resumeUpload() {
    this.isPaused = false;
    this.startUpload();
  }

  startUpload() {
    this.isUploading = true;
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
    }
    this.uploadInterval = setInterval(() => {
      if (!this.isPaused && this.uploadProgress < 100) {
        this.uploadProgress += 2;
        this.uploadTimeLeft = Math.max(0, 30 - Math.floor(this.uploadProgress / 100 * 30));
      }
      if (this.uploadProgress >= 100) {
        this.isUploading = false;
        clearInterval(this.uploadInterval);
      }
    }, 600);
  }
} 
