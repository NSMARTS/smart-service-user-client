import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  employeeList(sort: string, order: SortDirection, page: number, pageSize: number, username: string, date: Date) {
    return this.http.get(this.baseUrl + `/manager/employee?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&username=${username}&year=${date}`);
  }


  meetingList() {
    return this.http.get(this.baseUrl + `/employee/meeting`);
  }

  managerMeetingList() {
    return this.http.get(this.baseUrl + `/manager/meeting`);
  }


  about() {
    return this.http.get(this.baseUrl + '/employee/profile/about');
  }

  managerAbout() {
    return this.http.get(this.baseUrl + '/manager/profile/about')
  }

  /**
   * @작성일 2023-09-13
   * @작성자 임호균
   * @param password 비밀번호 
   * @description 비밀번호 검증 API 
   * @returns 
   */
  confirmPassword(password: string) {
    return this.http.post(this.baseUrl + '/employee/profile/confirmPassword', { password })
  }

  confirmManagerPassword(password: string) {
    return this.http.post(this.baseUrl + '/manager/profile/confirmPassword', { password })
  }


  /**
   * @작성일 2023-09-14
   * @작성자 임호균
   * @param password 비밀번호
   * @description 비밀번호 변경 API
   * @returns 
   */
  changePassword(password: string) {
    return this.http.post(this.baseUrl + '/employee/profile/changePassword', { password })
  }

  changeManagerPassword(password: string) {
    return this.http.post(this.baseUrl + '/manager/profile/changePassword', { password })
  }


  /**
   * @작성일 2023-09-14
   * @작성자 임호균
   * @param data 
   * {employee: name, deportment}
   * {manager: name, phoneNumber, address}
   * @description 회원 정보 변경 API
   * @returns 
   */
  changeEmployeeInfo(data: any) {
    return this.http.post(this.baseUrl + '/employee/profile/editProfile', data)
  }

  changeMangerInfo(data: any) {
    return this.http.post(this.baseUrl + '/manager/profile/editProfile', data);
  }


  /**
   * @작성일 2023-09-14
   * @작성자 임호균
   * @param data 
   * {employee: image}
   * {manager: image}
   * @description 회원 프로필 이미지 변경 API
   * @returns 
   */
  changeEmployeeProfileImage(data: any) {
    const formData: FormData = new FormData();
    formData.append("file", data, data?.name);
    return this.http.post(this.baseUrl + '/employee/profile/changeImage', formData, {
      reportProgress: true,
    });
  }

  changeManagerProfileImage(data: any) {
    const formData: FormData = new FormData();
    formData.append("file", data, data?.name);
    return this.http.post(this.baseUrl + '/manager/profile/changeImage', formData, {
      reportProgress: true,
    });
  }


  resetEmployeeProfileImage() {
    return this.http.get(this.baseUrl + '/employee/profile/resetImage')
  }

  resetManagerProfileImage() {
    return this.http.get(this.baseUrl + '/manager/profile/resetImage')
  }
}
