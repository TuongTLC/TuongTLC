import { Observable } from 'rxjs';
import {
  UserRegisterModel,
  UserLoginModel,
  UserChangePasswordModel,
  UserUpdateModel,
  UserModel,
  UserLoginResModel,
  ChangeUserStatusModel,
} from './../models/user-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  login(userLoginModel: UserLoginModel): Observable<UserLoginResModel> {
    return this.http.post<UserLoginResModel>(
      'https://tuongtlc.ddns.net:8081/user/login',
      userLoginModel
    );
  }
  register(userRegisterModel: UserRegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(
      'https://tuongtlc.ddns.net:8081/user/register',
      userRegisterModel
    );
  }
  changePassword(userChangePasswordModel: UserChangePasswordModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/change-password',
      userChangePasswordModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  updateUserInfo(newUserInfo: UserUpdateModel): Observable<UserModel> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post<UserModel>(
      'https://tuongtlc.ddns.net:8081/user/update',
      newUserInfo,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  getUsers(status: string): Observable<UserModel[]> {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.get<UserModel[]>(
      'https://tuongtlc.ddns.net:8081/user/get-users?status=' + status,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  changeUserStatus(changeUserStatusModel: ChangeUserStatusModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/change-account-status',
      changeUserStatusModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
