import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { RequestLeaveData } from 'src/app/interfaces/request-leave.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

    /**
   * @작성일 2023-08-29
   * @작성장 임호균
   * @description 로그인 로직
   * @param loginData RequestLeaveData []
   * @returns Observable<Token>
   */
    requestLeave(leaveData: RequestLeaveData ) {
      return this.http.post(this.baseUrl + `/leave`, leaveData).pipe(
      )
    }


    /**
     * @작성일 2023-08-29
    * @작성장 임호균
    * @description 로그인 로직
     * @param sort 오름차순 내림차순
     * @param order 오름차순 내림차순
     * @param page 몇 페이지
     * @param leaveType 검색: 타입 (연가, 병가, 등등)
     * @param leaveDay 연차, 반차
     * @param leaveStartDate 연차 시작일
     * @param leaveEndDate 연차 마지막일
     * @param status 현재 상태
     * @returns 위 정보에 해당하는 데이터
     */
    searchLeaves(sort: string, order: SortDirection, page: number, leaveType: string, leaveDay: string, leaveStartDate: Date, leaveEndDate: Date, status: string) {
      return this.http.get(this.baseUrl + `/leave?sort=${sort}&order=${order}&page=${page + 1}&leaveType=${leaveType}&leaveDay=${leaveDay}&leaveStartDate=${leaveStartDate}&leaveEndDate=${leaveEndDate}&status=${status}`).pipe()
    }

    /**
    * @작성일 2023-08-29
    * @작성장 임호균
     * @param sort 오름차순 내림차순
     * @param order 오름차순 내림차순
     * @param page 몇 페이지
     * @returns 
     */
    searchLeavesThreeMonth(sort: string, order: SortDirection, page: number){
      return this.http.get(this.baseUrl + `/leave/threeMonthAgo?sort=${sort}&order=${order}&page=${page + 1}`).pipe()
    }
}
