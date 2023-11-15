/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-09-15
 * 작성자: 임호균
 * 설명: contract 라우팅 경로
 */

import { Route } from "@angular/router";
import { PayStubsListComponent } from "./employee/pay-stubs/pay-stubs-list/pay-stubs-list.component";
import { ManagerPayStubsListComponent } from "./manager/pay-stubs/manager-pay-stubs-list/manager-pay-stubs-list.component";
import { ContractListComponent } from "./employee/contract/contract-list/contract-list.component";
import { ManagerContractListComponent } from "./manager/contract/manager-contract-list/manager-contract-list.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";



// export const CONTRACT_MANAGEMENT_ROUTES: Route[] = [
//   { path: 'pay-stubs-list', component: PayStubsListComponent },
//   { path: 'manager-pay-stubs-list', component: ManagerPayStubsListComponent },
//   { path: 'contract-list', component: ContractListComponent },
//   { path: 'manager-contract-list', component: ManagerContractListComponent },
//   { path: '**', component: PageNotFoundComponent }
// ]

export const CONTRACT_MANAGEMENT_ROUTES: Route[] = [
  { path: 'pay-stubs', loadChildren: () => import('./employee/pay-stubs/routes').then((m) => m.PAY_STUBS_MANAGEMENT_ROUTES) },
  { path: 'manager-pay-stubs', loadChildren: () => import('./manager/pay-stubs/routes').then((m) => m.PAY_STUBS_MANAGER_MANAGEMENT_ROUTES) },
  { path: 'contract', loadChildren: () => import('./employee/contract/routes').then((m) => m.CONTRACT_MANAGEMENT_ROUTES) },
  { path: 'manager-contract', loadChildren: () => import('./manager/contract/routes').then((m) => m.CONTRACT_MANAGER_MANAGEMENT_ROUTES) },
  { path: '**', component: PageNotFoundComponent }
]