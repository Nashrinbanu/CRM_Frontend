import { Routes } from "@angular/router";
import { BackDropComponent } from "./components/back-drop/back-drop.component";

export const AUTH_ROUTE: Routes = [
  {
    path: '',
    component: BackDropComponent,
  },
  {
    path: 'login',
    component: BackDropComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];