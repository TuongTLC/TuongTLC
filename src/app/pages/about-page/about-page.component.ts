import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.css'],
    standalone: false
})
export class AboutPageComponent {
  constructor(private spinner: NgxSpinnerService) {}
  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
}
