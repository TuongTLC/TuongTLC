import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category-service';

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
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
    this.categoryService.getCategories('active').subscribe({
      next: (res) => {
        this.categories = res;
        console.log(this.categories);
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
