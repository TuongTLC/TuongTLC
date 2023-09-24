import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { postCreateModel } from '../models/post-model';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(postModel: postCreateModel) {
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/category/get-categories?status=',
      postModel
    );
  }
  getPost(pageNum: number, pageSize: number) {
    return this.http.get(
      'https://tuongtlc.ddns.net:8081/post/get-posts?pageNumber=' +
        pageNum +
        '&pageSize=' +
        pageSize
    );
  }
}
