import { createRouter, createWebHistory } from "vue-router";
import { constanTRouter } from "./components/routes";
import { GET_TOKEN } from "@/utils/token";
import { addDynamicRoutes } from "@/router/components/dynamicRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constanTRouter,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});
// 添加路由守卫
router.beforeEach((to, from, next) => {
  const token = GET_TOKEN(); // 获取 token
  addDynamicRoutes(router);

  if (to.name !== "login" && !token) {
    // 如果目标路由不是登录页且没有 token，重定向到登录页
    next({ name: "login" });
  } else {
    // 添加路由持久化
    next(); // 继续导航
  }
});

export default router;
