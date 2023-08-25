/**
 * Version 1.0
 * 파일명: toolbar.components.ts
 * 작성일시: 2023-08-22
 * 작성자: 임호균
 * 설명: 툴바, 햄버거 버튼, 프로필 이미지, 로그인한 사용자 이름, 알림 처리
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router, RouterModule } from '@angular/router';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SidenavService } from 'src/app/stores/layout/sidenav.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    FlexLayoutModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss', '../../../../styles.scss']
})
export class ToolbarComponent implements OnInit{
  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);

  constructor(
    private sidenavService: SidenavService, 
    private authService: AuthService, 
    private profileService: ProfileService, 
    private router: Router) {
      this.userProfile$.subscribe(() => {
        this.userProfileData = this.profileService.userProfile().user;
      })
  }

  /**
   * @작성자 임호균
   * @작성일 2023-08-25
   * @description 툴팁이 생성될 때 유저 데이터를 가져온다 
   */
  ngOnInit(): void {
    this.getUserProfileData()
  }

  /**
   * @작성자 임호균
   * @작성일 2023-08-25
   * @description 사이드 네비게이션 컨트롤 함수 (햄버거 버튼을 눌렀을 경우 사이드 네비게이션이 오픈되어야 한다)
   */
  openSidenav(): void {
    this.sidenavService.openSidenav()
  }


  /**
   * @작성자 임호균
   * @작성일 2023-08-25
   * @description 유저 데이터를 가저오는 함수
   * @reference profile.service.ts
   */
  getUserProfileData() {
    this.profileService.getUserProfile().subscribe()
  }

  /**
   * @작성자 임호균
   * @작성일 2023-08-25
   * @description 로그아웃 함수
   * @reference auth.service.ts
   */
  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['welcome'])
  }
}

