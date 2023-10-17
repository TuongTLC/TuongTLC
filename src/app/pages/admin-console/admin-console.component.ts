import { Component, OnInit } from '@angular/core';
import { ChangeUserStatusModel, UserModel } from 'src/app/models/user-models';
import { UserService } from 'src/app/services/user-services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css'],
})
export class AdminConsoleComponent implements OnInit {
  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  userInfo = new UserModel();

  ngOnInit(): void {
    this.getUsers('all');
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson !== null) {
      this.userInfo = JSON.parse(userJson);
    } else {
      this.logout();
    }
  }
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
  showIt = false;
  popupTitle = '';
  popupMessage = '';
  closeModal() {
    this.showIt = false;
  }
  activeUsers = true;
  activePosts = false;
  activeCategories = false;
  activeTags = false;
  resetActive() {
    this.activeUsers = false;
    this.activePosts = false;
    this.activeCategories = false;
    this.activeTags = false;
  }
  activateUser() {
    this.resetActive();
    this.activeUsers = true;
  }
  activatePost() {
    this.resetActive();
    this.activePosts = true;
  }
  activateCategory() {
    this.resetActive();
    this.activeCategories = true;
  }
  activateTag() {
    this.resetActive();
    this.activeTags = true;
  }
  userList: UserModel[] = [];
  getUsers(status: string) {
    this.spinner.show();
    this.userService.getUsers(status).subscribe({
      next: (res) => {
        this.userList = res;
        this.spinner.hide();
      },
      error: () => {
        this.popupTitle = 'Load users failed!';
        this.popupMessage =
          'Something went wrong while loading users, please try again later!';
        this.showIt = true;
      },
    });
  }

  changeUserStatus(userId: string, status: boolean) {
    const changeUserStatusModel = new ChangeUserStatusModel();
    changeUserStatusModel.userId = userId;
    changeUserStatusModel.status = status;
    this.userService.changeUserStatus(changeUserStatusModel).subscribe({
      next: () => {
        this.getUsers('all');
      },
      error: () => {
        this.popupTitle = 'Change user status failed!';
        this.popupMessage =
          'Something went wrong while changing user status, please try again later!';
        this.showIt = true;
      },
    });
  }
}
