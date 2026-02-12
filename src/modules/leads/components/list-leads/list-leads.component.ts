import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { LeadsService } from '../../services/leads.service';
import { MatSort } from '@angular/material/sort';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { environment } from '../../../../environments/environment';
import { DataMessageComponent } from '../../../shared/data-message/data-message.component';
import { DataLoadingBarComponent } from '../../../shared/data-loading-bar/data-loading-bar.component';
import { UpdateLeadsComponent } from '../update-leads/update-leads.component';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LeadFilterComponent } from '../lead-filter/lead-filter.component';
import { ElementRef } from '@angular/core';
import { ImportLeadsModalsComponent } from '../import-leads-modals/import-leads-modals.component';
@Component({
  selector: 'app-list-leads',
  standalone: true,
  imports: [
    MatTableModule,
    RouterLink,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    CommonModule,
    RouterLinkActive,
    PaginationComponent,
    DataMessageComponent,
    DataLoadingBarComponent,
    MatExpansionModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ImportLeadsModalsComponent
  ],
  templateUrl: './list-leads.component.html',
  styleUrl: './list-leads.component.scss',
})
export class ListLeadsComponent implements OnInit {
  public isDropdownOpen = false;
  public selectedStatus = '';
  public statuses = [
    { value: '', label: 'All Status' },
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'NEGOTIATION', label: 'Negotiation' },
    { value: 'WON', label: 'Won' },
    { value: 'LOST', label: 'Lost' },
  ];
  public selectedOption = 'Technology';
  public options = [
    'Technology',
    'Finance',
    'Healthcare & Pharmaceuticals',
    'Finance & Banking',
  ];
  public displayedColumns: string[] = [
    'sno',
    'leadId',
    'leadName',
    'accountName',
    'mobileNumber',
    'email',
    'score',
    'createdDate',
    'status',
  ];
  public dataSource = new MatTableDataSource<any>();
  public isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public pageIndex = 0;
  public pageSize: number = 10;
  public totalCount!: number;
  public totalPages!: number;
  public event!: PageEvent;
  public pageSizeOptions!: Array<any>;
  public statusColorMap: { [key: string]: string } = {
    'In Progress': '#C8E3B9',
    Completed: '#BBD3F3',
    Converted: '#ACB9F3',
    Recycled: '#F1DD8A',
  };
  public filterStatus: string = '';
  public filterCompanyName: string = '';
  public filterAssignedTo: string = '';
  public isMobileView: boolean = false;
  public isFilterOpen: boolean = false;
  public filterIndustryType: any;
  public filterId: any;
  public filterFromDate: any;
  public filterToDate: any;
  public showImportModals = false;
  constructor(
    public router: Router,
    private leadService: LeadsService,
    private dialog: MatDialog
  ) {
    this.pageSizeOptions = environment.pageSizeOptions;
    this.pageSize = environment.pageSizeOptions[0];
  }
  isSearchOpen = window.innerWidth < 768;
  previousFilterValue = '';
  isFilterVisible = false;

  ngOnInit(): void {
    this.checkScreenSize();
    this.getLeads(this.event);
    window.addEventListener('resize', this.checkScreenSize1);
    this.checkScreenSize1();
  }

  openFilter() {
    this.isFilterOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFilter() {
    this.isFilterOpen = false;
    document.body.style.overflow = ''; 
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  resetFilters() {
    this.isFilterOpen = false;
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.getLeads(this.event);
  }

  checkScreenSize1 = () => {
    if (window.innerWidth < 768) {
      this.isSearchOpen = true;
    } else {
      this.isSearchOpen = false;
    }
  };

  expandSearch() {
    if (window.innerWidth >= 768) {
      this.isSearchOpen = true;
      setTimeout(() => {
        const inputElement = document.getElementById(
          'companyName'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 10);
    }
  }

  collapseSearch() {
    if (window.innerWidth >= 768) {
      if (this.filterCompanyName !== this.previousFilterValue) {
        this.previousFilterValue = this.filterCompanyName;
        this.onFilterChange();
      }
      setTimeout(() => {
        if (!this.filterCompanyName) {
          this.isSearchOpen = false;
        }
      }, 200);
    }
  }

  getLeads(event?: PageEvent) {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    const params: any = {
      limit: this.pageSize.toString(),
      page: (this.pageIndex + 1).toString(),
      status: this.filterStatus || '',
      company_name: this.filterCompanyName || '',
      assigned_to: this.filterAssignedTo || '',
      industry_type: this.filterIndustryType || '',
    };
    if (this.filterId) {
      params.id = this.filterId;
    }
    this.isLoading = true;
    this.leadService.getLead(params).subscribe(
      (data) => {
        this.dataSource.data = this.filterByDate(data.leads).map(lead => {
          if (Array.isArray(lead.contacts)) {
            lead.contacts = [...lead.contacts].sort((a, b) => {
              if (a.active_contact && !b.active_contact) return -1;
              if (!a.active_contact && b.active_contact) return 1;
              return 0;
            });
          }
          return lead;
        });
        this.isLoading = false;
        this.totalCount = data.pagination?.total_records ?? 0;
        this.totalPages = data.pagination?.total_pages ?? 1;
        this.pageIndex = (data.pagination?.current_page ?? 1) - 1;
      },
      (error) => {
        console.error('Error fetching leads:', error);
        this.isLoading = false;
      }
    );
  }

  filterByDate(leads: any[]): any[] {
    if (!this.filterFromDate && !this.filterToDate) return leads;
    const from = this.filterFromDate ? new Date(this.filterFromDate) : null;
    const to = this.filterToDate ? new Date(this.filterToDate) : null;
    return leads.filter(lead => {
      const created = new Date(lead.created_at);
      if (from && to) {
        return created >= from && created <= to;
      } else if (from) {
        return created >= from;
      } else if (to) {
        return created <= to;
      }
      return true;
    });
  }

  getStatusColor(status: string): string {
    return this.statusColorMap[status] || '#9e9e9e';
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'bg-[#00A899] text-white';
      case 'CONTACTED':
        return 'bg-[#0091DA] text-white';
      case 'QUALIFIED':
        return 'bg-[#376195] text-white';
      case 'NEGOTIATION':
        return 'bg-[#6D50C7] text-white';
      case 'WON':
        return 'bg-[#E31D93] text-white';
      case 'LOST':
        return 'bg-[#E53030] text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  }

  viewLead(id: any) {
    console.log(id)
    const getDialogWidth = () => {
      const width = window.innerWidth;
      if (width <= 1024) {
        return '100vw';
      } else {
        return '70%';
      }
    };

    const dialogWidth = getDialogWidth();
    const dialogRef = this.dialog.open(UpdateLeadsComponent, {
      width: dialogWidth,
      height: 'auto',
      data: { id },
      disableClose: false,
      position:
        window.innerWidth <= 1024
          ? { top: '0', left: '0' }
          : { bottom: '0', right: '0' },
      panelClass: 'custom-dialog-class',
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
    window.addEventListener('resize', () => {
      dialogRef.updateSize(getDialogWidth(), 'auto');
    });
  }

  openLeadFilter(filterBtn: any): void {
    if (!filterBtn) {
      console.error('Filter button reference is undefined.');
      return;
    }
    const buttonRect = filterBtn.getBoundingClientRect();
    const dialogWidth = 400;
    const spacing = 20;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let leftPosition = viewportWidth - dialogWidth - 20;
    let topPosition = buttonRect.bottom + spacing;
    let maxDialogHeight = viewportHeight - topPosition - 20;
    if (maxDialogHeight < 200) {
      topPosition = buttonRect.top - dialogWidth - spacing;
      maxDialogHeight = buttonRect.top - spacing;
    }
    console.log(leftPosition, 'left position (5px from right)');
    console.log(maxDialogHeight, 'max dialog height');
    const dialogRef = this.dialog.open(LeadFilterComponent, {
      width: `${dialogWidth}px`,
      maxHeight: `${maxDialogHeight}px`,
      disableClose: false,
      position: {
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
      },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.afterClosed().subscribe((filterData) => {
      if (filterData) {
        console.log(filterData, 'filterData');
        this.filterId = filterData.leadId || '';
        this.filterIndustryType = filterData.industryType || '';
        this.filterStatus = filterData.status || '';
        this.filterCompanyName = filterData.leadName || '';
        this.filterAssignedTo = filterData.assignedTo || '';
        this.filterFromDate = filterData.fromDate || '';
        this.filterToDate = filterData.toDate || '';
        this.getLeads();
      }
    });
  }
  
  addLead() {
    this.router.navigate(['/leads/creatLead']);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getLeads(event);
  }

  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ') //
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleDetails(leads: any) {
    leads.showDetails = !leads.showDetails;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  selectStatus(status: any) {
    this.selectedStatus = status.label;
    this.filterStatus = status.value;
    this.isDropdownOpen = false;
    this.onFilterChange();
  }

  importLead() {
    this.showImportModals = true;
  }

  closeImportModals() {
    this.showImportModals = false;
  }

  onImportSuccess(response: any) {
    console.log('Import successful:', response);
    // Refresh the leads list after successful import
    this.getLeads();
  }

}