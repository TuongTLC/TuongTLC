import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ChangePostStatusModel,
  GetPostModel,
  PostModel,
} from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
})
export class ListViewComponent implements OnInit {
  constructor(
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getUserPosts(1, 8);
  }

  postList = new GetPostModel();
  getUserPosts(pageNumber: number, pageSize: number) {
    this.spinner.show();
    this.postService.getUserPosts(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.postList = res;
        this.spinner.hide();
      },
    });
  }
  getPostPage(page: number) {
    if (page < 1) {
      page = 1;
    }
    if (page > this.postList.paging.pageCount) {
      page = this.postList.paging.pageCount;
    }
    this.getUserPosts(page, 8);
  }
  showPost(postId: string) {
    const queryParams = { postId: postId };
    this.router.navigate(['/post'], { queryParams: queryParams });
  }
  changePostStatusModel = new ChangePostStatusModel();
  changePostStatus(postId: string, oldStatus: boolean) {
    this.changePostStatusModel.postId = postId;
    this.changePostStatusModel.status = 'inactive';
    if (oldStatus === false) {
      this.changePostStatusModel.status = 'active';
    }
    this.postService.changePostStatus(this.changePostStatusModel).subscribe({
      next: (res) => {
        this.getUserPosts(1, 8);
        console.log(res);
      },
    });
  }
  toEditPost(postId: string) {
    const queryParams = { postId: postId };
    this.router.navigate(['/edit-post'], { queryParams: queryParams });
  }
}
