import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import jsonDoc from '../../doc';
import { Editor, toHTML, Toolbar, Validators } from 'ngx-editor';
import { CategoryService } from 'src/app/services/category-service';
import { categoryModel } from 'src/app/models/category-models';
import { TagService } from 'src/app/services/tag-service';
import { FileService } from 'src/app/services/file-service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
})
export class CreatePageComponent {
  constructor(
    private categoryService: CategoryService,
    private tagService: TagService,
    private fileService: FileService
  ) {}
  activePost = true;
  activeCategory = false;
  activeTag = false;
  categories: any;
  tags: any;
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

  form = new FormGroup({
    editorContent: new FormControl(
      { value: jsonDoc, disabled: false },
      Validators.required()
    ),
  });

  saveContent: any;

  save() {
    this.editordoc = this.form.get('editorContent')?.value;
    this.saveContent = toHTML(this.editordoc);
    console.log(this.saveContent);
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editordoc = jsonDoc;
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
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.getUserUrls();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
  selectedCategoryValue: any;
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
  selectedTagValue: any;
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
  fileChange(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
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
