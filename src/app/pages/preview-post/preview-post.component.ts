import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post-service';

@Component({
    selector: 'app-preview-post',
    templateUrl: './preview-post.component.html',
    styleUrls: ['./preview-post.component.css'],
    standalone: false
})
export class PreviewPostComponent implements OnInit {
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  postId = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.postId = params['postId'];
    });
    this.getPost(this.postId);
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
        this.spinner.hide();
        this.popupTitle = 'Load post failed!';
        this.popupMessage =
          'Something went wrong while loading post, please try again later!';
        this.showIt = true;
      },
    });
  }
  banPost(postId: string) {
    this.postService.banPost(postId).subscribe({
      next: () => {
        this.getPost(this.postId);
      },
      error: () => {
        this.popupTitle = 'Failed to ban post!';
        this.popupMessage =
          'Something went wrong while banning post, please try again later!';
        this.showIt = true;
      },
    });
  }
  approvePost(postId: string) {
    this.postService.approvePost(postId).subscribe({
      next: () => {
        this.getPost(this.postId);
      },
      error: () => {
        this.popupTitle = 'Failed to approve post!';
        this.popupMessage =
          'Something went wrong while approving post, please try again later!';
        this.showIt = true;
      },
    });
  }
  unbanPost(postId: string) {
    this.postService.unbanPost(postId).subscribe({
      next: () => {
        this.getPost(this.postId);
      },
      error: () => {
        this.popupTitle = 'Failed to unban post!';
        this.popupMessage =
          'Something went wrong while unbanning post, please try again later!';
        this.showIt = true;
      },
    });
  }
}
