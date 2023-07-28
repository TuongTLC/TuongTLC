import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}
  hideNavbar() {
    let hideUrls = ['/', '/login', '/register'];
    let isHidden = true;
    hideUrls.forEach((url) => {
      if (url === this.router.url) {
        isHidden = false;
      }
    });
    return isHidden;
  }
}
