/**
 * Version 1.0
 * 파일명: profile.service.ts
 * 작성일시: 2023-08-23
 * 작성자: 임호균
 * 설명: 유저 프로필 정보 저장 서비스
 *
 * 수정자: 임호균
 * 수정 일시: 2023-08-25
 * 수정 내용: checkRole 추가
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.apiUrl;
  userProfile = signal<any>({});

  constructor(public http: HttpClient) {}

  getUserProfile() {
    return this.http.get(this.baseUrl + '/employee/profile').pipe(
      tap((res: any) => {
        // if (res.profileData.user.userProfileData == '') {
        //   if (res.manager != null) {
        //     res.profileData.manager.userProfileData = '/assets/images/person.png'
        //   } else {
        //     res.profileData.user.userProfileData = '/assets/images/person.png'
        //   }
        // }

        this.updateUserProfile(res);
        return (res.result = true);
      })
    );
  }

  /**
   * @작성자 임호균
   * @작성일 2023-09-04
   * @description 매니저 프로필 정보 받아오는 로직 추가
   * @returns
   */
  getManagerProfile() {
    return this.http.get(this.baseUrl + '/manager/profile').pipe(
      tap((res: any) => {
        // if (res.profileData.user.profile_img == '') {
        //   if (res.manager != null) {
        //     res.profileData.manager.profile_img = '/assets/images/person.png'
        //   } else {
        //     res.profileData.user.profile_img = '/assets/images/person.png'
        //   }
        // }
        this.updateUserProfile(res);
        return (res.result = true);
      })
    );
  }

  updateUserProfile(profile: any) {
    this.userProfile.set(profile);
  }

  checkRole() {
    return this.userProfile().isManager;
  }
}
