import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  requestCountryHoliday() {
    return this.http.get(this.baseUrl + `/leave/countryHoliday`).pipe();
  }

  requestCompanyHoliday() {
    return this.http.get(this.baseUrl + '/leave/companyHoliday').pipe();
  }
}
