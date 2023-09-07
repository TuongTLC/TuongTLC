import { UserService } from './../services/user-services';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UserChangePasswordModel } from '../models/user-models';

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.css'],
})
export class PasswordPageComponent {
  constructor(private router: Router, private userService: UserService) {}

  changePassModel: UserChangePasswordModel = {
    username: '',
    oldPassword: '',
    newPassword: '',
  };

  userInfo: any;

  newPassConfirm = '';

  oldPassError = false;
  newPassError = false;
  newPassConfirmError = false;

  popupTitle = '';
  popupMessage = '';
  showIt = false;
  changeSuccess = false;
  showModal() {
    this.showIt = true;
  }
  closeModal() {
    this.showIt = false;
    if (this.changeSuccess) {
      this.logout();
    }
  }

  ngOnInit() {
    this.userInfo = sessionStorage.getItem('userInfo');
    if (!this.userInfo) {
      this.router.navigate(['/login']);
    }
    this.changePassModel.username = JSON.parse(this.userInfo).username;
  }
  validateInfomation() {
    this.oldPassError = false;
    this.newPassError = false;
    this.newPassConfirmError = false;
    let error = false;
    if (this.changePassModel.oldPassword.length <= 0) {
      this.oldPassError = true;
      error = true;
    }
    if (this.changePassModel.newPassword.length <= 0) {
      this.newPassError = true;
      error = true;
    }
    if (this.changePassModel.newPassword !== this.newPassConfirm) {
      this.newPassConfirmError = true;
      error = true;
    }
    return error;
  }
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
  changePassword() {
    if (!this.validateInfomation()) {
      this.userService.changePassword(this.changePassModel).subscribe({
        next: (res) => {
          this.popupTitle = 'Success.';
          this.popupMessage =
            'Your password has been change, please login again.';
          this.showModal();
          this.changeSuccess = true;
        },
        error: (error) => {
          this.popupTitle = 'Failed.';
          this.popupMessage = 'Old password is incorrect, please try again.';
          this.showModal();
        },
      });
    }
  }
}
