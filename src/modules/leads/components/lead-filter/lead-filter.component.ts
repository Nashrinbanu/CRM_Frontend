import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '../../services/leads.service';

@Component({
  selector: 'app-lead-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lead-filter.component.html',
  styleUrls: ['./lead-filter.component.scss']
})
export class LeadFilterComponent implements OnInit {
  public filterData: any = {
    leadId: '',
    leadName: '',
    assignedTo: '',
    fromDate: '',
    toDate: '',
    industryType: '',
    status: ''
  };
  public showIndustryDropdown = false;
  public showStatusDropdown = false;
  public leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST'];
  public showAssignedToDropdown = false;
  public selectedAssignee: string | null = null;

  public assigneeList: any[] = [];

  public selectedIndustry: string | null = null;
  public selectedStatus: string | null = null;
  public submitted = false;
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
  constructor(
    public dialogRef: MatDialogRef<LeadFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadsService: LeadsService
  ) { }

  ngOnInit() {
    this.leadsService.getAssignableStaff().subscribe((res) => {
      // Only include staff with status ACTIVE
      if (res?.data && Array.isArray(res.data)) {
        this.assigneeList = res.data.filter((staff: any) => staff.status === 'ACTIVE');
      }
    });
  }

  applyFilters(): void {
    this.dialogRef.close(this.filterData);
  }

  close(): void {
    this.dialogRef.close();
  }

  resetFilters() {
    this.filterData = {
      leadId: '',
      leadName: '',
      assignedTo: '',
      fromDate: '',
      toDate: '',
      industryType: '',
      status: ''
    };
  }

  selectIndustry(type: string) {
    this.filterData.industryType = type;
    this.showIndustryDropdown = false;
  }

  selectStatus(status: string) {
    this.filterData.status = status;
    this.showStatusDropdown = false;
  }

  toggleIndustryDropdown() {
    this.showIndustryDropdown = !this.showIndustryDropdown;
  }

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  toggleAssignedToDropdown() {
    this.showAssignedToDropdown = !this.showAssignedToDropdown;
  }

  selectAssignee(assignee: any) {
    this.filterData.assignedTo = assignee.staff_id;
    this.showAssignedToDropdown = false;
  }

  getSelectedAssigneeName(): string {
    const selected = this.assigneeList.find(a => a.staff_id === this.filterData.assignedTo);
    return selected ? selected.name : 'Select Assignee';
  }
}