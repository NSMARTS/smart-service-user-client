import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findNotifications(sort: string, order: SortDirection, page: number, isManager: boolean, title: string, category: string) {
    return this.http.get(this.baseUrl + `/notification?sort=${sort}&order=${order}&page=${page + 1}&isManager=${isManager}&title=${title}&category=${category}`)
  }
}
