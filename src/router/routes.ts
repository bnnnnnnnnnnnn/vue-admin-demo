// 对外暴露配置路由 常量路由
import HomeView from "@/layout/index.vue";
export const constanTRouter = [
  {
    path: "/",
    name: "home", // 命名路由
    component: HomeView,
  },
  {
    path: "/login",
    name: "login", // 命名路由
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/404",
    name: "404", // 命名路由
    component: () => import("../views/404/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "any",
  },
];
