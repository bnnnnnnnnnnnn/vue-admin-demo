export type menus = {
  id: number | null;
  name: string;
  path: string;
  redirect:string|null;
  component?: string;
  icon?: string;
  parent_id?: number | null;
  hidden: boolean;
  sort_order?: number;
  children?: menus[];
};

export interface User {
  id: string;
  email: string;
  role?: [];
  password?: string; // 存储在 user_metadata 里
}

export interface Role {
  id: number;
  name: string;
  [key: string]: any;
}



export interface MenuItem {
  id: number|null;
  name: string;
  path: string;
  redirect: string | null;
  component: string | null;
  icon: string;
  parent_id: number | null;
  hidden: boolean;
  sort_order: number;
}
