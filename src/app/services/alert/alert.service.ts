import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // 매니저 알림 리스트 받아오기
  findManagerAlert() {
    return this.http.get(this.baseUrl + `/alert/manager`);
  }

  // 직원 알림 리스트 받아오기
  findEmployeeAlert() {
    return this.http.get(this.baseUrl + `/alert/employee`);
  }

  //매니저 알림 읽음
  readOneManagerAlert(_id: string) {
    return this.http.patch(this.baseUrl + '/alert/manager', { _id });
  }

  // 직원 알림 읽음
  readOneEmployeeAlert(_id: string) {
    return this.http.patch(this.baseUrl + '/alert/employee', { _id });
  }

  readAllManagerAlert() {
    return this.http.patch(this.baseUrl + '/alert/manager/all', {});
  }

  readAllEmployeeAlert() {
    return this.http.patch(this.baseUrl + '/alert/employee/all', {});
  }
}
