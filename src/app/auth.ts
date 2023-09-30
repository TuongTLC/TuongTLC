import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  token = '';
  checkToken() {
    let valid = false;
    try {
      this.token = sessionStorage.getItem('token') ?? '';
      if (this.token.length < 1) {
        return valid;
      }
      const decodedToken = jwt_decode<JwtPayload>(this.token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp != undefined && decodedToken.exp > currentTimestamp) {
        valid = true;
      }
      return valid;
    } catch {
      return valid;
    }
  }
}
