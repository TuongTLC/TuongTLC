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
  constructor(private userService: UserService, private router: Router) {}
  login() {
    this.loginError = null;
    this.userInfo = null ;
    this.userService.login(this.loginInfo).subscribe({
      next : res => {
        this.userInfo = res;
        if(this.userInfo){
          this.router.navigate(['/home']);
        }
      }, error: (error) =>{
        this.loginError = error;
      }
    })
    
  }
}
