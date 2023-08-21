import { Route } from "@angular/router";
import { EmployeeLeaveStatusComponent } from "./employee-leave-status/employee-leave-status.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { LeaveRequestComponent } from "./leave-request/leave-request.component";
import { EmployeeRdRequestComponent } from "./employee-rd-request/employee-rd-request.component";
import { RegisterRequestComponent } from "./register-request/register-request.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";

export const EMPLOYEE_MANAGEMENT_ROUTES: Route[] = [
    {path: 'employee-leave-status', component: EmployeeLeaveStatusComponent},
    {path: 'employee-list', component: EmployeeListComponent},
    {path: 'leave-request', component: LeaveRequestComponent},
    {path: 'employee-rd-request', component: EmployeeRdRequestComponent},
    {path: 'register-request', component: RegisterRequestComponent},
    {path: '**', component: PageNotFoundComponent}
]