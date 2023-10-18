import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagUpdateModel, TagModel, TagCreateModel } from '../models/tag-models';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { environment } from 'src/ext';
@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {}

  getTags(status: string): Observable<TagModel[]> {
    return this.http.get<TagModel[]>(
      environment.BASE_URL + '/tag/get-tags?status=' + status
    );
  }
  createTag(tag: TagCreateModel): Observable<TagModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<TagModel>(
      environment.BASE_URL + '/tag/create-tag',
      tag,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  updateTag(tag: TagUpdateModel): Observable<TagModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<TagModel>(
      environment.BASE_URL + '/tag/update-tag',
      tag,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  updateTagStatus(tagId: string, tagStatus: boolean): Observable<string> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      environment.BASE_URL +
        '/tag/change-tag-status?tagId=' +
        tagId +
        '&status=' +
        tagStatus,
      {},
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
