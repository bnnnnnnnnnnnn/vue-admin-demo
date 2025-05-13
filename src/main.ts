import { addDynamicRoutes } from '@/router/components/dynamicRoutes'

// import './assets/styles/index.css';

import { usePermissionStore } from '@/stores/user/permissionStore'
import { GET_TOKEN } from '@/utils/token'
// 全局导入Element plus
import ElementPlus from 'element-plus'
// 全局导入Element plus
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
// app.use(router);
app.use(ElementPlus)
// 刷新持久化路由
const token = GET_TOKEN()
const permissionStore = usePermissionStore()
permissionStore.loadPermissionsFromStorage()
if (token) {
  addDynamicRoutes(router)
    .then(() => app.use(router).mount('#app'))
    .catch(() => {
      // fallback：token失效，跳转登录或提示
      app.use(router).mount('#app')
    })
}
else {
  app.use(router).mount('#app')
}

// app.mount("#app");
