import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FileService } from './file-service';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('FileService', () => {
  let service: FileService;
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
        FileService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('uploadFiles should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    const fd = new FormData();
    service.uploadFiles(fd).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/file/upload-files');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t');
    req.flush([]);
  });

  it('getFiles should GET with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't2');
    service.getFiles().subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/file/get-files');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('removeFiles should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't3');
    service.removeFiles('http://x/y.jpg').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/file/delete-file?fileUrl=http://x/y.jpg');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });
});
