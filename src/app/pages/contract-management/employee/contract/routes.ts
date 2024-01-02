/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-09-15
 * 작성자: 임호균
 * 설명: contract 라우팅 경로
 */

import { Route } from "@angular/router";
import { ContractListComponent } from "./contract-list/contract-list.component";
import { PageNotFoundComponent } from "src/app/pages/page-not-found/page-not-found.component";
import { ContractDetailComponent } from "./contract-detail/contract-detail.component";




export const CONTRACT_MANAGEMENT_ROUTES: Route[] = [
  { path: '', component: ContractListComponent },
  { path: 'detail/:id', component: ContractDetailComponent },
  { path: 'sign/:id', component: ContractDetailComponent },
  { path: '**', component: PageNotFoundComponent }
]