import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PasswordPageComponent } from './password-page.component';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;

  beforeEach(async () => {
    sessionStorage.clear();
    sessionStorage.setItem('userInfo', JSON.stringify({ username: 'test' }));
    await TestBed.configureTestingModule({
      declarations: [PasswordPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
