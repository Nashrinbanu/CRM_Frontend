import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [],
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NotificationDetailsComponent {

  removeNotification(data?:any){

  }
}
