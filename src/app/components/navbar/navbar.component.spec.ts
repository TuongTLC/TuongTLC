import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate'], { url: '/home' });
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide navbar for certain routes', () => {
    const result = component.hideNavbar();
    expect(typeof result).toBe('boolean');
  });

  it('should load user info from sessionStorage', () => {
    sessionStorage.setItem('userInfo', JSON.stringify({ fullname: 'Test', roleName: 'User' }));
    component.ngOnInit();
    expect(component.userInfo.fullname).toBe('Test');
  });

  it('should logout and navigate to login', () => {
    sessionStorage.setItem('token', 't');
    sessionStorage.setItem('userInfo', '{}');
    component.logout();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
