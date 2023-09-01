import { UserService } from './../services/user-services';
import { Component } from '@angular/core';
import { userLoginModel } from '../models/user-models';
import { Router } from '@angular/router';

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
  loginError: any;
  usernameEmpty: any;
  passwordEmpty: any;
  constructor(private userService: UserService, private router: Router) {}
  validateLoginInfo() {
    if (this.loginInfo.username?.length == 0) {
      this.usernameEmpty = true;
    }
    if (this.loginInfo.password?.length == 0) {
      this.passwordEmpty = true;
    }
    if (this.usernameEmpty === true || this.passwordEmpty === true) {
      return false;
    } else {
      return true;
    }
  }
  login() {
    this.usernameEmpty = false;
    this.passwordEmpty = false;
    this.loginError = null;
    this.userInfo = null;

    if (this.validateLoginInfo() == false) {
      return;
    }

    this.userService.login(this.loginInfo).subscribe({
      next: (res) => {
        this.userInfo = res;
        if (this.userInfo) {
          sessionStorage.setItem('token', this.userInfo.token);
          sessionStorage.setItem(
            'userInfo',
            JSON.stringify(this.userInfo.userInfo)
          );
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error) => {
        this.loginError = error;
      },
    });
  }
}
