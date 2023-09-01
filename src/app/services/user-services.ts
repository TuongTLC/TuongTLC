import { userRegisterModel, userLoginModel } from './../models/user-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(userLoginModel: userLoginModel) {
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/login',
      userLoginModel
    );
  }
  register(userRegisterModel: userRegisterModel) {
    return this.http.post(
      'https://tuongtlc.ddns.net:8081/user/register',
      userRegisterModel
    );
  }
}
