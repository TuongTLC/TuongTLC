import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from './user-services';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let auth: jasmine.SpyObj<Auth>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('Auth', ['checkToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    sessionStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST', () => {
    service.login({ username: 'u', password: 'p' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'x', userInfo: {} });
  });

  it('register should POST', () => {
    service.register({} as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('changePassword should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.changePassword({} as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/change-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t');
    req.flush('ok');
  });

  it('updateUserInfo should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.updateUserInfo({} as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/update');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getUsers should GET with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.getUsers('active').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/get-users?status=active');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('changeUserStatus should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.changeUserStatus({} as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/change-account-status');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('verifyCode should POST', () => {
    service.verifyCode({} as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/verify-user');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('sentNewOtpCode should POST JSON', () => {
    service.sentNewOtpCode('user1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/user/sent-new-otp-code');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });
});
