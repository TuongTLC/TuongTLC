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
  loginError: any;
  constructor(private userService: UserService) {}
  login() {
    this.loginError = null;
    this.userInfo = null ;
    this.userService.login(this.loginInfo).subscribe({
      next : (res) => {
        this.userInfo = res
      }, error: (error) =>{
        this.loginError = error.error;
      }
    })
  }
}
