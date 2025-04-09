import { useMenuStore } from "@/stores/user/menuRoutesStore";
import type { menus } from "@/api/system/type";

// 3. 递归构建路由
function buildRoutes(routeList: any) {
  // 1. 动态引入所有视图组件
  const modules = import.meta.glob("@/views/**/*.vue");
  return routeList.map((route: Partial<menus>) => {
    const { path, name, redirect, component, children } = route;
    const routeObj = {
      path,
      name,
      redirect,
      component: component ? modules[`/src/views${component}`] : undefined,
      children: children && children.length ? buildRoutes(children) : [],
    };
    return routeObj;
  });
}

// 4. 添加动态路由
export const addDynamicRoutes = () => {
  const menuStore = useMenuStore(); // 确保在函数内部调用

  return buildRoutes(menuStore.routesList);
};
