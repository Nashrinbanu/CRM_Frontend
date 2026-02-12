import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout.component";
import { AuthGuard } from "../auth/guard/auth.guard";

export const MAIN_ROUTING: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/components/dashboard.route').then((m) => m.dashboard_Routes)
    },
    {
      path: 'leads',
      loadChildren: () => import('../leads/components/lead.route').then((m) => m.lead_Routes)
    },
    {
      path: 'staffs',
      loadChildren: () => import('../staffs/components/staff.route').then((m) => m.staff_Routes)
    },
    {
      path: 'calendar',
      loadChildren: () => import('../calendar/components/calendar.route').then((m) => m.calendar_Routes)
    },
    {
      path: 'notifications',
      loadChildren: () => import('../notifications/components/notifications.route').then((m) => m.notification_Routes)
    },
    {
      path: 'notificationsDetails',
      loadChildren: () => import('../notifications/components/notifications.route').then((m) => m.notification_Routes)
    },
    {
      path: 'mail',
      loadChildren: () => import('../mail/mail.route').then((m) => m.mail_Routes)
    },
    {
      path: 'messages',
      loadChildren: () => import('../messages/components/message.route').then((m) => m.message_Routes)
    },
    {
      path: 'settings',
      loadChildren: () => import('../settings/components/settings.route').then((m) => m.settings_Routes)
    },
  ],
  canActivate: [AuthGuard]
    
}];