import { UserService } from './../services/user-services';
import { Component } from '@angular/core';
import { userLoginModel } from '../models/user-models';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  loginInfo: userLoginModel = {
    username: '',
    password: '',
  };
  userInfo: any;
  constructor(private userService: UserService) {}
  login() {
    this.userService.login(this.loginInfo).subscribe((res) => {
      this.userInfo = res;
    });
  }
}
