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
 * 
 * 수정일시: 2023-08-28
 * 수정자: 임호균
 * 설명: notification, meeting 추가
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { SpaceComponent } from './pages/space/space.component';
import { IndexComponent } from './pages/index/index.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { FindPasswordComponent } from './pages/auth/find-password/find-password.component';
import { signInGuard } from './guards/sign-in.guard';
import { myManagerGuard } from './guards/my-manager.guard';
import { NotificationComponent } from './pages/space/notification/notification.component';
import { MeetingComponent } from './pages/space/meeting/meeting.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  // 웰컴 페이지 입니다.
  {
    path: 'welcome',
    component: IndexComponent,
    canActivate: [signInGuard]
  },
  // 로그인 페이지 입니다.
  { 
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard]
  },  
  // 비밀번호 찾기 페이지 입니다.
  {
    path: 'find-password',
    component: FindPasswordComponent,
    canActivate: [signInGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [signInGuard],
    children: [
      {
        path: 'main',
        component: MainComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'profile-edit',
        component: ProfileEditComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'meeting',
        component: MeetingComponent
      },
      // 직원들이 자기 휴가를 관리할 수 있는 컴포넌트를 모아놓은 것입니다.
      // 타고 들어가면 /leave/... 라우터 경로에 대한 처리를 확인할 수 있습니다.
      {
        path: 'leave',
        loadChildren: () => import('./pages/leave/routes').then(mod => mod.LEAVE_ROUTES)
      },
      // 매니저가 직원들의 휴가를 관리할 수 있는 컴포넌틀르 모아놓은 것입니다.
      // 타고 들어가면 /employee-management/... 라우터 경로에 대한 처리를 확인할 수 있습니다.
      {
        path: 'employee-management', canActivate: [myManagerGuard],
        loadChildren: () => import('./pages/employee-management/routes').then(mod => mod.EMPLOYEE_MANAGEMENT_ROUTES)
      },
      // space에 대한 컴포넌트를 모아놓은 것입니다.
      {
        path: 'collab',
        component: SpaceComponent
      },
      // 잘못된 경로로 접근했을 경우 처리하는 로직입니다.
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      }
    ]
  },
  // 잘못된 경로로 접근했을 경우 처리하는 로직입니다.
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
