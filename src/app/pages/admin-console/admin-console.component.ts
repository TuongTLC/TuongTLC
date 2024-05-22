import { Component, OnInit } from '@angular/core';
import { ChangeUserStatusModel, UserModel } from 'src/app/models/user-models';
import { UserService } from 'src/app/services/user-services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post-service';
import { GetPostModel } from 'src/app/models/post-model';
import { CategoryService } from 'src/app/services/category-service';
import { TagService } from 'src/app/services/tag-service';
import {
  CategoryCreateModel,
  CategoryModel,
  CategoryUpdateModel,
} from 'src/app/models/category-models';
import {
  TagCreateModel,
  TagModel,
  TagUpdateModel,
} from 'src/app/models/tag-models';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css'],
})
export class AdminConsoleComponent implements OnInit {
  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {}
  userInfo = new UserModel();

  ngOnInit(): void {
    this.getUsers('all');
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
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  activeUsers = true;
  activePosts = false;
  activeCategories = false;
  activeTags = false;
  resetActive() {
    this.activeUsers = false;
    this.activePosts = false;
    this.activeCategories = false;
    this.activeTags = false;
  }
  activateUser() {
    this.resetActive();
    this.activeUsers = true;
  }
  activatePost() {
    this.resetActive();
    this.activePosts = true;
    this.getPosts(1, 8, 'all', '', '', '');
  }
  activateCategory() {
    this.resetActive();
    this.activeCategories = true;
    this.getCategoriesAdmin();
  }
  activateTag() {
    this.resetActive();
    this.activeTags = true;
    this.getTagsAdmin();
  }
  userList: UserModel[] = [];
  getUsers(status: string) {
    this.spinner.show();
    this.userService.getUsers(status).subscribe({
      next: (res) => {
        this.userList = res;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.popupTitle = 'Load users failed!';
        this.popupMessage =
          'Something went wrong while loading users, please try again later!';
        this.showIt = true;
      },
    });
  }

  changeUserStatus(userId: string, status: boolean) {
    const changeUserStatusModel = new ChangeUserStatusModel();
    changeUserStatusModel.userId = userId;
    changeUserStatusModel.status = status;
    this.userService.changeUserStatus(changeUserStatusModel).subscribe({
      next: () => {
        this.getUsers('all');
      },
      error: () => {
        this.popupTitle = 'Change user status failed!';
        this.popupMessage =
          'Something went wrong while changing user status, please try again later!';
        this.showIt = true;
      },
    });
  }
  getPostsModel = new GetPostModel();
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
          this.popupTitle = 'Failed to load posts!';
          this.popupMessage =
            'Something went wrong while loading post, please try again later!';
          this.showIt = true;
        },
      });
  }
  getPostPage(page: number) {
    if (page < 1) {
      page = 1;
    }
    if (page > this.getPostsModel.paging.pageCount) {
      page = this.getPostsModel.paging.pageCount;
    }
    this.getPosts(page, 8, 'all', '', '', '');
  }
  banPost(postId: string) {
    this.postService.banPost(postId).subscribe({
      next: () => {
        this.getPosts(1, 8, 'all', '', '', '');
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
        this.getPosts(1, 8, 'all', '', '', '');
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
        this.getPosts(1, 8, 'all', '', '', '');
      },
      error: () => {
        this.popupTitle = 'Failed to unban post!';
        this.popupMessage =
          'Something went wrong while unbanning post, please try again later!';
        this.showIt = true;
      },
    });
  }
  showPost(postId: string) {
    const queryParams = { postId: postId };
    this.router.navigate(['/preview-post'], { queryParams: queryParams });
  }
  categoriesAdmin: CategoryModel[] = [];
  getCategoriesAdmin() {
    this.categoryService.getCategories('all').subscribe({
      next: (res) => {
        this.categoriesAdmin = res;
      },
      error: () => {
      },
    });
  }
  tagsAdmin: TagModel[] = [];
  getTagsAdmin() {
    this.tagService.getTags('all').subscribe({
      next: (res) => {
        this.tagsAdmin = res;
      },
      error: () => {
      },
    });
  }
  categoryCreateModel: CategoryCreateModel = new CategoryCreateModel();

  createCategory() {
    if (
      this.categoryCreateModel.categoryName.length < 6 ||
      this.categoryCreateModel.description.length < 6
    ) {
      this.popupTitle = 'Category invalid!';
      this.popupMessage =
        'Category name or description must be at least 6 characters!';
      this.showIt = true;
    } else {
      this.categoryService.createCategory(this.categoryCreateModel).subscribe({
        next: () => {
          this.getCategoriesAdmin();
          this.popupTitle = 'Category created!';
          this.popupMessage = 'Category created!';
          this.showIt = true;
          this.categoryCreateModel = new CategoryCreateModel();
        },
        error: (error) => {
          this.popupTitle = 'Create error!';
          this.popupMessage = error.error;
          this.showIt = true;
        },
      });
    }
  }
  updateCategory(category: CategoryModel) {
    const categoryUpdateModel: CategoryUpdateModel = {
      id: category.id,
      categoryName: category.categoryName,
      description: category.description,
    };
    if (
      categoryUpdateModel.categoryName.length < 6 ||
      categoryUpdateModel.description.length < 6
    ) {
      this.popupTitle = 'Category invalid!';
      this.popupMessage =
        'Category name or description must be at least 6 characters!';
      this.showIt = true;
    } else {
      this.categoryService.updateCategory(categoryUpdateModel).subscribe({
        next: () => {
          this.getCategoriesAdmin();
          this.popupTitle = 'Category Updated!';
          this.popupMessage = 'Category updated!';
          this.showIt = true;
        },
        error: (error) => {
          this.popupTitle = 'Update error!';
          this.popupMessage = error.error;
          this.showIt = true;
        },
      });
    }
  }
  changeCategoryStatus(id: string, status: boolean) {
    this.categoryService.updateCategoryStatus(id, status).subscribe({
      next: () => {
        this.getCategoriesAdmin();
        this.popupTitle = 'Category Updated!';
        this.popupMessage = 'Category updated!';
        this.showIt = true;
      },
      error: (error) => {
        this.popupTitle = 'Update error!';
        this.popupMessage = error.error;

        this.showIt = true;
      },
    });
  }
  tagCreateModel: TagCreateModel = new TagCreateModel();
  createTag() {
    this.tagService.createTag(this.tagCreateModel).subscribe({
      next: () => {
        this.popupTitle = 'Tag created!';
        this.popupMessage = 'Tag created !';
        this.showIt = true;
        this.getTagsAdmin();
        this.tagCreateModel = new TagCreateModel();
      },
      error: (error) => {
        this.popupTitle = 'Create error!';
        this.popupMessage = error.error;
        this.showIt = true;
      },
    });
  }
  updateTag(tag: TagModel) {
    const tagUpdateModel: TagUpdateModel = {
      id: tag.id,
      tagName: tag.tagName,
      description: tag.description,
    };
    if (
      tagUpdateModel.tagName.length < 6 ||
      tagUpdateModel.description.length < 6
    ) {
      this.popupTitle = 'Tag invalid!';
      this.popupMessage =
        'Tag name or description must be at least 6 characters!';
      this.showIt = true;
    } else {
      this.tagService.updateTag(tagUpdateModel).subscribe({
        next: () => {
          this.getTagsAdmin();
          this.popupTitle = 'Tag Updated!';
          this.popupMessage = 'Tag updated!';
          this.showIt = true;
        },
        error: (error) => {
          this.popupTitle = 'Update error!';
          this.popupMessage = error.error;
          this.showIt = true;
        },
      });
    }
  }
  changeTagStatus(id: string, status: boolean) {
    this.tagService.updateTagStatus(id, status).subscribe({
      next: () => {
        this.getTagsAdmin();
        this.popupTitle = 'Tag Updated!';
        this.popupMessage = 'Tag updated!';
        this.showIt = true;
      },
      error: (error) => {
        this.popupTitle = 'Update error!';
        this.popupMessage = error.error;

        this.showIt = true;
      },
    });
  }
}
