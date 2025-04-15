export type menus = {
  id: number | null;
  name: string;
  path: string;
  redirect: string | null;
  component?: string;
  icon?: string;
  parent_id?: number | null;
  hidden: boolean;
  sort_order?: number;
  children?: menus[];
};

export interface User {
  id?: string;
  email?: string;
  phone?: string;
  role?: [];
  password?: string; 
  description?: string; // 用户详情
}

export interface Role {
  id: number;
  name: string;
  [key: string]: any;
}

export interface MenuItem {
  id: number | null;
  name: string;
  path: string;
  redirect: string | null;
  component: string | null;
  icon: string;
  parent_id: number | null;
  hidden: boolean;
  sort_order: number;
}
