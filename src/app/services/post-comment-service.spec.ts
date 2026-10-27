import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PostCommentService } from './post-comment-service';
import { Auth } from '../auth';
import { environment } from 'src/ext';

describe('PostCommentService', () => {
  let service: PostCommentService;
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
        PostCommentService,
        { provide: Auth, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(PostCommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPostComments should GET', () => {
    service.getPostComments('p1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post-comment/get-post-comments?postId=p1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('insertPostComment should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.insertPostComment({ PostId: 'p1', CommentContent: 'hi' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post-comment/insert-comment');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer t');
    req.flush({});
  });

  it('updatePostComment should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.updatePostComment({ CommentId: 'c1', Content: 'x' } as any).subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post-comment/update-comment');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('likePostComment should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.likePostComment('c1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post-comment/like-comment?commentId=c1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('dislikePostComment should POST with auth', () => {
    auth.checkToken.and.returnValue(true);
    sessionStorage.setItem('token', 't');
    service.dislikePostComment('c1').subscribe();
    const req = httpMock.expectOne(environment.BASE_URL + '/post-comment/dislike-comment?commentId=c1');
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });
});
