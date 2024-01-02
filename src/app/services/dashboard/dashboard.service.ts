import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  managerDashboard() {
    return this.http.get(this.baseUrl + '/manager/dashboard/info');
  }

  employeeDashboard() {
    return this.http.get(this.baseUrl + '/employee/dashboard/info');
  }
}
