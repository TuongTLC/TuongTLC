import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  userInfo: any;
  constructor() {}
  ngOnInit(): void {
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    }
  }
}
