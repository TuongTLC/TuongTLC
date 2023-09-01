import { UserService } from './../services/user-services';
import { Component } from '@angular/core';
import { userRegisterModel } from '../models/user-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  constructor(private userService: UserService, private router: Router) {}
  registerInfo: userRegisterModel = {
    username: '',
    password: '',
    email: '',
    fullname: '',
    birthday: undefined,
    phone: '',
  };
  userInfo: any;
  registerError: any;
  register() {
    this.userService.register(this.registerInfo).subscribe({
      next: (res) => {
        this.userInfo = res;
        if (this.userInfo) {
          console.log(JSON.stringify(this.userInfo));
        }
      },
      error: (error) => {
        this.registerError = error;
        console.log(this.registerError);
      },
    });
  }
}
