import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute
  ) {}
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  userInfo = new UserModel();
  postId = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.postId = params['postId'];
    });
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
      error: () => {
        this.popupTitle = 'Load posts failed!';
        this.popupMessage =
          'Something went wrong while loading posts, please try again later!';
        this.showIt = true;
      },
    });
  }
  postComments: PostCommentModel[] = [];
  getPostComments(postId: string) {
    this.postCommentService.getPostComments(postId).subscribe({
      next: (res) => {
        this.postComments = res;
      },
      error: () => {
        this.popupTitle = 'Load comments failed!';
        this.popupMessage =
          'Something went wrong while loading comments, please try again later!';
        this.showIt = true;
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
      error: () => {
        this.popupTitle = 'Load related posts failed!';
        this.popupMessage =
          'Something went wrong while loading related posts, please try again later!';
        this.showIt = true;
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
    if (this.isEditing === true) {
      this.isEditing = false;
    }
    if (this.userInfo.id === '') {
      this.popupTitle = 'Login required!';
      this.popupMessage = 'Please login to post a comment!';
      this.showIt = true;
      return;
    }
    this.isReplying = status;
    this.commentShowId = commentId;
  }

  isEditing = false;
  commentEditShowId = '';
  showEdit(status: boolean, commentId: string) {
    this.isEditing = status;
    this.commentEditShowId = commentId;
    if (this.isReplying === true) {
      this.isReplying = false;
    }
  }

  postCommentInsert = new PostCommentInsertModel();
  postComment(parentCommentId: string | null) {
    this.contentReplyCounter();
    if (this.contentLengthCheck == true) {
      this.popupTitle = 'Comment length invalid!';
      this.popupMessage =
        'Comment length must have at least 1 and less than 500 characters!';
      this.showIt = true;
      return;
    }
    this.postCommentInsert.PostId = this.postId;
    this.postCommentInsert.ParentCommentId = parentCommentId;
    this.postCommentService
      .insertPostComment(this.postCommentInsert)
      .subscribe({
        next: () => {
          this.resetCommentData();
          this.getPostComments(this.postId);
        },
        error: () => {
          this.popupTitle = 'Comment failed!';
          this.popupMessage =
            'Something went wrong while inserting comment, please try again later!';
          this.showIt = true;
        },
      });
  }
  contentLengthCheck = false;
  contentReplyCounter() {
    this.contentLengthCheck = false;
    if (
      this.postCommentInsert.CommentContent.length > 500 ||
      this.postCommentInsert.CommentContent.length == 0
    ) {
      this.contentLengthCheck = true;
    }
    if (
      this.postCommentInsert.CommentContent.length <= 500 &&
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
    if (content.length > 500 || content.length == 0) {
      this.contentLengthForEditCheck = true;
    }
    if (content.length <= 500 && content.length > 0) {
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
      this.popupTitle = 'Comment length invalid!';
      this.popupMessage =
        'Comment length must have at least 1 and less than 500 characters!';
      this.showIt = true;
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
        error: () => {
          this.popupTitle = 'Update comment failed!';
          this.popupMessage =
            'Something went wrong while updating comment, please try again later!';
          this.showIt = true;
        },
      });
  }
  likeComment(commentId: string) {
    this.postCommentService.likePostComment(commentId).subscribe({
      next: () => {
        this.getPostComments(this.postId);
      },
      error: (err) => {
        if (err.status === 401) {
          this.popupTitle = 'Login required!';
          this.popupMessage = 'Please login to interact with the comment!';
          this.showIt = true;
        }
        if (err.status === 409) {
          this.popupTitle = 'Already interact!';
          this.popupMessage = 'You have already interacted with this comment!';
          this.showIt = true;
        }
      },
    });
  }
  dislikeComment(commentId: string) {
    this.postCommentService.dislikePostComment(commentId).subscribe({
      next: () => {
        this.getPostComments(this.postId);
      },
      error: (err) => {
        if (err.status === 401) {
          this.popupTitle = 'Login required!';
          this.popupMessage = 'Please login to interact with the comment!';
          this.showIt = true;
        }
        if (err.status === 409) {
          this.popupTitle = 'Already interact!';
          this.popupMessage = 'You have already interacted with this comment!';
          this.showIt = true;
        }
      },
    });
  }
  likePost() {
    this.postService.likePost(this.postId).subscribe({
      next: () => {
        this.showPost(this.postId);
      },
      error: (err) => {
        if (err.status === 401) {
          this.popupTitle = 'Login required!';
          this.popupMessage = 'Please login to interact with the post!';
          this.showIt = true;
        }
        if (err.status === 409) {
          this.popupTitle = 'Already interact!';
          this.popupMessage = 'You have already interacted with this post!';
          this.showIt = true;
        }
      },
    });
  }
  dislikePost() {
    this.postService.dislikePost(this.postId).subscribe({
      next: () => {
        this.showPost(this.postId);
      },
      error: (err) => {
        if (err.status === 401) {
          this.popupTitle = 'Login required!';
          this.popupMessage = 'Please login to interact with the post!';
          this.showIt = true;
        }
        if (err.status === 409) {
          this.popupTitle = 'Already interact!';
          this.popupMessage = 'You have already interacted with this post!';
          this.showIt = true;
        }
      },
    });
  }
}
