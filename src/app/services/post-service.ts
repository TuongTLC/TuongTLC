import { ChangePostStatusModel } from './../models/post-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetPostModel,
  PostModel,
  PostUpdateModel,
  postCreateModel,
} from '../models/post-model';
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
  updatePost(postUpdateModel: PostUpdateModel): Observable<PostModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<PostModel>(
      'https://tuongtlc.ddns.net:8081/post/update-post',
      postUpdateModel,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  getPosts(
    pageNum: number,
    pageSize: number,
    status?: string,
    adminStatus?: string,
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
        '&adminStatus=' +
        adminStatus +
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
  getRelatedPosts(postId: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(
      'https://tuongtlc.ddns.net:8081/post/get-related-posts?postId=' + postId
    );
  }
  likePost(postId: string) {
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/like-post?postId=' + postId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  dislikePost(postId: string) {
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/dislike-post?postId=' + postId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  getUserPosts(pageNumber: number, pageSize: number): Observable<GetPostModel> {
    const token = sessionStorage.getItem('token');
    return this.http.get<GetPostModel>(
      'https://tuongtlc.ddns.net:8081/post/get-user-posts?pageNumber=' +
        pageNumber +
        '&pageSize=' +
        pageSize,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  changePostStatus(changePostStatusModel: ChangePostStatusModel) {
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/change-post-status',
      changePostStatusModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  banPost(postId: string) {
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/ban-post?postId=' + postId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  unbanPost(postId: string) {
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post/unban-post?postId=' + postId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
