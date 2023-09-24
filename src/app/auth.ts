import jwt_decode from 'jwt-decode';
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
      const decodedToken: any = jwt_decode(this.token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp > currentTimestamp) {
        valid = true;
      }
      return valid;
    } catch {
      return valid;
    }
  }
}
