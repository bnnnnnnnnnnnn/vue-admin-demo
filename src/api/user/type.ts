// 登录接口需要携带参数ts类型
export interface loginForm {
  email: string;
  password: string;
}
interface dataType {
  token?: string;
  message?: string;
}

// 登录接口返回数据类型
export interface loginResponseData {
  token: string;
  user: any;
}

interface userInfo {
  userId: number;
  avatar: string;
  username: string;
  password: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token: string;
}
interface user {
  checkUser: userInfo;
}
// 服务器返回用户信息相关的数据类型
export interface userResponseData {
  code: number;
  data: user;
}
