import { Routes } from "@angular/router";
import { ListLeadsComponent } from "./list-leads/list-leads.component";
import { AddLeadsComponent } from "./add-leads/add-leads.component";
import { UpdateLeadsComponent } from "./update-leads/update-leads.component";

export const lead_Routes: Routes = [
  { path: '', component: ListLeadsComponent },
  { path: 'creatLead', component: AddLeadsComponent },
  { path: 'viewLead/:id', component: UpdateLeadsComponent },
];