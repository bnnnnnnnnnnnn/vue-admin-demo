export interface MenuBase {
  id?: number | null
  type: number
  name: string
  path: string
  redirect: string | null
  component?: string | null
  icon?: string
  parent_id?: number | null
  hidden: boolean
  sort_order?: number
  children?: menus[]
};

export interface menus extends MenuBase {
  children?: menus[]
}

export interface MenuItem extends MenuBase {
  component: string | null
  icon: string
  parent_id: number | null
  sort_order: number
}

export interface User {
  id?: string
  email?: string
  phone?: string
  role?: []
  password?: string
  description?: string // 用户详情
}

export interface Role {
  id: number
  name: string
  [key: string]: any
}
