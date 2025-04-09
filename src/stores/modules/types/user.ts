import type { RouteRecordRaw } from "vue-router";

// 定义小仓库数据state类型

export interface UserState {
  token: string | null;
  roleIds: number[] | null;
  user: object | null;
  menus:any[]| null;
}
