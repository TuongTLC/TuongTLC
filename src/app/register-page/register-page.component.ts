import { UserService } from './../services/user-services';
import { Component, ViewChild } from '@angular/core';
import { userRegisterModel } from '../models/user-models';
import { Router } from '@angular/router';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';

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
  popupTitle = '';
  popupMessage = '';
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
