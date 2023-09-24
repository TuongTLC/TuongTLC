import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category-service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}
  hideNavbar() {
    let hideUrls = ['/home', '/tutorials', '/tips', '/about', '/create'];
    let isHidden = false;
    hideUrls.forEach((url) => {
      if (url === this.router.url) {
        isHidden = true;
      }
    });
    return isHidden;
  }

  userInfo: any;
  categories: any;

  ngOnInit(): void {
    let token = sessionStorage.getItem('token') ?? 'Not found';
    let userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
    const decodedToken: any = jwt_decode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      this.logout();
    }
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
  menuClick(x: { classList: { toggle: (arg0: string) => void } }) {
    x.classList.toggle('change');
  }
}
