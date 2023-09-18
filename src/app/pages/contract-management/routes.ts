/**
 * Version 1.0
 * 파일명: routes.ts
 * 작성일시: 2023-09-15
 * 작성자: 임호균
 * 설명: contract 라우팅 경로
 */

import { Route } from "@angular/router";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { ContractListComponent } from "./contract-list/contract-list.component";
import { ManagerContractListComponent } from "./manager-contract-list/manager-contract-list.component";

export const CONTRACT_MANAGEMENT_ROUTES: Route[] = [
    { path: 'contract-list', component: ContractListComponent },
    { path: 'manager-contract-list', component: ManagerContractListComponent },

    { path: '**', component: PageNotFoundComponent }
]