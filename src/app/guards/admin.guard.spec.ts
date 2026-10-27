import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { Auth } from '../auth';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let auth: jasmine.SpyObj<Auth>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('Auth', ['checkToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when not authenticated', () => {
    auth.checkToken.and.returnValue(false);
    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to home when authenticated but not admin', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('userInfo', JSON.stringify({ roleName: 'User' }));
    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should allow activation for admin user', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('userInfo', JSON.stringify({ roleName: 'Admin' }));
    expect(guard.canActivate({} as any, {} as any)).toBeTrue();
  });
});
