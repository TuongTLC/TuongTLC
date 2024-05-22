import { NgxSpinnerService } from 'ngx-spinner';
import { GetPostModel } from './../../models/post-model';
import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category-models';
import { CategoryService } from 'src/app/services/category-service';
import { PostService } from 'src/app/services/post-service';
import { Router } from '@angular/router';
import { TagModel } from 'src/app/models/tag-models';
import { TagService } from 'src/app/services/tag-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private postService: PostService,
    private router: Router
  ) {}
  categories: CategoryModel[] = [];
  tags: TagModel[] = [];
  selectedCategory = new CategoryModel();
  selectedTag = new TagModel();
  getPostsModel = new GetPostModel();
  getByCategory = false;
  getByTag = false;
  filterOpen = false;
  ngOnInit() {
    this.getCategories();
    this.getTags();
    this.getPosts(1, 8, 'active', 'approved', '', '');
  }
  clearFilter() {
    this.selectedCategory = new CategoryModel();
    this.selectedTag = new TagModel();
    this.searchPostStatus = false;
    this.searchPostName = '';
    this.getPosts(1, 8, 'active', 'approved', '', '');
    this.filterAction(false);
  }
  filterAction(action: boolean) {
    this.filterOpen = action;
  }
  getCategories() {
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: () => {
      },
    });
  }
  getTags() {
    this.tagService.getTags('active').subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: () => {
      },
    });
  }
  numToArray(num: number) {
    const result = [];
    for (let i = 1; i <= num; i++) {
      result.push(i);
    }
    return result;
  }
  getPosts(
    pageNum: number,
    pageSize: number,
    status: string,
    adminStatus: string,
    categoryId: string,
    tagId: string
  ) {
    this.spinner.show();
    this.postService
      .getPosts(pageNum, pageSize, status, adminStatus, categoryId, tagId)
      .subscribe({
        next: (res) => {
          this.getPostsModel = res;
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }
  filterPost() {
    if (this.searchPostStatus === true) {
      this.searchPost(
        1,
        8,
        this.searchPostName,
        'active',
        this.selectedCategory === undefined ? '' : this.selectedCategory.id,
        this.selectedTag === undefined ? '' : this.selectedTag.id
      );
    } else {
      this.getPosts(
        1,
        8,
        'active',
        'approved',
        this.selectedCategory.id === undefined ? '' : this.selectedCategory.id,
        this.selectedTag.id === undefined ? '' : this.selectedTag.id
      );
      this.getByCategory = true;
    }
  }

  getPostPage(page: number) {
    if (page < 1) {
      page = 1;
    }
    if (page > this.getPostsModel.paging.pageCount) {
      page = this.getPostsModel.paging.pageCount;
    }
    if (this.searchPostStatus == true) {
      this.searchPost(
        page,
        8,
        this.searchPostName,
        'active',
        this.selectedCategory === undefined ? '' : this.selectedCategory.id,
        this.selectedTag === undefined ? '' : this.selectedTag.id
      );
    }
    this.getPosts(
      page,
      8,
      'active',
      'approved',
      this.selectedCategory === undefined ? '' : this.selectedCategory.id,
      this.selectedTag === undefined ? '' : this.selectedTag.id
    );
  }
  searchPostStatus = false;
  searchPostName = '';
  searchPostByName() {
    this.searchPost(
      1,
      8,
      this.searchPostName,
      'active',
      this.selectedCategory === undefined ? '' : this.selectedCategory.id,
      this.selectedTag === undefined ? '' : this.selectedTag.id
    );
  }
  checkSearch() {
    if (this.searchPostName === '') {
      return false;
    }
    return true;
  }
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  searchPost(
    pageNum: number,
    pageSize: number,
    postName: string,
    status: string,
    categoryId: string,
    tagId: string
  ) {
    this.spinner.show();
    this.postService
      .searchPosts(pageNum, pageSize, postName, status, categoryId, tagId)
      .subscribe({
        next: (res) => {
          this.getPostsModel = res;
          this.searchPostStatus = true;
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
          this.popupTitle = 'Failed to load posts!';
          this.popupMessage =
            'Something went wrong while loading posts, please try again later!';
          this.showIt = true;
        },
      });
  }
  showPost(postId: string) {
    const queryParams = { postId: postId };
    this.router.navigate(['/post'], { queryParams: queryParams });
  }
}
