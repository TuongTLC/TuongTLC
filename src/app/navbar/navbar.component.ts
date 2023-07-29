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
    let hideUrls = ['/home', '/tutorials', '/tips', '/about'];
    let isHidden = false;
    hideUrls.forEach((url) => {
      if (url === this.router.url) {
        isHidden = true;
      }
    });
    return isHidden;
  }
}
