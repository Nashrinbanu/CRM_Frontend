import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../modules/auth/auth.routes').then((m) => m.AUTH_ROUTE)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../modules/main/main-routing.routes').then((m) => m.MAIN_ROUTING)
  },
];
