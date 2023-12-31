import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CategoryCreateModel,
  CategoryModel,
  CategoryUpdateModel,
} from '../models/category-models';
import { Observable } from 'rxjs';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { environment } from 'src/ext';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {}

  getCategories(status: string): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(
      environment.BASE_URL + '/category/get-categories?status=' + status
    );
  }
  createCategory(category: CategoryCreateModel): Observable<CategoryModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<CategoryModel>(
      environment.BASE_URL + '/category/create-category',
      category,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  updateCategory(category: CategoryUpdateModel): Observable<CategoryModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<CategoryModel>(
      environment.BASE_URL + '/category/update-category',
      category,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  updateCategoryStatus(
    categoryId: string,
    categoryStatus: boolean
  ): Observable<string> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      environment.BASE_URL +
        '/category/change-category-status?categoryId=' +
        categoryId +
        '&status=' +
        categoryStatus,
      {},
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
