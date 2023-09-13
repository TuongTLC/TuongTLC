import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import jsonDoc from "../doc";
import {Editor, toHTML, Toolbar, Validators} from "ngx-editor";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  userInfo: any;
  editordoc: any;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl(
      {value: jsonDoc, disabled: false},
      Validators.required()
    ),
  });

  saveContent: any;

  save() {
    this.editordoc = this.form.get('editorContent')?.value;
    this.saveContent = toHTML(this.editordoc);
    console.log(this.saveContent)
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editordoc = jsonDoc;
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
