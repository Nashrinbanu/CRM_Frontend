import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-data-message',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './data-message.component.html',
  styleUrl: './data-message.component.scss'
})
export class DataMessageComponent {
  @Input() dataMsg:String="No data available to display.";
}
