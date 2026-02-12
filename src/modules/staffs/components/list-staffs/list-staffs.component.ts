import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StaffsService } from '../../services/staffs.service';
import { environment } from '../../../../environments/environment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { DataMessageComponent } from '../../../shared/data-message/data-message.component';
import { DataLoadingBarComponent } from '../../../shared/data-loading-bar/data-loading-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStaffComponent } from '../update-staff/update-staff.component';
@Component({
  selector: 'app-list-staffs',
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
  ],
  templateUrl: './list-staffs.component.html',
  styleUrl: './list-staffs.component.scss',
})
export class ListStaffsComponent implements OnInit {
  displayedColumns: string[] = [
    'staffId',
    'staffName',
    'mobileNumber',
    'emailId',
    'designation',
    'department',
    'date_of_joining',
    'status',
  ];
  dataSource = new MatTableDataSource<any>();
  public isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public pageIndex = 0;
  public pageSize: number = 10;
  public totalCount!: number;
  public totalPages!: number;
  public event!: PageEvent;
  public pageSizeOptions!: Array<any>;

  constructor(
    public router: Router,
    private staffService: StaffsService,
    private dialog: MatDialog
  ) {
    this.pageSizeOptions = environment.pageSizeOptions;
    this.pageSize = environment.pageSizeOptions[0];
  }
  ngOnInit(): void {
    this.getStaff(this.event);
  }
  getStaff(event: PageEvent) {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    const params: any = {
      limit: this.pageSize.toString(),
      page: (this.pageIndex + 1).toString(),
    };
    this.isLoading = true;
    this.staffService.getstaff(params).subscribe(
      (data) => {
        this.dataSource.data = data.data;
        this.isLoading = false;
        this.totalCount = data?.total_records ?? 0;
        this.totalPages = data?.total_pages ?? 1;
        this.pageIndex = (data?.current_page ?? 1) - 1;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#00A899] text-white';
      case 'inactive':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  }
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ') //
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getStaff(event);
  }
  toggleDetails(staff: any) {
    staff.showDetails = !staff.showDetails;
  }
  addStaff() {
    this.router.navigate(['/staffs/creatStaff']);
  }


 viewStaff(staffId: any) {
  console.log(staffId);
  const getDialogWidth = () => {
    const width = window.innerWidth;
    return width <= 1024 ? '100vw' : '70%';
  };

  const dialogRef = this.dialog.open(UpdateStaffComponent, {
    width: getDialogWidth(),
    height: 'auto',
    data: { id: staffId },  // Make sure to use 'id' as the property name
    disableClose: false,
    position: window.innerWidth <= 1024 
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
}
