import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-loading-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-loading-bar.component.html',
  styleUrl: './data-loading-bar.component.scss'
})
export class DataLoadingBarComponent  implements OnInit{
  @Input() columns: string[] = [];


  ngOnInit(): void {
 
  }
}
