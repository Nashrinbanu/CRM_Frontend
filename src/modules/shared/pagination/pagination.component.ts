import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatTableModule,
    RouterLink,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    CommonModule,
    RouterLinkActive, MatIconModule
       
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 1;
  @Input() totalPages: number = 1;
  public pageSizeOptions: number[] = [10, 15, 20, 50, 100];

  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  constructor() { }

  ngOnInit(): void {
    this.pageSizeOptions = environment.pageSizeOptions;
  }

  createPageEvent(): PageEvent {
    return {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.totalCount,
    };
  }

  setPage(page: number): void {
    this.pageIndex = page - 1;
    this.pageChange.emit(this.createPageEvent());
  }

  getPages(): number[] {
    const pages = [];
    const maxPages = 1;
    let startPage = Math.max(2, this.pageIndex + 1 - maxPages);
    let endPage = Math.min(this.totalPages - 1, this.pageIndex + 1 + maxPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      console.log('Next page index:', this.pageIndex);
      this.pageChange.emit(this.createPageEvent());
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      console.log('Previous page index:', this.pageIndex);
      this.pageIndex--;
      this.pageChange.emit(this.createPageEvent());
    }
  }

  onPageSizeChange(event: number): void {
    this.pageSize = event;
    this.pageIndex = 0;
    this.pageChange.emit(this.createPageEvent());
  }

  onPageSizeChange1(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.pageIndex = 0;
    this.pageChange.emit(this.createPageEvent());
  }

}
