import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements AfterViewInit {
  // @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  // @Input() columns: Array<{ columnDef: string; header: string; cellTemplate?: any }> = [];
  // @Input() displayedColumns: string[] = [];
  // @Input() pageSize: number = 10;
  // @Input() pageSizeOptions: number[] = [5, 10, 25];
  // @Input() totalCount: number = 0;
  // @Input() isLoading: boolean = false;

  // @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
  //   console.log(this.columns,'columns')
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  }

  // onPageChange(event: PageEvent) {
  //   this.pageChange.emit(event);
  // }
}