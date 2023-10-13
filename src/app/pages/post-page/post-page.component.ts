import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  PostCommentInsertModel,
  PostCommentModel,
  PostCommentUpdateModel,
} from 'src/app/models/post-comment-models';
import { PostModel } from 'src/app/models/post-model';
import { UserModel } from 'src/app/models/user-models';
import { PostCommentService } from 'src/app/services/post-comment-service';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css'],
})
export class PostPageComponent implements OnInit {
  constructor(
    private postService: PostService,
    private postCommentService: PostCommentService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  userInfo = new UserModel();
  postId = '';
  ngOnInit(): void {
    this.postId = '30C44683-05FD-4245-8FDC-872F305D8176';
    // this.route.queryParams.subscribe((params) => {
    //   postId = params['postId'];
    // });
    if (this.postId === undefined) {
      this.router.navigate(['/home']);
    }
    this.getPost(this.postId);
    this.getRelatedPosts(this.postId);
    this.getPostComments(this.postId);

    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
  }
  getPostModel = new PostModel();
  getPost(postId: string) {
    this.spinner.show();
    this.postService.getPost(postId).subscribe({
      next: (res) => {
        this.getPostModel = res;
        this.spinner.hide();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  postComments: PostCommentModel[] = [];
  getPostComments(postId: string) {
    this.postCommentService.getPostComments(postId).subscribe({
      next: (res) => {
        this.postComments = res;
        console.log(this.postComments);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  relatedPosts: PostModel[] = [];
  getRelatedPosts(postId: string) {
    this.spinner.show();
    this.postService.getRelatedPosts(postId).subscribe({
      next: (res) => {
        this.relatedPosts = res;
        this.spinner.hide();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  showPost(postId: string) {
    const queryParams = { postId: postId };
    const currentUrl = window.location.pathname;
    const queryString = new URLSearchParams(queryParams).toString();
    const newUrl = `${currentUrl}?${queryString}`;
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  }
  onWheel(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += event.deltaY;
    event.preventDefault();
  }
  isReplying = false;
  commentShowId = '';
  showReply(status: boolean, commentId: string) {
    this.isReplying = status;
    this.commentShowId = commentId;
  }

  isEditing = false;
  commentEditShowId = '';
  showEdit(status: boolean, commentId: string) {
    this.isEditing = status;
    this.commentEditShowId = commentId;
  }

  postCommentInsert = new PostCommentInsertModel();
  postComment(parentCommentId: string) {
    this.contentReplyCounter();
    if (this.contentLengthCheck == true) {
      return;
    }
    this.postCommentInsert.PostId = this.postId;
    this.postCommentInsert.ParentCommentId = parentCommentId;
    console.log(this.postCommentInsert);
    this.postCommentService
      .insertPostComment(this.postCommentInsert)
      .subscribe({
        next: () => {
          this.resetCommentData();
          this.getPostComments(this.postId);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  contentLengthCheck = false;
  contentReplyCounter() {
    this.contentLengthCheck = false;
    if (
      this.postCommentInsert.CommentContent.length > 400 ||
      this.postCommentInsert.CommentContent.length == 0
    ) {
      this.contentLengthCheck = true;
    }
    if (
      this.postCommentInsert.CommentContent.length <= 400 &&
      this.postCommentInsert.CommentContent.length > 0
    ) {
      this.contentLengthCheck = false;
    }
  }
  contentLengthForEditCheck = false;

  contentEditCounter(content: string) {
    this.contentLengthForEditCheck = false;
    if (content === this.postCommentInsert.CommentContent) {
      this.contentLengthForEditCheck = true;
    }
    if (content.length > 400 || content.length == 0) {
      this.contentLengthForEditCheck = true;
    }
    if (content.length <= 400 && content.length > 0) {
      this.contentLengthForEditCheck = false;
    }
  }
  resetCommentData() {
    this.isEditing = false;
    this.isReplying = false;
    this.commentEditShowId = '';
    this.commentShowId = '';
    this.postCommentInsert = new PostCommentInsertModel();
    this.postCommentUpdate = new PostCommentUpdateModel();
  }
  postCommentUpdate = new PostCommentUpdateModel();
  updateComment(commentId: string, commentContent: string) {
    if (this.contentLengthForEditCheck == true) {
      console.error('Nope');
      return;
    }
    this.postCommentUpdate.CommentId = commentId;
    this.postCommentUpdate.Content = commentContent;
    this.postCommentService
      .updatePostComment(this.postCommentUpdate)
      .subscribe({
        next: () => {
          this.resetCommentData();
          this.getPostComments(this.postId);
        },
        error(err) {
          console.error(err);
        },
      });
  }
  likeComment(commentId: string) {
    this.postCommentService.likePostComment(commentId).subscribe({
      next: () => {
        this.getPostComments(this.postId);
      },
      error(err) {
        console.error(err);
      },
    });
  }
  dislikeComment(commentId: string) {
    this.postCommentService.dislikePostComment(commentId).subscribe({
      next: () => {
        this.getPostComments(this.postId);
      },
      error(err) {
        console.error(err);
      },
    });
  }
}
