import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-services';
import { UserModel, UserUpdateModel } from '../../models/user-models';

@Component({
    selector: 'app-user-info-page',
    templateUrl: './user-info-page.component.html',
    styleUrls: ['./user-info-page.component.css'],
    standalone: false
})
export class UserInfoPageComponent implements OnInit {
  userInfo: UserModel = new UserModel();
  username = '';
  birthdate = '24/02/1998';
  userUpdateInfo: UserUpdateModel = new UserUpdateModel();
  popupTitle = '';
  popupMessage = '';
  showIt = false;
  fullNameError = false;
  emailError = false;
  phoneError = false;
  birthDayError = false;
  tokeInvalid = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const getUserInfo = sessionStorage.getItem('userInfo');
    if (!getUserInfo) {
      this.router.navigate(['/login']);
    } else {
      this.userInfo = JSON.parse(getUserInfo);
      this.username = this.userInfo.username;
      this.birthdate = new Date(this.userInfo.birthday).toLocaleDateString();
      
    }
  }

  showModal() {
    this.showIt = true;
  }

  closeModal() {
    if (this.tokeInvalid) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      this.router.navigate(['/login']);
    } else {
      this.showIt = false;
      window.location.reload();
    }
  }

  validate() {
    this.userInfo.birthday = new Date(this.birthdate);
    this.userUpdateInfo.birthday = this.userInfo.birthday;

    if (this.userInfo.fullname !== this.userUpdateInfo.fullname) {
      this.userUpdateInfo.fullname = this.userInfo.fullname;
    }
    if (this.userInfo.email !== this.userUpdateInfo.email) {
      this.userUpdateInfo.email = this.userInfo.email;
    }
    if (this.userInfo.phone !== this.userUpdateInfo.phone) {
      this.userUpdateInfo.phone = this.userInfo.phone;
    }

    this.fullNameError = false;
    this.emailError = false;
    this.phoneError = false;
    this.birthDayError = false;
    let validateFailed = false;

    if (this.userUpdateInfo.fullname.length <= 5) {
      this.fullNameError = true;
    }

    const emailRegex = new RegExp(
      "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    );
    if (!emailRegex.test(this.userUpdateInfo.email)) {
      this.emailError = true;
      validateFailed = true;
    }
    if (this.userUpdateInfo.phone.length < 10) {
      this.phoneError = true;
      validateFailed = true;
    }
    const timeDiff = Math.abs(
      Date.now() - new Date(this.userUpdateInfo.birthday).getTime()
    );
    if (Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) < 7) {
      this.birthDayError = true;
      validateFailed = true;
    }
    return validateFailed;
  }

  updateUserInfo() {
    if (!this.validate()) {
      this.userService.updateUserInfo(this.userUpdateInfo).subscribe({
        next: (res) => {
          this.userInfo = res;
          this.popupTitle = 'Success.';
          this.popupMessage = 'User information updated successful!';
          sessionStorage.removeItem('userInfo');
          sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          this.showModal();
        },
        error: (error) => {
          this.tokeInvalid = false;
          if (error.status == 401) {
            this.popupTitle = 'Failed.';
            this.popupMessage = 'Token invalid, please sign in again!';
            this.tokeInvalid = true;
            this.showModal();
          } else {
            this.popupTitle = 'Failed.';
            this.popupMessage = 'User information updated failed!';
            this.showModal();
          }
        },
      });
    }
  }
}
