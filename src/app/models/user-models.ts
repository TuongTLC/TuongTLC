export class UserLoginModel {
  username?: string;
  password?: string;
}
export class UserRegisterModel {
  username!: string;
  password!: string;
  email!: string;
  fullname!: string;
  phone!: string;
  birthdate!: any;
}
export class UserChangePasswordModel{
 username!: string;
 oldPassword!: string;
 newPassword!: string;
}
