import { GetPostModel } from './../../models/post-model';
import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category-models';
import { CategoryService } from 'src/app/services/category-service';
import { PostService } from 'src/app/services/post-service';
import { UserService } from 'src/app/services/user-services';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private postService: PostService,
    private userService: UserService
  ) {}
  categories: CategoryModel[] = [];
  selectedCategory = new CategoryModel();
  getPostsModel = new GetPostModel();
  ngOnInit() {
    this.getCategories();
    this.getPosts(1, 6);
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
  getPosts(pageNum: number, pageSize: number) {
    this.postService.getPosts(pageNum, pageSize).subscribe({
      next: (res) => {
        this.getPostsModel = res;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getPostByCategory() {
    console.log('hihi');
  }
}
