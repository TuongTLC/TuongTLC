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
    phone: '',
    birthdate: new Date(),
  };

  userInfo: any;

  registerError: any;

  popupTitle = '';
  popupMessage = '';

  validateUsernameError = false;
  validatePasswordError = false;
  validateEmailError = false;
  validateFullnameError = false;
  validatePhoneError = false;
  validateBirthdateError = false;

  validateRegister() {
    this.validateUsernameError = false;
    this.validatePasswordError = false;
    this.validateEmailError = false;
    this.validateFullnameError = false;
    this.validatePhoneError = false;
    this.validatePhoneError = false;

    if (this.registerInfo.username.length <= 6) {
      this.validateUsernameError = true;
    }
    let passwordRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    );
    if (!passwordRegex.test(this.registerInfo.password)) {
      this.validatePasswordError = true;
    }
    let emailRegex = new RegExp(
      "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    );
    if (!emailRegex.test(this.registerInfo.email)) {
      this.validateEmailError = true;
    }
    if (this.registerInfo.fullname.length <= 5) {
      this.validateFullnameError = true;
    }
    if (this.registerInfo.phone.length <= 10) {
      this.validatePhoneError = true;
    }
    var timeDiff = Math.abs(
      Date.now() - new Date(this.registerInfo.birthdate).getTime()
    );
    if (Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) < 7) {
      this.validateBirthdateError = true;
    }
    console.log(this.registerInfo);
    console.log('username: ' + this.validateUsernameError);
    console.log('password: ' + this.validatePasswordError);
    console.log('email: ' + this.validateEmailError);
    console.log('fullname: ' + this.validateFullnameError);
    console.log('phone: ' + this.validatePhoneError);
    console.log('birthdate: ' + this.validateBirthdateError);
  }
  register() {
    this.userInfo = null;
    this.registerError = null;
    this.userService.register(this.registerInfo).subscribe({
      next: (res) => {
        this.userInfo = res;
        if (this.userInfo) {
          console.log(JSON.stringify(this.userInfo));
          this.popupTitle = 'Congratulations!';
          this.popupMessage =
            'Your account has been created. You can now login and enjoy.';
          this.showModal();
        }
      },
      error: (error) => {
        this.registerError = error;
        console.log(this.registerError);
        this.popupTitle = 'Error!';
        this.popupMessage = this.registerError.error;
        this.showModal();
      },
    });
  }

  showIt = false;

  showModal() {
    this.showIt = true;
  }
  closeModal() {
    this.showIt = false;
    if (this.registerError === null) {
      this.router.navigate(['/login']);
    }
  }
}
