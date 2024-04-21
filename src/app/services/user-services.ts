import { Observable } from 'rxjs';
import {
  UserRegisterModel,
  UserLoginModel,
  UserChangePasswordModel,
  UserUpdateModel,
  UserModel,
  UserLoginResModel,
  ChangeUserStatusModel,
  VerifyCodeModel,
} from './../models/user-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { environment } from 'src/ext';
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
      environment.BASE_URL + '/user/login',
      userLoginModel
    );
  }
  register(userRegisterModel: UserRegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(
      environment.BASE_URL + '/user/register',
      userRegisterModel
    );
  }
  changePassword(userChangePasswordModel: UserChangePasswordModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      environment.BASE_URL + '/user/change-password',
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
      environment.BASE_URL + '/user/update',
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
      environment.BASE_URL + '/user/get-users?status=' + status,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
  changeUserStatus(changeUserStatusModel: ChangeUserStatusModel) {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
    }
    const token = sessionStorage.getItem('token');
    return this.http.post(
      environment.BASE_URL + '/user/change-account-status',
      changeUserStatusModel,
      { headers: { Authorization: 'Bearer ' + token }, responseType: 'text' }
    );
  }
  verifyCode(verifyModel: VerifyCodeModel) {
    return this.http.post(
      environment.BASE_URL + '/user/verify-user',
      verifyModel,
      { responseType: 'text' }
    );
  }
  sentNewOtpCode(username: string) {
    return this.http.post(
      environment.BASE_URL + '/user/sent-new-otp-code',
      JSON.stringify(username),
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }
}
