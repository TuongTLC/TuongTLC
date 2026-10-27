import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    service = new Auth();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false if no token', () => {
    expect(service.checkToken()).toBeFalse();
  });

  it('should return false for invalid token', () => {
    sessionStorage.setItem('token', 'invalid.token.here');
    expect(service.checkToken()).toBeFalse();
  });
});
