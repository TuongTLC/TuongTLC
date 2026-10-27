import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '../auth';
import { UserModel } from '../models/user-models';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (!this.auth.checkToken()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    const userJson = sessionStorage.getItem('userInfo');
    if (userJson) {
      const userInfo: UserModel = JSON.parse(userJson);
      if (userInfo.roleName === 'Admin') {
        return true;
      }
    }
    
    this.router.navigate(['/home']);
    return false;
  }
}
