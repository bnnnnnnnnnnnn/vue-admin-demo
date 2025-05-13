import { useMenuStore } from "@/stores/user/menuRoutesStore";
import HomeView from "@/layout/index.vue";
import type { menus } from "@/api/system/type";

// 3. 递归构建路由
function buildRoutes(routeList: any) {
  // 1. 动态引入所有视图组件
  const modules = import.meta.glob("@/views/**/*.vue");
  // console.log(modules,routeList);
  return routeList.map((route: Partial<menus>) => {
    const { path, name, redirect, component, children } = route;
    const routeObj = {
      path,
      name,
      redirect,
      component: component ?modules[`/src/views${component}`] : undefined,
      children: children && children.length ? buildRoutes(children) : [],
    };
    return routeObj;
  });
}

// 4. 添加动态路由
export const addDynamicRoutes = async ($router: any) => {
  try {
    const routesList = JSON.parse(localStorage.getItem("routesList") || "[]");
    const routes = buildRoutes(routesList);
    // console.log("routes", routes);
    
    if (routes.length) {
      $router.addRoute({
        path: "/",
        component: HomeView, // 父布局组件
        children: routes, // 将动态路由添加到 children 中
      });
    }
  } catch (err) {
    console.log(err);
  }
};
