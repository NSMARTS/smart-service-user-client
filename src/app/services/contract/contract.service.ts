import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  payStubsList(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize: number,
    updatedAt: Date,
    title: string
  ) {
    return this.http.get(
      this.baseUrl +
      `/employee/pay_stubs?sort=${sort}&order=${order}&page=${page + 1
      }&pageSize=${pageSize}&updatedAt=${updatedAt}&title=${title}`
    );
  }

  managerPayStubList(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize: number,
    updatedAt: Date,
    title: string,
    email: string
  ) {
    return this.http.get(
      this.baseUrl +
      `/manager/pay_stubs?sort=${sort}&order=${order}&page=${page! + 1
      }&pageSize=${pageSize}&updatedAt=${updatedAt}&title=${title}&email=${email}`
    );
  }

  getManagerContractList(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize: number,
    uploadStartDate: string,
    uploadEndDate: string,
    title: string,
    email: string
  ) {
    return this.http.get(
      this.baseUrl +
      `/manager/contract?sort=${sort}&order=${order}&page=${page! + 1
      }&pageSize=${pageSize}&uploadStartDate=${uploadStartDate}&uploadEndDate=${uploadEndDate}&title=${title}&email=${email}`
    );
  }
}
