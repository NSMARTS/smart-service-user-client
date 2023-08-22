/**
 * Version 1.0
 * 파일명: toolbar.components.ts
 * 작성일시: 2023-08-22
 * 작성자: 임호균
 * 설명: 툴바, 햄버거 버튼, 프로필 이미지, 로그인한 사용자 이름, 알림 처리
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SidenavService } from 'src/app/stores/layout/sidenav.service';

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

  constructor(private sidenavService: SidenavService, private authService: AuthService) {}

  ngOnInit(): void {
    
  }

  openSidenav(): void {
    this.sidenavService.openSidenav()
  }

  getUserProfileData() {
    
  }

  /**
   * @description 로그아웃 함수
   */
  signOut(): void {
    this.authService.signOut();
  }
}
