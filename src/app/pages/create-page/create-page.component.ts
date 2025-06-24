import { TagModel } from './../../models/tag-models';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
} from 'src/app/models/category-models';
import { FileModel } from 'src/app/models/file-model';
import { UserModel } from 'src/app/models/user-models';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import { ImageHandler, Options } from 'ngx-quill-upload';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
  standalone: false,
})
export class CreatePageComponent implements OnInit {
  modules: any;
  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private fileService: FileService,
    private clipboardService: ClipboardService,
    private http: HttpClient
  ) {
    Quill.register('modules/imageHandler', ImageHandler);
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['image'],
      ],
      imageHandler: {
        upload: (file: File) => {
          return new Promise<string>((resolve, reject) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
              reject('No auth token');
              return;
            }
            if (
              !(
                file.type === 'image/jpeg' ||
                file.type === 'image/png' ||
                file.type === 'image/jpg'
              )
            ) {
              reject('Unsupported type');
              return;
            }
            if (file.size > 2 * 1024 * 1024) {
              reject('Size too large');
              return;
            }
            const uploadData = new FormData();
            uploadData.append('files', file, file.name);
            this.http
              .post<any>(
                'https://api.tuongtlc.site/file/upload-files',
                uploadData,
                {
                  headers: { Authorization: 'Bearer ' + token },
                }
              )
              .subscribe({
                next: (result) => {
                  // Expecting result to be an array of string URLs
                  if (
                    Array.isArray(result) &&
                    result.length > 0 &&
                    typeof result[0] === 'string'
                  ) {
                    resolve(result[0]);
                  } else {
                    reject('No URL returned');
                  }
                },
                error: (err) => {
                  reject('Upload failed');
                },
              });
          });
        },
        accepts: ['png', 'jpg', 'jpeg'],
      } as Options,
    };
  }
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
  tags: TagModel[] = [];
  tagsAdmin: TagModel[] = [];
  uploadUrlList: FileModel[] = [];
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
      this.popupMessage = 'Post name must have at least 5 character!';
    }
    if (this.postModel.summary != null && this.postModel.summary.length < 6) {
      error = true;
      this.postSummaryError = true;
      this.popupTitle = 'Post summary invalid!';
      this.popupMessage = 'Post summary must have at least 5 character!';
    }
    if (
      this.postModel.thumbnail != null &&
      this.postModel.thumbnail.length < 6
    ) {
      error = true;
      this.postThumbnailError = true;
      this.popupTitle = 'Post thumbnail invalid!';
      this.popupMessage = 'Post thumbnail must have at least 5 character!';
    }
    if (
      this.postModel.categoriesIds == null ||
      this.postModel.categoriesIds.length == 0
    ) {
      error = true;
      this.postCatesError = true;
      this.popupTitle = 'Post category invalid!';
      this.popupMessage = 'Please select at least 1 category!';
    }
    if (this.postModel.tagsIds == null || this.postModel.tagsIds.length == 0) {
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
  save() {
    this.postModel.categoriesIds = [];
    this.selectedCategories.forEach((category) => {
      this.postModel.categoriesIds?.push(category.id);
    });
    this.postModel.tagsIds = [];
    this.selectedTags.forEach((tag) => {
      this.postModel.tagsIds?.push(tag.id);
    });
    if (!this.validatePost()) {
      this.postService.createPost(this.postModel).subscribe({
        next: () => {
          this.popupTitle = 'Post save successful!';
          this.popupMessage =
            'Your post have been save and will be reviewed by admin!';
          this.showIt = true;
          this.resetPostModel();
        },
        error: () => {
          this.popupTitle = 'Post save failed!';
          this.popupMessage = 'Something happen while trying to save post!';
          this.showIt = true;
        },
      });
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
  editorChange(event: EditorChangeContent | EditorChangeSelection) {
    this.postModel.content = event['editor']['root']['innerHTML'];
  }
  saveDraft() {
    this.postModel.categoriesIds = [];
    this.selectedCategories.forEach((category) => {
      this.postModel.categoriesIds?.push(category.id);
    });
    this.postModel.tagsIds = [];
    this.selectedTags.forEach((tag) => {
      this.postModel.tagsIds?.push(tag.id);
    });
    localStorage.setItem('draft-post', JSON.stringify(this.postModel));
    this.popupTitle = 'Post draft saved !';
    this.popupMessage =
      'Your post draft have been saved, you can load it later!';
    this.showIt = true;
  }
  editorData = '';
  loadDraft() {
    this.selectedCategories = [];
    this.selectedTags = [];
    const postDraft = localStorage.getItem('draft-post');
    if (postDraft != null) {
      this.postModel = JSON.parse(postDraft);
      this.categories.forEach((cate) => {
        this.postModel.categoriesIds.forEach((cateSaved) => {
          if (cate.id == cateSaved) {
            this.selectedCategories.push(cate);
          }
        });
      });
      this.editorData = this.postModel.content;
      this.tags.forEach((tag) => {
        this.postModel.tagsIds.forEach((tagSaved) => {
          if (tag.id == tagSaved) {
            this.selectedTags.push(tag);
          }
        });
      });
    } else {
      this.popupTitle = 'No post draft to load!';
      this.popupMessage = 'You have not save any draft to load!';
      this.showIt = true;
    }
  }
  getCategories() {
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: () => {},
    });
  }

  getTags() {
    this.tagService.getTags('active').subscribe({
      next: (res) => {
        this.tags = res;
        this.scrollTopDiv();
      },
      error: () => {},
    });
  }
  ngOnInit() {
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
  }

  copiedUrl = '';
  copyBtn(url: string) {
    this.clipboardService.copyFromContent(url);
    this.copiedUrl = url;
    timer(2000).subscribe(() => {
      this.copiedUrl = '';
    });
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
        this.selectedFiles = [];
      },
      error: () => {},
    });
  }
  getUserUrls() {
    this.uploadUrlList = [];
    this.fileService.getFiles().subscribe({
      next: (res) => {
        this.uploadUrlList = res;
      },
      error: () => {},
    });
  }
  removeFile(fileUrl: string) {
    this.fileService.removeFiles(fileUrl).subscribe({
      next: () => {
        this.getUserUrls();
      },
      error: () => {},
    });
  }
}
