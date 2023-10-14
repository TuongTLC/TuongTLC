import { Injectable } from '@angular/core';
import {
  PostCommentInsertModel,
  PostCommentModel,
  PostCommentUpdateModel,
} from '../models/post-comment-models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostCommentService {
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) {}

  getPostComments(postId: string): Observable<PostCommentModel[]> {
    return this.http.get<PostCommentModel[]>(
      'https://tuongtlc.ddns.net:8081/post-comment/get-post-comments?postId=' +
        postId
    );
  }
  insertPostComment(
    postCommentInsertModel: PostCommentInsertModel
  ): Observable<PostCommentModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<PostCommentModel>(
      'https://tuongtlc.ddns.net:8081/post-comment/insert-comment',
      postCommentInsertModel,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  updatePostComment(postCommentUpdateModel: PostCommentUpdateModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post-comment/update-comment',
      postCommentUpdateModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  likePostComment(commentId: string) {
    const token = sessionStorage.getItem('token');

    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post-comment/like-comment?commentId=' +
        commentId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  dislikePostComment(commentId: string) {
    const token = sessionStorage.getItem('token');

    return this.http.post(
      'https://tuongtlc.ddns.net:8081/post-comment/dislike-comment?commentId=' +
        commentId,
      null,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
