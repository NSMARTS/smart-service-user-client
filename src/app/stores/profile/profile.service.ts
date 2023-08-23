/**
 * Version 1.0
 * 파일명: profile.service.ts
 * 작성일시: 2023-08-23
 * 작성자: 임호균
 * 설명: 유저 프로필 정보 저장 서비스
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.apiUrl;
  userProfile = signal<any>('');

  constructor(public http: HttpClient) { }
  
  getUserProfile() {
    return this.http.get(this.baseUrl + '/employee/profile').pipe(
      tap((res: any) => {
        console.log(res) 
        if(res.user.profile_img == '') {
          if(res.manager != null) {
            res.manager.profile_img = '/assets/image/person.png'
          }else {
            res.user.profile_img = '/assets/image/person.png'
          }  
        }
        

        this.updateUserProfile(res);
        return res.result = true;
      })
    )
  }

  updateUserProfile(profile: any) {
     this.userProfile.set(profile);
  }
}
