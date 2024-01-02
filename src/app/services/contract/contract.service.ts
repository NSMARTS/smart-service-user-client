import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {

  contractMod = signal<string>('') // detail //sign

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  payStubsList(
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
      `/employee/pay_stubs?sort=${sort}&order=${order}&page=${page! + 1
      }&pageSize=${pageSize}&uploadStartDate=${uploadStartDate}&uploadEndDate=${uploadEndDate}&title=${title}&email=${email}`
    );
  }

  getPayStubById(id: string) {
    return this.http.get(this.baseUrl + '/employee/pay_stubs/' + id)
  }

  managerPayStubList(
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
      `/manager/pay_stubs?sort=${sort}&order=${order}&page=${page! + 1
      }&pageSize=${pageSize}&uploadStartDate=${uploadStartDate}&uploadEndDate=${uploadEndDate}&title=${title}&email=${email}`
    );
  }

  getManagerPayStubById(id: string, employeeId: string) {
    return this.http.get(this.baseUrl + '/manager/pay_stubs/' + id + '/' + employeeId)
  }

  signPayStub(body: any) {
    return this.http.post(this.baseUrl + '/employee/pay_stubs/sign', body)
  }

  verifyPayStub(id: string, file: File) {
    const formData: FormData = new FormData();
    formData.append("contractId", id);
    formData.append("file", file, file?.name);

    return this.http.post(this.baseUrl + '/employee/pay_stubs/verify', formData)
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

  getContract(
    contractId: string
  ) {
    return this.http.get(
      this.baseUrl +
      `/manager/contract/${contractId}`);
  }

  downloadContract(key: string): Observable<Blob> {
    const encodedUrl = encodeURIComponent(key);
    const headers = new HttpHeaders({
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf'
    });
    return this.http.get(this.baseUrl + `/manager/contract/download/${encodedUrl}`, {
      headers: headers,
      responseType: 'blob'
    })
  }

  signManagerContract(body: any) {
    return this.http.post(this.baseUrl + '/manager/contract', body)
  }

  rejectManagerContract(body: any) {
    return this.http.post(this.baseUrl + '/manager/contract/reject', body)
  }

  verifyManagerContract(id: string, file: File) {
    const formData: FormData = new FormData();
    formData.append("contractId", id);
    formData.append("file", file, file?.name);
    return this.http.post(this.baseUrl + '/manager/contract/verify', formData)
  }


  getContractList(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize: number,
    uploadStartDate: string,
    uploadEndDate: string,
    title: string,
  ) {
    return this.http.get(
      this.baseUrl +
      `/employee/contract?sort=${sort}&order=${order}&page=${page! + 1
      }&pageSize=${pageSize}&uploadStartDate=${uploadStartDate}&uploadEndDate=${uploadEndDate}&title=${title}`
    );
  }

  signContract(body: any) {
    return this.http.post(this.baseUrl + '/employee/contract', body)
  }

  rejectContract(body: any) {
    return this.http.post(this.baseUrl + '/employee/contract/reject', body)
  }

  verifyContract(id: string, file: File) {
    const formData: FormData = new FormData();
    formData.append("contractId", id);
    formData.append("file", file, file?.name);

    return this.http.post(this.baseUrl + '/employee/contract/verify', formData)
  }

}
