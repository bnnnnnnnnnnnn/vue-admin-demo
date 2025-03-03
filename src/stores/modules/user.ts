import { defineStore } from "pinia";
import { reqLogin, reqUserInfo } from "@/api/user/index";
import { reqUserRoutes } from "@/api/routes/index"; 
import type { loginForm, loginResponseData } from "@/api/user/type";
import type { UserState } from "./types/user";
import { SET_TOKEN, GET_TOKEN } from "@/utils/token";
import router from '@/router'; // 引入 router 实例

const useUserStore = defineStore("User", {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的唯一标识
      menuRoutes: [], // 初始化菜单路由
    };
  },
  actions: {
    // 递归添加路由
    addRoutes(routes, parentRoute = null) {
      routes.forEach(route => {
        // 动态加载组件
        route.component = () => import(`@/views/${route.component}`);

        // 如果有子路由，递归添加
        if (route.children) {
          route.children.forEach(childRoute => {
            childRoute.path = `${route.path}/${childRoute.path}`;
          });
          // 递归调用，继续添加子路由
          this.addRoutes(route.children, route);
        }

        // 动态添加路由
        if (parentRoute) {
          parentRoute.children.push(route);  // 如果有父路由，添加为子路由
        } else {
          router.addRoute(route);  // 如果没有父路由，直接添加
        }
      });
    },

    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        // 登录成功，保存 token
        this.token = result.data.token as string;
        SET_TOKEN(result.data.token as string);

        // 请求动态路由
        const routesResult = await reqUserRoutes();
        if (routesResult.code === 200) {
          const dynamicRoutes = routesResult.data.checkUser; // 获取动态路由

          // 添加动态路由
          this.addRoutes(dynamicRoutes);
        }

        return "ok";
      } else {
        throw new Error(result.data.message || "登录失败");
      }
    },
  },
  getters: {},
});

export default useUserStore;
