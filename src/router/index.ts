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
// 优化后的路由守卫
let isDynamicRoutesAdded = false; // 标记是否已添加动态路由，避免重复添加

router.beforeEach(async (to, from, next) => {
  const token = GET_TOKEN(); // 获取本地存储的 token

  // 如果未登录且目标不是登录页，跳转登录
  if (!token && to.name !== "login") {
    return next({ name: "login" });
  }

  // 如果已登录，且动态路由还未添加，添加动态路由
  if (token && !isDynamicRoutesAdded) {
    try {
      await addDynamicRoutes(router); // 如果 addDynamicRoutes 是异步的
      isDynamicRoutesAdded = true; // 设置标记，避免重复添加
      return next({ ...to, replace: true }); // 替换导航，确保路由更新
    } catch (error) {
      console.error("动态路由添加失败：", error);
      return next(false); // 停止导航
    }
  }

  next(); // 继续导航
});

export default router;
