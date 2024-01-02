import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  createLog(data: any) {
    return this.http.post(this.baseUrl + `/log`, data)
  }

  updateLog(data: any) {
    return this.http.post(this.baseUrl + `/log`, data)
  }



}
