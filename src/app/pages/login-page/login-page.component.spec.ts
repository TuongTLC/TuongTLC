import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validateLoginInfo should return false for empty fields', () => {
    component.loginInfo = { username: '', password: '' };
    expect(component.validateLoginInfo()).toBeFalse();
    expect(component.usernameEmpty).toBeTrue();
    expect(component.passwordEmpty).toBeTrue();
  });

  it('validateLoginInfo should return true for valid fields', () => {
    component.loginInfo = { username: 'user', password: 'pass' };
    expect(component.validateLoginInfo()).toBeTrue();
  });

  it('login should reset errors and validate', () => {
    component.loginInfo = { username: '', password: '' };
    component.login();
    expect(component.usernameEmpty).toBeTrue();
  });

  it('closePopup should set verify to false', () => {
    component.verify = true;
    component.closePopup();
    expect(component.verify).toBeFalse();
  });
});
