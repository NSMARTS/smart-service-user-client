/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-08-21
 * 작성자: 임호균
 * 설명: leave 라우팅 경로
 */

import { Route } from "@angular/router";
import { MyStatusComponent } from "./my-status/my-status.component";
import { LeaveRequestListComponent } from "./leave-request-list/leave-request-list.component";
import { RdRequestListComponent } from "./rd-request-list/rd-request-list.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { RequestLeaveComponent } from "./request-leave/request-leave.component";

export const LEAVE_ROUTES: Route[] = [
    {path: 'my-status', component: MyStatusComponent},
    {path: 'leave-request-list', component: LeaveRequestListComponent},
    {path: 'rd-request-list', component: RdRequestListComponent},

    {path: 'request-leave', component: RequestLeaveComponent},

    {path: '**', component: PageNotFoundComponent}
]