/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-09-15
 * 작성자: 임호균
 * 설명: contract 라우팅 경로
 */

import { Route } from "@angular/router";
import { PageNotFoundComponent } from "src/app/pages/page-not-found/page-not-found.component";
import { ManagerContractListComponent } from "./manager-contract-list/manager-contract-list.component";
import { ManagerContractDetailComponent } from "./manager-contract-detail/manager-contract-detail.component";




export const CONTRACT_MANAGER_MANAGEMENT_ROUTES: Route[] = [
  { path: '', component: ManagerContractListComponent },
  { path: 'detail/:id', component: ManagerContractDetailComponent },
  { path: 'sign/:id', component: ManagerContractDetailComponent },
  { path: '**', component: PageNotFoundComponent }
]