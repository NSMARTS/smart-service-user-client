import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { LeaveManagementComponent } from './pages/leave-management/leave-management.component';
import { SpaceComponent } from './pages/space/space.component';

const routes: Routes = [
  {
    path: 'welcome',
    component: 
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
        component: LeaveManagementComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
