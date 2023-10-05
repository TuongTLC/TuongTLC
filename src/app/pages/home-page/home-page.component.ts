import { NgxSpinnerService } from 'ngx-spinner';
import { GetPostModel } from './../../models/post-model';
import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category-models';
import { CategoryService } from 'src/app/services/category-service';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private categoryService: CategoryService,
    private postService: PostService
  ) {}
  categories: CategoryModel[] = [];
  selectedCategory = new CategoryModel();
  getPostsModel = new GetPostModel();
  getByCategory = false;
  ngOnInit() {
    this.getCategories();
    this.getPosts(1, 6, 'all', '', '');
  }
  getCategories() {
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        console.error(error);
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
    categoryId: string,
    tagId: string
  ) {
    this.spinner.show();
    this.postService
      .getPosts(pageNum, pageSize, status, categoryId, tagId)
      .subscribe({
        next: (res) => {
          this.getPostsModel  = res;
          this.spinner.hide();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getPostByCategory() {
    if (JSON.stringify(this.selectedCategory).toString() === '"all"') {
      this.getPosts(1, 6, 'all', '', '');
      this.getByCategory = false;
    } else {
      this.getPosts(1, 6, 'all', this.selectedCategory.id, '');
      this.getByCategory = true;
    }
  }
  getPostPage(page: number) {
    if (this.getByCategory == true) {
      this.getPosts(page, 6, 'all', this.selectedCategory.id, '');
    } else {
      this.getPosts(page, 6, 'all', '', '');
    }
  }
}
