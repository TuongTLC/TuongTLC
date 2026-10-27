import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClipboardService } from 'ngx-clipboard';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { EditPostPageComponent } from './edit-post-page.component';

describe('EditPostPageComponent', () => {
  let component: EditPostPageComponent;
  let fixture: ComponentFixture<EditPostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPostPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { queryParams: of({ postId: 'p1' }) } },
        { provide: NgxSpinnerService, useValue: { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') } },
        { provide: ClipboardService, useValue: { copyFromContent: jasmine.createSpy('copy') } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy('detectChanges') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closeModal should navigate if updated', () => {
    component.updated = true;
    const router = TestBed.inject(Router);
    component.closeModal();
    expect(router.navigate).toHaveBeenCalledWith(['/list-view']);
  });
});
