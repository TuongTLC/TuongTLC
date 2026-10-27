import { UserModel, AuthorModel, UserRegisterModel, UserLoginModel, UserLoginResModel, UserUpdateModel, UserChangePasswordModel, ChangeUserStatusModel, VerifyCodeModel } from './user-models';

describe('User Models', () => {
  it('UserModel should initialize', () => {
    const m = new UserModel();
    expect(m.id).toBe('');
    expect(m.fullname).toBe('');
  });

  it('AuthorModel should initialize', () => {
    const m = new AuthorModel();
    expect(m.id).toBe('');
  });

  it('UserRegisterModel should initialize', () => {
    const m = new UserRegisterModel();
    expect(m.username).toBe('');
    expect(m.password).toBe('');
  });

  it('UserLoginModel should initialize', () => {
    const m = new UserLoginModel();
    expect(m.username).toBe('');
  });

  it('UserLoginResModel should initialize', () => {
    const m = new UserLoginResModel();
    expect(m.token).toBe('');
    expect(m.userInfo instanceof UserModel).toBeTrue();
  });

  it('UserUpdateModel should initialize', () => {
    const m = new UserUpdateModel();
    expect(m.fullname).toBe('');
  });

  it('UserChangePasswordModel should initialize', () => {
    const m = new UserChangePasswordModel();
    expect(m.oldPassword).toBe('');
  });

  it('ChangeUserStatusModel should initialize', () => {
    const m = new ChangeUserStatusModel();
    expect(m.userId).toBe('');
    expect(m.status).toBeFalse();
  });

  it('VerifyCodeModel should initialize', () => {
    const m = new VerifyCodeModel();
    expect(m.username).toBe('');
    expect(m.code).toBe('');
  });
});
