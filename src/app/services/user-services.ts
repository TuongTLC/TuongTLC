import {
  UserRegisterModel,
  UserLoginModel,
  UserChangePasswordModel,
} from './../models/user-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

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
    let token = sessionStorage.getItem('token');
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/change-password',
      userChangePasswordModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
}
