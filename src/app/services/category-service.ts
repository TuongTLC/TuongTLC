import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { categoryModel } from '../models/category-models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  getCategories(status: string): Observable<categoryModel[]> {
    return this.http.get<categoryModel[]>(
      'https://tuongtlc.ddns.net:8081/category/get-categories?status=' + status
    );
  }
}
