import { Observable } from 'rxjs';
import {
  UserRegisterModel,
  UserLoginModel,
  UserChangePasswordModel,
  UserUpdateModel,
  UserModel,
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

  login(userLoginModel: UserLoginModel) {
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/login',
      userLoginModel
    );
  }
  register(userRegisterModel: UserRegisterModel) {
    return this.http.post(
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
}
