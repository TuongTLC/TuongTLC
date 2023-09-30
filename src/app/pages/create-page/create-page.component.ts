import { tagModel } from './../../models/tag-models';
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
import { categoryModel } from 'src/app/models/category-models';

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
  categories: categoryModel[] = [];
  tags: tagModel[] = [];
  uploadUrlList: any;
  editordoc: any;
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
  saveContent: any;
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
  ngOnInit() {
    this.editor = new Editor();
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.tagService.getTags('active').subscribe({
      next: (res) => {
        this.tags = res;
        this.scrollTopDiv();
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.getUserUrls();
    if (this.selectedFiles.length < 1) {
      this.uploadBtnDisable = true;
    }
    this.form = new FormGroup({
      editorContent: new FormControl(jsonDoc, Validators.required()),
    });
  }

  form: any;
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
  }
  activateTag() {
    this.activePost = false;
    this.activeCategory = false;
    this.activeTag = true;
  }
  selectedCategoryValue = '';
  selectedCategories: any[] = [];

  selectCategory() {
    if (!this.selectedCategories.includes(this.selectedCategoryValue)) {
      this.selectedCategories.push(this.selectedCategoryValue);
    }
  }
  removeSelectedCategory(cateRevmove: any) {
    this.selectedCategories = this.selectedCategories.filter(
      (obj) => obj.id !== cateRevmove.id
    );
  }
  selectedTagValue = '';
  selectedTags: any[] = [];

  selectTag() {
    if (!this.selectedTags.includes(this.selectedTagValue)) {
      this.selectedTags.push(this.selectedTagValue);
    }
  }
  removeSelectedTag(tagRevmove: any) {
    this.selectedTags = this.selectedTags.filter(
      (obj) => obj.id !== tagRevmove.id
    );
  }
  selectedFiles: File[] = [];
  fileSizeError = false;
  uploadBtnDisable = false;
  fileChange(event: any) {
    this.fileSizeError = false;
    this.uploadBtnDisable = false;
    const files: FileList = event.target.files;
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
    this.uploadUrlList = null;
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
}
