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

  employeeList(sort: string, order: SortDirection, page: number) {
    return this.http.get(this.baseUrl + `/manager/employee?sort=${sort}&order=${order}&page=${page + 1}`);
  }
}
