import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClipboardService } from 'ngx-clipboard';
import { CreatePageComponent } from './create-page.component';

describe('CreatePageComponent', () => {
  let component: CreatePageComponent;
  let fixture: ComponentFixture<CreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: NgxSpinnerService, useValue: { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') } },
        { provide: ClipboardService, useValue: { copyFromContent: jasmine.createSpy('copy') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validatePost should detect errors', () => {
    component.postModel.postName = 'abc';
    component.postModel.summary = 'abc';
    component.postModel.thumbnail = 'abc';
    component.selectedCategories = [];
    component.selectedTags = [];
    const result = component.validatePost();
    expect(result).toBeTrue();
    expect(component.showIt).toBeTrue();
  });

  it('closeModal should hide modal and scroll', () => {
    component.showIt = true;
    component.closeModal();
    expect(component.showIt).toBeFalse();
  });

  it('resetPostModel should clear model', () => {
    component.postModel.postName = 'test';
    component.resetPostModel();
    expect(component.postModel.postName).toBe('');
  });
});
