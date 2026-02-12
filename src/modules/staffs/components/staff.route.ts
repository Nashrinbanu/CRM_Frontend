import { Routes } from "@angular/router";
import { ListStaffsComponent } from "./list-staffs/list-staffs.component";
import { AddStaffsComponent } from "./add-staffs/add-staffs.component";
import { UpdateStaffComponent } from "./update-staff/update-staff.component";

export const staff_Routes: Routes = [
  { path: '', component: ListStaffsComponent },
 { path: 'creatStaff', component: AddStaffsComponent },
  { path: 'viewStaff/:staff_id', component: UpdateStaffComponent },
];