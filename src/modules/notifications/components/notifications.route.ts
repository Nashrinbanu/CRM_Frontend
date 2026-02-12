import { Routes } from "@angular/router";
import { NotificationComponent } from "./notification/notification.component";
import { NotificationDetailsComponent } from "./notification-details/notification-details.component";



export const notification_Routes: Routes = [
  { path: '', component: NotificationComponent },
  { path: 'details', component: NotificationDetailsComponent },

];