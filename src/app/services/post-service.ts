import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPostModel, PostModel, postCreateModel } from '../models/post-model';
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
    status?: string,
    categoryId?: string,
    tagId?: string
  ): Observable<GetPostModel> {
    return this.http.get<GetPostModel>(
      'https://tuongtlc.ddns.net:8081/post/get-posts?pageNumber=' +
        pageNum +
        '&pageSize=' +
        pageSize +
        '&status=' +
        status +
        '&categoryId=' +
        categoryId +
        '&tagId=' +
        tagId
    );
  }
  getPost(postId: string): Observable<PostModel> {
    return this.http.get<PostModel>(
      'https://tuongtlc.ddns.net:8081/post/get-post?postId=' + postId
    );
  }
  searchPosts(
    pageNum: number,
    pageSize: number,
    postName: string,
    status?: string,
    categoryId?: string,
    tagId?: string
  ): Observable<GetPostModel> {
    return this.http.get<GetPostModel>(
      'https://tuongtlc.ddns.net:8081/post/search-post?pageNumber=' +
        pageNum +
        '&pageSize=' +
        pageSize +
        '&postName=' +
        postName +
        '&status=' +
        status +
        '&categoryId=' +
        categoryId +
        '&tagId=' +
        tagId
    );
  }
}
