import {
  TagCreateModel,
  TagModel,
  TagUpdateModel,
} from './../../models/tag-models';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import jsonDoc from '../../doc';
import { Editor, toDoc, toHTML, Toolbar, Validators } from 'ngx-editor';
import { CategoryService } from 'src/app/services/category-service';
import { TagService } from 'src/app/services/tag-service';
import { FileService } from 'src/app/services/file-service';
import { postCreateModel } from 'src/app/models/post-model';
import { timer } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { PostService } from 'src/app/services/post-service';
import {
  CategoryCreateModel,
  CategoryModel,
  CategoryUpdateModel,
} from 'src/app/models/category-models';
import { FileModel } from 'src/app/models/file-model';
import { UserModel } from 'src/app/models/user-models';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
})
export class CreatePageComponent implements OnInit, OnDestroy {
  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private fileService: FileService,
    private clipboardService: ClipboardService
  ) {}
  postModel: postCreateModel = {
    postName: '',
    summary: '',
    content: '',
    thumbnail: '',
    categoriesIds: [],
    tagsIds: [],
  };
  activePost = true;
  activeCategory = false;
  activeTag = false;
  userInfo: UserModel = new UserModel();
  categoryCreateModel: CategoryCreateModel = new CategoryCreateModel();
  categories: CategoryModel[] = [];
  categoriesAdmin: CategoryModel[] = [];
  tagCreateModel: TagCreateModel = new TagCreateModel();
  tags: TagModel[] = [];
  tagsAdmin: TagModel[] = [];
  uploadUrlList: FileModel[] = [];
  editordoc = jsonDoc;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

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
    if (this.postModel.postName != null && this.postModel.postName.length < 6) {
      error = true;
      this.postNameError = true;
      this.popupTitle = 'Post name invalid!';
      this.popupMessage = 'Post name must have atleast 5 character!';
    }
    if (this.postModel.summary != null && this.postModel.summary.length < 6) {
      error = true;
      this.postSummaryError = true;
      this.popupTitle = 'Post summary invalid!';
      this.popupMessage = 'Post summary must have atleast 5 character!';
    }
    if (
      this.postModel.thumbnail != null &&
      this.postModel.thumbnail.length < 6
    ) {
      error = true;
      this.postThumbnailError = true;
      this.popupTitle = 'Post thumbnail invalid!';
      this.popupMessage = 'Post thumbnail must have atleast 5 character!';
    }
    if (
      this.postModel.categoriesIds == null ||
      this.postModel.categoriesIds.length == 0
    ) {
      error = true;
      this.postCatesError = true;
      this.popupTitle = 'Post category invalid!';
      this.popupMessage = 'Please select atleast 1 category!';
    }
    if (this.postModel.tagsIds == null || this.postModel.tagsIds.length == 0) {
      error = true;
      this.postTagsError = true;
      this.popupTitle = 'Post tag invalid!';
      this.popupMessage = 'Please select atleast 1 tag!';
    }
    if (error) {
      this.showIt = true;
    }
    return error;
  }
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
    this.scrollTopDiv();
  }
  @ViewChild('innerDiv')
  innerDiv: ElementRef | undefined;
  scrollTopDiv() {
    if (this.innerDiv) {
      this.innerDiv.nativeElement.scrollTop = 0;
    }
  }
  saveContent = '';
  save() {
    this.editordoc = this.form.get('editorContent').value;
    this.saveContent = toHTML(this.editordoc);
    this.postModel.categoriesIds = [];
    this.selectedCategories.forEach((category) => {
      this.postModel.categoriesIds?.push(category.id);
    });
    this.postModel.tagsIds = [];
    this.selectedTags.forEach((tag) => {
      this.postModel.tagsIds?.push(tag.id);
    });
    this.postModel.content = this.saveContent;
    if (!this.validatePost()) {
      this.postService.createPost(this.postModel).subscribe({
        next: (res) => {
          console.log(res);
          this.popupTitle = 'Post save successful!';
          this.popupMessage =
            'Your post have been save and will be reviewed by admin!';
          this.showIt = true;
          this.resetPostModel();
        },
        error: (error) => {
          this.popupTitle = 'Post save failed!';
          this.popupMessage = 'Something happen while trying to save post!';
          this.showIt = true;
          console.error(error);
        },
      });
    } else {
      console.error('Post invalid!');
    }
  }
  resetPostModel() {
    this.postModel.postName = '';
    this.postModel.summary = '';
    this.postModel.content = '';
    this.postModel.thumbnail = '';
    this.postModel.categoriesIds = [];
    this.postModel.tagsIds = [];
  }
  savedraft() {
    this.editordoc = this.form.get('editorContent')?.value;
    this.saveContent = toHTML(this.editordoc);
    this.postModel.categoriesIds = [];
    this.selectedCategories.forEach((category) => {
      this.postModel.categoriesIds?.push(category.id);
    });
    this.postModel.tagsIds = [];
    this.selectedTags.forEach((tag) => {
      this.postModel.tagsIds?.push(tag.id);
    });
    this.postModel.content = this.saveContent;
    localStorage.setItem('draft-post', JSON.stringify(this.postModel));
    this.popupTitle = 'Post draft saved !';
    this.popupMessage =
      'Your post draft have been saved, you can load it later!';
    this.showIt = true;
  }
  loadDraft() {
    this.selectedCategories = [];
    this.selectedTags = [];
    const postDraft = localStorage.getItem('draft-post');
    if (postDraft != null) {
      this.postModel = JSON.parse(postDraft);
      console.log(this.postModel);
      this.categories.forEach((cate) => {
        this.postModel.categoriesIds.forEach((cateSaved) => {
          if (cate.id == cateSaved) {
            this.selectedCategories.push(cate);
          }
        });
      });
      this.tags.forEach((tag) => {
        this.postModel.tagsIds.forEach((tagSaved) => {
          if (tag.id == tagSaved) {
            this.selectedTags.push(tag);
          }
        });
      });
      this.form.get('editorContent').setValue(toDoc(this.postModel.content));
    } else {
      this.popupTitle = 'No post draft to load!';
      this.popupMessage = 'You have not save any draft to load!';
      this.showIt = true;
    }
  }
  form: any;
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
  getCategoriesAdmin() {
    this.categoryService.getCategories('all').subscribe({
      next: (res) => {
        this.categoriesAdmin = res;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getTags() {
    this.tagService.getTags('active').subscribe({
      next: (res) => {
        this.tags = res;
        this.scrollTopDiv();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getTagsAdmin() {
    this.tagService.getTags('all').subscribe({
      next: (res) => {
        this.tagsAdmin = res;
        this.scrollTopDiv();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  ngOnInit() {
    this.editor = new Editor();
    this.getCategories();
    this.getTags();
    this.getUserUrls();
    if (this.selectedFiles.length < 1) {
      this.uploadBtnDisable = true;
    }
    const getUserInfo = sessionStorage.getItem('userInfo');
    if (getUserInfo) {
      this.userInfo = JSON.parse(getUserInfo);
    }

    this.form = new FormGroup({
      editorContent: new FormControl(jsonDoc, Validators.required()),
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  copiedUrl = '';
  copyBtn(url: string) {
    this.clipboardService.copyFromContent(url);
    this.copiedUrl = url;
    timer(2000).subscribe(() => {
      this.copiedUrl = '';
    });
  }
  activatePost() {
    this.activePost = true;
    this.activeCategory = false;
    this.activeTag = false;
  }
  activateCategory() {
    this.activePost = false;
    this.activeCategory = true;
    this.activeTag = false;
    this.getCategoriesAdmin();
  }
  activateTag() {
    this.activePost = false;
    this.activeCategory = false;
    this.activeTag = true;
    this.getTagsAdmin();
  }
  selectedCategoryValue = new CategoryModel();
  selectedCategories: CategoryModel[] = [];

  selectCategory() {
    if (!this.selectedCategories.includes(this.selectedCategoryValue)) {
      this.selectedCategories.push(this.selectedCategoryValue);
    }
  }
  removeSelectedCategory(cateRevmove: CategoryModel) {
    this.selectedCategories = this.selectedCategories.filter(
      (obj) => obj.id !== cateRevmove.id
    );
  }
  selectedTagValue = new TagModel();
  selectedTags: TagModel[] = [];

  selectTag() {
    if (!this.selectedTags.includes(this.selectedTagValue)) {
      this.selectedTags.push(this.selectedTagValue);
    }
  }
  removeSelectedTag(tagRevmove: TagModel) {
    this.selectedTags = this.selectedTags.filter(
      (obj) => obj.id !== tagRevmove.id
    );
  }
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
  uploadFile() {
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }
    this.fileService.uploadFiles(formData).subscribe({
      next: () => {
        this.getUserUrls();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getUserUrls() {
    this.uploadUrlList = [];
    this.fileService.getFiles().subscribe({
      next: (res) => {
        this.uploadUrlList = res;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  removeFile(fileUrl: string) {
    this.fileService.removeFiles(fileUrl).subscribe({
      next: () => {
        this.getUserUrls();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  createCategory() {
    if (
      this.categoryCreateModel.categoryName.length < 6 ||
      this.categoryCreateModel.description.length < 6
    ) {
      this.popupTitle = 'Category invalid!';
      this.popupMessage =
        'Category name or description must be atleast 6 characters!';
      this.showIt = true;
    } else {
      this.categoryService.createCategory(this.categoryCreateModel).subscribe({
        next: () => {
          this.getCategories();
          this.getCategoriesAdmin();
          this.popupTitle = 'Category created!';
          this.popupMessage = 'Category created and ready to use!';
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
    const categoryupdateModel: CategoryUpdateModel = {
      id: category.id,
      categoryName: category.categoryName,
      description: category.description,
    };
    if (
      categoryupdateModel.categoryName.length < 6 ||
      categoryupdateModel.description.length < 6
    ) {
      this.popupTitle = 'Category invalid!';
      this.popupMessage =
        'Category name or description must be atleast 6 characters!';
      this.showIt = true;
    } else {
      this.categoryService.updateCategory(categoryupdateModel).subscribe({
        next: () => {
          this.getCategories();
          this.getCategoriesAdmin();
          this.popupTitle = 'Category Updated!';
          this.popupMessage = 'Category updated and ready to use!';
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
        this.getCategories();
        this.getCategoriesAdmin();
        this.popupTitle = 'Category Updated!';
        this.popupMessage = 'Category updated and ready to use!';
        this.showIt = true;
      },
      error: (error) => {
        this.popupTitle = 'Update error!';
        this.popupMessage = error.error;
        console.log(error);

        this.showIt = true;
      },
    });
  }
  createTag() {
    this.tagService.createTag(this.tagCreateModel).subscribe({
      next: () => {
        this.popupTitle = 'Tag created!';
        this.popupMessage = 'Tag created and ready to use!';
        this.showIt = true;
        this.getTags();
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
    const tagupdateModel: TagUpdateModel = {
      id: tag.id,
      tagName: tag.tagName,
      description: tag.description,
    };
    if (
      tagupdateModel.tagName.length < 6 ||
      tagupdateModel.description.length < 6
    ) {
      this.popupTitle = 'Tag invalid!';
      this.popupMessage =
        'Tag name or description must be atleast 6 characters!';
      this.showIt = true;
    } else {
      this.tagService.updateTag(tagupdateModel).subscribe({
        next: () => {
          this.getTags();
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
      next: (res) => {
        console.log(res);
        this.getTags();
        this.getTagsAdmin();
        this.popupTitle = 'Tag Updated!';
        this.popupMessage = 'Tag updated!';
        this.showIt = true;
      },
      error: (error) => {
        this.popupTitle = 'Update error!';
        this.popupMessage = error.error;
        console.log(error);

        this.showIt = true;
      },
    });
  }
}
