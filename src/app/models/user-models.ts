export class UserLoginModel {
  username = '';
  password = '';
}
export class UserRegisterModel {
  username = '';
  password = '';
  email = '';
  fullname = '';
  phone = '';
  birthdate = '';
}
export class UserChangePasswordModel {
  username = '';
  oldPassword = '';
  newPassword = '';
}
export class UserUpdateModel {
  fullname = '';
  email = '';
  phone = '';
  birthday = new Date();
}
export class UserModel {
  birthday = new Date();
  email = '';
  fullname = '';
  id = '';
  phone = '';
  roleName = '';
  status = false;
  username = '';
}
