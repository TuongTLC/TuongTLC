import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css'],
})
export class PostPageComponent implements OnInit {
  constructor(
    private postService: PostService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.getPost('BA782969-FFF0-4652-995D-D3F4FD0EC307');
  }
  getPostModel = new PostModel();
  getPost(postId: string) {
    this.spinner.show();
    this.postService.getPost(postId).subscribe({
      next: (res) => {
        this.getPostModel = res;
        console.log(this.getPostModel);

        this.spinner.hide();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
