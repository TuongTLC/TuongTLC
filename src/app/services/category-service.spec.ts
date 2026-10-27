import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CategoryService } from './category-service';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('CategoryService', () => {
  let service: CategoryService;
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
        CategoryService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCategories should GET categories by status', () => {
    service.getCategories('active').subscribe((res) => {
      expect(res.length).toBe(1);
    });
    const req = httpMock.expectOne(environment.BASE_URL + '/category/get-categories?status=active');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', categoryName: 'Test' }]);
  });

  it('createCategory should POST with auth header when token valid', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 'tok');
    service.createCategory({ categoryName: 'x', description: 'y' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/category/create-category');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    req.flush({ id: '1' });
  });

  it('createCategory should navigate to login if not authenticated', () => {
    auth.checkToken.and.returnValue(false);
    service.createCategory({} as any).subscribe();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    httpMock.expectNone(environment.BASE_URL + '/category/create-category');
  });

  it('updateCategory should POST with auth header', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't2');
    service.updateCategory({ id: '1', categoryName: 'x' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/category/update-category');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t2');
    req.flush({ id: '1' });
  });

  it('updateCategoryStatus should POST with auth header', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't3');
    service.updateCategoryStatus('1', true).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/category/change-category-status?categoryId=1&status=true');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t3');
    req.flush('ok');
  });
});
