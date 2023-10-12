import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostCommentModel, PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css'],
})
export class PostPageComponent implements OnInit {
  constructor(
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const postId = '30C44683-05FD-4245-8FDC-872F305D8176';
    // this.route.queryParams.subscribe((params) => {
    //   postId = params['postId'];
    // });
    if (postId === undefined) {
      this.router.navigate(['/home']);
    }
    this.getPost(postId);
    this.getRelatedPosts(postId);
    this.getPostComments(postId);
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
    this.spinner.show();
    this.postService.getPostComments(postId).subscribe({
      next: (res) => {
        this.postComments = res;
        this.spinner.hide();
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
}
