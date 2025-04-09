// 登录接口需要携带参数ts类型
export interface loginFormEmail {
  email: string;
  password: string;
}
export interface loginFormPhone {
  phone: string;
  password: string;
}

export interface MenuItem {
  id: number;
  name: string;
  path: string;
  redirect: string | null;
  component: string | null;
  icon: string;
  parent_id: number | null;
  hidden: boolean;
  sort_order: number;
}