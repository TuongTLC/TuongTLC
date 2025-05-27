import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangePostStatusModel, GetPostModel } from 'src/app/models/post-model';
import { UserModel } from 'src/app/models/user-models';
import { PostService } from 'src/app/services/post-service';

@Component({
    selector: 'app-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.css'],
    standalone: false
})
export class ListViewComponent implements OnInit {
  constructor(
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  userInfo = new UserModel();
  ngOnInit(): void {
    this.getUserPosts(1, 8);
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    } else {
      this.logout();
    }
  }
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }

  postList = new GetPostModel();
  getUserPosts(pageNumber: number, pageSize: number) {
    this.spinner.show();
    this.postService.getUserPosts(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.postList = res;
        this.spinner.hide();
      },error:()=> {
          this.spinner.hide();
          this.popupTitle = 'Failed to load posts!';
          this.popupMessage =
            'Something went wrong while loading posts, please try again later!';
          this.showIt = true;
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
    this.router.navigate(['/preview-post'], { queryParams: queryParams });
  }
  changePostStatusModel = new ChangePostStatusModel();
  changePostStatus(postId: string, oldStatus: boolean) {
    this.changePostStatusModel.postId = postId;
    this.changePostStatusModel.status = 'inactive';
    if (oldStatus === false) {
      this.changePostStatusModel.status = 'active';
    }
    this.postService.changePostStatus(this.changePostStatusModel).subscribe({
      next: () => {
        this.getUserPosts(1, 8);
      },error:() => {
          this.popupTitle = 'Failed to update post!';
          this.popupMessage =
            'Something went wrong while updating posts, please try again later!';
          this.showIt = true;
      },
    });
  }
  toEditPost(postId: string) {
    const queryParams = { postId: postId };
    this.router.navigate(['/edit-post'], { queryParams: queryParams });
  }
}
