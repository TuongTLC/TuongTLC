import { UserService } from '../../services/user-services';
import { Component } from '@angular/core';
import { UserModel, UserRegisterModel } from '../../models/user-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  registerInfo: UserRegisterModel = {
    username: '',
    password: '',
    email: '',
    fullname: '',
    phone: '',
    birthdate: '',
  };
  userInfo: UserModel = new UserModel();
  registerError = '';
  popupTitle = '';
  popupMessage = '';
  validateUsernameError = false;
  validatePasswordError = false;
  validateConfirmPasswordError = false;
  confirmPassword = '';
  validateEmailError = false;
  validateFullnameError = false;
  validatePhoneError = false;
  validateBirthdateError = false;
  showIt = false;

  constructor(private userService: UserService, private router: Router) {}

  validateRegister() {
    this.validateUsernameError = false;
    this.validatePasswordError = false;
    this.validateConfirmPasswordError = false;
    this.validateEmailError = false;
    this.validateFullnameError = false;
    this.validatePhoneError = false;
    this.validateBirthdateError = false;

    let validateFailed = false;

    if (this.registerInfo.username.length <= 6) {
      this.validateUsernameError = true;
      validateFailed = true;
    }
    const passwordRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    );
    if (!passwordRegex.test(this.registerInfo.password)) {
      this.validatePasswordError = true;
      validateFailed = true;
    }
    if (this.registerInfo.password !== this.confirmPassword) {
      this.validateConfirmPasswordError = true;
      validateFailed = true;
    }
    const emailRegex = new RegExp(
      "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    );
    if (!emailRegex.test(this.registerInfo.email)) {
      this.validateEmailError = true;
      validateFailed = true;
    }
    if (this.registerInfo.fullname.length <= 5) {
      this.validateFullnameError = true;
      validateFailed = true;
    }
    if (this.registerInfo.phone.length < 10) {
      this.validatePhoneError = true;
      validateFailed = true;
    }
    const timeDiff = Math.abs(
      Date.now() - new Date(this.registerInfo.birthdate).getTime()
    );
    if (
      Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) < 7 ||
      this.registerInfo.birthdate === ''
    ) {
      this.validateBirthdateError = true;
      validateFailed = true;
    }
    return validateFailed;
  }
  verify = false;
  register() {
    if (!this.validateRegister()) {
      this.userInfo = new UserModel();
      this.registerError = '';
      this.userService.register(this.registerInfo).subscribe({
        next: (res) => {
          this.userInfo = res;
          if (this.userInfo) {
            this.verify = true;
          }
        },
        error: (error) => {
          this.registerError = error.error;
          this.popupTitle = 'Error!';
          this.popupMessage = this.registerError;
          this.showModal();
        },
      });
    }
  }

  showModal() {
    this.showIt = true;
  }

  closeModal() {
    this.showIt = false;
    if (this.registerError === null) {
      this.router.navigate(['/login']);
    }
  }
  closePopup() {
    this.verify = false;
  }
}
