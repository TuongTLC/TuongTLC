import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPostModel, postCreateModel } from '../models/post-model';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  createPost(postModel: postCreateModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/create-post',
      postModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  getPosts(
    pageNum: number,
    pageSize: number,
    status: string
  ): Observable<GetPostModel> {
    return this.http.get<GetPostModel>(
      'https://tuongtlc.ddns.net:8081/post/get-posts?pageNumber=' +
        pageNum +
        '&pageSize=' +
        pageSize +
        '&status=' +
        status
    );
  }
}
