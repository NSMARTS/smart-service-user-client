/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-09-15
 * 작성자: 임호균
 * 설명: contract 라우팅 경로
 */

import { Route } from "@angular/router";
import { PayStubsListComponent } from "./pay-stubs-list/pay-stubs-list.component";
import { PageNotFoundComponent } from "src/app/pages/page-not-found/page-not-found.component";




export const PAY_STUBS_MANAGEMENT_ROUTES: Route[] = [
  { path: '', component: PayStubsListComponent },
  { path: '**', component: PageNotFoundComponent }
]