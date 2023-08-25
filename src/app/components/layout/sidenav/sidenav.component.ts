/**
 * Version 1.0
 * 파일명: sidenav.component.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 사이드 내비게이션 컴포넌트
 * 
 * 수정자: 임호균
 * 수정일시: 2023-08-25
 * 수정내용: 매니저 처리
 */


import { Component, inject } from '@angular/core';
import { SidenavItemComponent } from '../sidenav-item/sidenav-item.component';
import { RouterModule } from '@angular/router';
import { NavigationService } from 'src/app/stores/layout/navigation.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';

@Component({
  selector: 'sidenav',
  standalone: true,
  imports: [
    CommonModule,
    SidenavItemComponent,
    RouterModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss','../../../../styles.scss']
})
export class SidenavComponent {
  // navigationService 주입
  private navigationService = inject(NavigationService);
  // 사이드 내비 구성 데이터
  navItems = this.navigationService.navItems;
}
