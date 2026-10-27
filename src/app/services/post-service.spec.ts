import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PostService } from './post-service';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('PostService', () => {
  let service: PostService;
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
        PostService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createPost should navigate if not authenticated and return undefined', () => {
    auth.checkToken.and.returnValue(false);
    const res = service.createPost({} as any);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(res).toBeUndefined();
  });

  it('createPost should POST with auth if authenticated', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    const obs = service.createPost({ postName: 'test' } as any);
    expect(obs).toBeDefined();
    obs!.subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/create-post');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t');
    req.flush('ok');
  });

  it('updatePost should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.updatePost({ id: '1' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/update-post');
    expect(req.request.method).toBe('POST');
    req.flush({ postInfo: {} });
  });

  it('getPosts should GET with query params', () => {
    service.getPosts(1, 10, 'active', undefined, undefined, undefined).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/get-posts?pageNumber=1&pageSize=10&status=active&adminStatus=undefined&categoryId=undefined&tagId=undefined');
    expect(req.request.method).toBe('GET');
    req.flush({ paging: {}, listPosts: [] });
  });

  it('getPost should GET by postId', () => {
    service.getPost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/get-post?postId=p1');
    expect(req.request.method).toBe('GET');
    req.flush({ postInfo: {}, postCategories: [], postTags: [] });
  });

  it('searchPosts should GET', () => {
    service.searchPosts(1, 5, 'test').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/search-post?pageNumber=1&pageSize=5&postName=test&status=undefined&categoryId=undefined&tagId=undefined');
    expect(req.request.method).toBe('GET');
    req.flush({ paging: {}, listPosts: [] });
  });

  it('getRelatedPosts should GET', () => {
    service.getRelatedPosts('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/get-related-posts?postId=p1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('likePost should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.likePost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/like-post?postId=p1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('dislikePost should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.dislikePost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/dislike-post?postId=p1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('getUserPosts should GET with auth', () => {
    sessionStorage.setItem('token', 't');
    service.getUserPosts(1, 10).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/get-user-posts?pageNumber=1&pageSize=10');
    expect(req.request.method).toBe('GET');
    req.flush({ paging: {}, listPosts: [] });
  });

  it('changePostStatus should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.changePostStatus({ postId: 'p1', status: 'approved' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/change-post-status');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('banPost should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.banPost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/ban-post?postId=p1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('unbanPost should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.unbanPost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/unban-post?postId=p1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('approvePost should POST with auth', () => {
    sessionStorage.setItem('token', 't');
    service.approvePost('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post/approve-post?postId=p1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });
});
