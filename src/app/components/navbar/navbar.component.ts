import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}
  hideNavbar() {
    const hideUrls = [
      '/home',
      '/tutorials',
      '/tips',
      '/about',
      '/create',
      '/post',
    ];
    let isHidden = false;
    hideUrls.forEach((url) => {
      if (url === this.router.url) {
        isHidden = true;
      }
    });
    return isHidden;
  }

  userInfo!: UserModel;

  ngOnInit(): void {
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
  }
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
}
