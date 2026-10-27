import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TagService } from './tag-service';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('TagService', () => {
  let service: TagService;
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
        TagService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(TagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTags should GET tags', () => {
    service.getTags('active').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/tag/get-tags?status=active');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('createTag should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 'x');
    service.createTag({ tagName: 't' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/tag/create-tag');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('updateTag should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 'x');
    service.updateTag({ id: '1' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/tag/update-tag');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('updateTagStatus should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 'x');
    service.updateTagStatus('1', true).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/tag/change-tag-status?tagId=1&status=true');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });
});
