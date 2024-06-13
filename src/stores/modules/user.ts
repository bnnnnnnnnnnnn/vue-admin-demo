// 创建用户相关的小仓库
import { defineStore } from "pinia";
import { reqLogin, reqUserInfo } from "@/api/user/index";
import type { loginForm, loginResponseData } from "@/api/user/type";
import type { UserState } from "./types/user";
//引入本地储存的工具方法
import { SET_TOKEN, GET_TOKEN } from "@/utils/token";
import {constanTRouter} from '@/router/routes' // 仓库储存生成菜单需要的数组
// 创建用户小仓库
const useUserStore = defineStore("User", {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的唯一标识
      menuRoutes:constanTRouter,// 常量路由
    };
  },
  // 异步、逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        // pinia仓库存储token
        this.token = result.data.token as string;
        // localStorage.setItem("TOKEN",(result.data.token as string));
        SET_TOKEN(result.data.token as string);
        return "ok";
      } else {
        throw new Error(result.data.message || "登录失败");
      }
    },
  },
  //
  getters: {},
});
// 对外暴露获取小仓库方法
export default useUserStore;
