import { UserService } from '../../services/user-services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserChangePasswordModel, UserModel } from '../../models/user-models';

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.css'],
})
export class PasswordPageComponent implements OnInit {
  changePassModel: UserChangePasswordModel = {
    username: '',
    oldPassword: '',
    newPassword: '',
  };
  userInfo: UserModel = new UserModel();
  newPassConfirm = '';
  oldPassError = false;
  newPassError = false;
  newPassConfirmError = false;
  popupTitle = '';
  popupMessage = '';
  showIt = false;
  changeSuccess = false;

  constructor(private router: Router, private userService: UserService) {}

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
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') ?? '');
    if (!this.userInfo) {
      this.router.navigate(['/login']);
    }
    this.changePassModel.username = this.userInfo.username;
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
        next: () => {
          this.popupTitle = 'Success.';
          this.popupMessage =
            'Your password has been change, please login again.';
          this.showModal();
          this.changeSuccess = true;
        },
        error: () => {
          this.popupTitle = 'Failed.';
          this.popupMessage = 'Old password is incorrect, please try again.';
          this.showModal();
        },
      });
    }
  }
}
