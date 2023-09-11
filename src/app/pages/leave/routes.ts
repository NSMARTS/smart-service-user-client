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
import { ReplacementDayConfirmingRequestComponent } from "./replacement-day-confirming-request/replacement-day-confirming-request.component";
import { ReplacementDayRequestComponent } from "./replacement-day-request/replacement-day-request.component";

export const LEAVE_ROUTES: Route[] = [
    {path: 'my-status', component: MyStatusComponent},
    {path: 'leave-request-list', component: LeaveRequestListComponent},
    {path: 'rd-request-list', component: RdRequestListComponent},

    {path: 'request-leave', component: RequestLeaveComponent},

    {path: 'replacement-day-confirming-request', component: ReplacementDayConfirmingRequestComponent},
    {path: 'replacement-day-request/:_id', component: ReplacementDayRequestComponent},

    {path: '**', component: PageNotFoundComponent}
]