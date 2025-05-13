interface RouteMeta {
  title: string
  icon: string
  roles?: string[] // 可选的权限控制，例如 ['admin', 'user']
}
interface RouteData {
  checkUser: RouteItem[]
}

// 定义单个路由项
interface RouteItem {
  path: string
  name: string
  component: string
  meta: RouteMeta
  children?: RouteItem[] // 可选的子路由
}

export interface RouteList {
  code: number
  data: RouteData
}
