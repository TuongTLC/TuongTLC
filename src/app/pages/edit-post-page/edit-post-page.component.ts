import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';
import { CategoryModel } from 'src/app/models/category-models';
import { FileModel } from 'src/app/models/file-model';
import { PostModel, PostUpdateModel } from 'src/app/models/post-model';
import { TagModel } from 'src/app/models/tag-models';
import { CategoryService } from 'src/app/services/category-service';
import { FileService } from 'src/app/services/file-service';
import { PostService } from 'src/app/services/post-service';
import { TagService } from 'src/app/services/tag-service';

@Component({
  selector: 'app-edit-post-page',
  templateUrl: './edit-post-page.component.html',
  styleUrls: ['./edit-post-page.component.css'],
})
export class EditPostPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    private fileService: FileService,
    private clipboardService: ClipboardService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {}
  postId = '';
  categories: CategoryModel[] = [];
  tags: TagModel[] = [];
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  updated = false;
  closeModal() {
    this.showIt = false;
    if (this.updated === true) {
      this.router.navigate(['/list-view']);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.postId = params['postId'];
    });
    if (this.postId === undefined) {
      this.router.navigate(['/home']);
    }
    this.getUserUrls();
    this.getCategories();
    this.getTags();
    this.getPost(this.postId);
  }
  getPostModel = new PostModel();
  getPost(postId: string) {
    this.spinner.show();
    this.postService.getPost(postId).subscribe({
      next: (res) => {
        this.getPostModel = res;
        this.categories.forEach((cate) => {
          this.getPostModel.postCategories.forEach((cateLoaded) => {
            if (cate.id == cateLoaded.id) {
              this.selectedCategories.push(cate);
            }
          });
        });
        this.tags.forEach((tag) => {
          this.getPostModel.postTags.forEach((tagLoaded) => {
            if (tag.id == tagLoaded.id) {
              this.selectedTags.push(tag);
            }
          });
        });
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.popupTitle = 'Load post failed!';
        this.popupMessage =
          'Something went wrong while loading posts, please try again later!';
        this.showIt = true;
      },
    });
  }
  uploadUrlList: FileModel[] = [];
  selectedFiles: File[] = [];
  fileSizeError = false;
  uploadBtnDisable = false;
  fileChange(event: Event) {
    this.fileSizeError = false;
    this.uploadBtnDisable = false;
    const inputElement = event.target as HTMLInputElement | null;

    if (inputElement !== null && inputElement.files !== null) {
      const files: FileList = inputElement.files;

      if (files.length < 1) {
        this.uploadBtnDisable = true;
      }

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024 * 2) {
          this.fileSizeError = true;
          this.uploadBtnDisable = true;
        }
      }

      if (!this.fileSizeError) {
        for (let i = 0; i < files.length; i++) {
          this.selectedFiles.push(files[i]);
        }
      }
    }
  }
  getCategories() {
    this.selectedCategories = [];
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: () => {
      },
    });
  }
  getTags() {
    this.selectedTags = [];
    this.tagService.getTags('active').subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: () => {
      },
    });
  }
  @ViewChild('innerDiv')
  innerDiv: ElementRef | undefined;
  scrollTopDiv() {
    if (this.innerDiv) {
      this.innerDiv.nativeElement.scrollTop = 0;
    }
  }
  selectedCategoryValue = new CategoryModel();
  selectedCategories: CategoryModel[] = [];

  selectCategory() {
    if (!this.selectedCategories.includes(this.selectedCategoryValue)) {
      this.selectedCategories.push(this.selectedCategoryValue);
    }
  }
  removeSelectedCategory(cateRemove: CategoryModel) {
    this.selectedCategories = this.selectedCategories.filter(
      (obj) => obj.id !== cateRemove.id
    );
  }
  selectedTagValue = new TagModel();
  selectedTags: TagModel[] = [];

  selectTag() {
    if (!this.selectedTags.includes(this.selectedTagValue)) {
      this.selectedTags.push(this.selectedTagValue);
    }
  }
  removeSelectedTag(tagRemove: TagModel) {
    this.selectedTags = this.selectedTags.filter(
      (obj) => obj.id !== tagRemove.id
    );
  }
  uploadFile() {
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }
    this.fileService.uploadFiles(formData).subscribe({
      next: () => {
        this.getUserUrls();
      },
      error: () => {
      },
    });
  }
  getUserUrls() {
    this.uploadUrlList = [];
    this.fileService.getFiles().subscribe({
      next: (res) => {
        this.uploadUrlList = res;
      },
      error: () => {
      },
    });
  }
  removeFile(fileUrl: string) {
    this.fileService.removeFiles(fileUrl).subscribe({
      next: () => {
        this.getUserUrls();
      },
      error: () => {
      },
    });
  }
  copiedUrl = '';
  copyBtn(url: string) {
    this.clipboardService.copyFromContent(url);
    this.copiedUrl = url;
    timer(2000).subscribe(() => {
      this.copiedUrl = '';
    });
  }
  updateModel = new PostUpdateModel();
  update() {
    if (!this.validatePost()) {
      this.updateModel.id = this.postId;
      this.updateModel.postName = this.getPostModel.postInfo.postName;
      this.updateModel.summary = this.getPostModel.postInfo.summary;
      this.updateModel.thumbnail = this.getPostModel.postInfo.thumbnail;
      this.updateModel.categoriesIds = [];
      this.updateModel.tagsIds = [];
      this.selectedCategories.forEach((cate) => {
        this.updateModel.categoriesIds.push(cate.id);
      });
      this.selectedTags.forEach((tag) => {
        this.updateModel.tagsIds.push(tag.id);
      });
      this.postService.updatePost(this.updateModel).subscribe({
        next: () => {
          this.popupTitle = 'Post updated!';
          this.popupMessage = 'Your post have been updated!';
          this.showIt = true;
          this.updated = true;
        },
        error: () => {
          this.popupTitle = 'Post updated failed!';
          this.popupMessage = 'Your post have not been updated!';
          this.showIt = true;
          this.updated = false;
        },
      });
    }
  }
  editorChange(event: EditorChangeContent | EditorChangeSelection) {
    this.updateModel.content = event['editor']['root']['innerHTML'];
  }
  postNameError = false;
  postSummaryError = false;
  postThumbnailError = false;
  postCatesError = false;
  postTagsError = false;
  validatePost() {
    this.postNameError = false;
    this.postSummaryError = false;
    this.postThumbnailError = false;
    this.postCatesError = false;
    this.postTagsError = false;
    let error = false;
    this.popupTitle = '';
    this.popupMessage = '';
    if (
      this.getPostModel.postInfo.postName != null &&
      this.getPostModel.postInfo.postName.length < 6
    ) {
      error = true;
      this.postNameError = true;
      this.popupTitle = 'Post name invalid!';
      this.popupMessage = 'Post name must have at least 5 character!';
    }
    if (
      this.getPostModel.postInfo.summary != null &&
      this.getPostModel.postInfo.summary.length < 6
    ) {
      error = true;
      this.postSummaryError = true;
      this.popupTitle = 'Post summary invalid!';
      this.popupMessage = 'Post summary must have at least 5 character!';
    }
    if (
      this.getPostModel.postInfo.thumbnail != null &&
      this.getPostModel.postInfo.thumbnail.length < 6
    ) {
      error = true;
      this.postThumbnailError = true;
      this.popupTitle = 'Post thumbnail invalid!';
      this.popupMessage = 'Post thumbnail must have at least 5 character!';
    }
    if (
      this.selectedCategories == null ||
      this.selectedCategories.length == 0
    ) {
      error = true;
      this.postCatesError = true;
      this.popupTitle = 'Post category invalid!';
      this.popupMessage = 'Please select at least 1 category!';
    }
    if (this.selectedTags == null || this.selectedTags.length == 0) {
      error = true;
      this.postTagsError = true;
      this.popupTitle = 'Post tag invalid!';
      this.popupMessage = 'Please select at least 1 tag!';
    }
    if (error) {
      this.showIt = true;
    }
    return error;
  }
}
