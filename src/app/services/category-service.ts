import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(status: string) {
    return this.http.get(
      'https://tuongtlc.ddns.net:8081/category/get-categories?status=' + status
    );
  }
}
