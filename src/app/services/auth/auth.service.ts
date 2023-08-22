/**
 * Version 1.0
 * 파일명: auth.service.ts
 * 작성일시: 2023-08-22
 * 작성자: 임호균
 * 설명: 로그인 백엔드 연동 로직
 */


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { ENV } from 'src/app/config/config';
import { environment } from 'src/environments/environment.development';

//토큰 타입
interface Token {
  token: String;
}

//로그인 타입
interface SignInData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService ) { }

  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로그인 로직
   * @param loginData SignInData [email: string, password: string]
   * @returns Observable<Token>
   */
  signIn(loginData : SignInData) : Observable<Token>{
    return this.http.post<Token>(this.baseUrl + `/user/auth/signIn`, loginData).pipe(
      shareReplay(),
      tap(
        (res: any) => {
          this.setToken(res.token)
        }),
        shareReplay()
    )
  }

  /**
   * @작성일 2023-08-22
   * @작성자 임호균
   * @description 로그아웃
   */
  signOut(): void {
    this.removeToken();
  }

  getUserProfile() {
    return this.http.get('/api/v1/user/profile').pipe(
      tap((res: any) => {
        if(res.user.profile_img == '') {
          if(res.manager != null) {
            res.manager.profile_img = '/assets/image/person.png'
          }else {
            res.user.profile_img = '/assets/image/person.png'
          }  
        }

        //
        return res.result = true;
      })
    )
  }

  changeUserProfile() {

  }

  changeProfileImage() {

  }

  /**
   * @작성일 2023-08-22
   * @작성자 임호균
   * @description 현재 로컬 스토리지에 토큰이 있고, 그 로직이 유효한지 검사
   * @returns true | false
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로컬 스토리지에서 토큰 가져오기
   * @returns 
   */
  getToken(): string | null {
    return localStorage.getItem(ENV.tokenName);
  }

  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로컬 스토리리지에 토근 설정하기 
   * @returns 
   */
  setToken(token: string): void {
    localStorage.setItem(ENV.tokenName, token)
  } 

  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로컬 스토리지에 저장된 토큰 정보 삭제하기
   * @returns 
   */
  removeToken(): void {
    localStorage.removeItem(ENV.tokenName);
  }

  //jwtHelper
  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로컬 스토리지에 저장된 토큰 정보 유효성 검사
   * @returns 
   */
  isTokenExpired(token: string) {
    return this.jwtHelper.isTokenExpired(token)
  }

  /**
   * @작성일 2023-08-22
   * @작성장 임호균
   * @description 로컬 스토리지에 저장된 토큰 정보 복호화 
   * @returns 
   */
  getTokenInfo() {
    return this.jwtHelper.decodeToken(this.getToken()!);
  }
}
