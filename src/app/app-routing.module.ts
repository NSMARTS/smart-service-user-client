/**
 * Version 1.0
 * 파일명: sidenav-route-info.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 사이드 네비게이션 목록 초기 설정
 * 
 * 수정일시: 2023-08-21
 * 수정자: 임호균
 * 설명: standalone 특성에 맞게 라우팅 수정
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { SpaceComponent } from './pages/space/space.component';
import { IndexComponent } from './pages/index/index.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'welcome',
    component: IndexComponent
  },

  {
    path: '',
    component: LayoutComponent,
    // canActivate: [isLoggedInGuard],
    children: [
      {
        path: 'main',
        component: MainComponent
      },
      {
        path: 'profile',
        component: ProfileEditComponent
      },
      {
        path: 'leave',
        loadChildren: () => import('./pages/leave/routes').then(mod => mod.LEAVE_ROUTES)
      },
      {
        path: 'employee-management',
        loadChildren: () => import('./pages/employee-management/routes').then(mod => mod.EMPLOYEE_MANAGEMENT_ROUTES)
      },
      {
        path: 'collab',
        component: SpaceComponent
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
