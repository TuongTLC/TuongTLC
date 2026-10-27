import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserInfoPageComponent } from './user-info-page.component';

describe('UserInfoPageComponent', () => {
  let component: UserInfoPageComponent;
  let fixture: ComponentFixture<UserInfoPageComponent>;

  beforeEach(async () => {
    sessionStorage.clear();
    sessionStorage.setItem('userInfo', JSON.stringify({ fullname: 'Test', username: 'test' }));
    await TestBed.configureTestingModule({
      declarations: [UserInfoPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
