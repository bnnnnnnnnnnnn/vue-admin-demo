// 引入模板的全局样式
import "@/assets/styles/index.css";

import { createApp } from "vue";
import pinia from "./stores";
import "element-plus/dist/index.css";

// import './assets/styles/index.css';

//全局导入Element plus
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import { addDynamicRoutes } from "@/router/components/dynamicRoutes";
import { GET_TOKEN } from "@/utils/token";

const app = createApp(App);

app.use(pinia);
// app.use(router);
app.use(ElementPlus);
// 刷新持久化路由
const token = GET_TOKEN();
if (token) {
  addDynamicRoutes(router)
    .then(() => app.use(router).mount("#app"))
    .catch(() => {
      // fallback：token失效，跳转登录或提示
      app.use(router).mount("#app");
    });
} else {
  app.use(router).mount("#app");
}

// app.mount("#app");
