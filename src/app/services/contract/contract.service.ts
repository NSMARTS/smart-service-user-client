import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  contractList(sort: string, order: SortDirection, page: number, updatedAt: Date, title: string) {
    return this.http.get(this.baseUrl + `/employee/contract?sort=${sort}&order=${order}&page=${page + 1}&updatedAt=${updatedAt}&title=${title}`);
  }

  managerContractList(sort: string, order: SortDirection, page: number, updatedAt: Date, title: string, email: string) {
    return this.http.get(this.baseUrl + `/manager/contract?sort=${sort}&order=${order}&page=${page! + 1}&updatedAt=${updatedAt}&title=${title}&email=${email}`)
  }
}
