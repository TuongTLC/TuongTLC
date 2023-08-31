import { HttpClient } from '@angular/common/http';
import { userLoginModel } from '../models/user-models';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(user: userLoginModel) {
    return this.http.post('https://tuongtlc.ddns.net:8081/user/login', user);
  }
}
