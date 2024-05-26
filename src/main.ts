// 引入模板的全局样式
import "@/assets/styles/index.scss";


import { createApp } from "vue";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";


//全局导入Element plus
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
