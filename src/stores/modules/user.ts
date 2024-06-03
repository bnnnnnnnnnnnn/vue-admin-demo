// 创建用户相关的小仓库
import { defineStore } from "pinia";
import { reqLogin, reqUserInfo } from "@/api/user/index";
import type { loginForm } from "@/api/user/type";

// 创建用户小仓库
const useUserStore = defineStore("User", {
  state: () => {
    return {
      token: localStorage.getItem("TOKEN"), // 用户的唯一标识
    };
  },
  // 异步、逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      const result: any = await reqLogin(data);
      if (result.code === 200) {
        // pinia仓库存储token
        this.token = result.data.token;
        localStorage.setItem("TOKEN", result.data.token);
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
