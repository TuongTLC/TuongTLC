import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  getCategories(status: string) {
    return this.http.get(
      'https://tuongtlc.ddns.net:8081/category/get-categories?status=' + status
    );
  }
}
