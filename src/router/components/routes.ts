// 对外暴露配置路由 常量路由
import HomeView from "@/layout/index.vue";

export const constanTRouter = [
  // {
    // path: "/",
    // component: HomeView,
    // children: [
      // {
      //   path: '/',
      //   component: () => import('@/views/home/index.vue'),
      // },
      // {
      //   path: 'set',
      //   name: "Settings",
      //   redirect: "/set/menu", // 默认跳转到菜单管理,
      //   children: [
      //     {
      //       path: 'menu',
      //       name: "MenuManagement",
      //       component: () => import("@/views/system/menuManagement/index.vue"),
      //     },
      //     {
      //       path: 'role',
      //       name: "RoleManagement",
      //       component: () => import("@/views/system/roleManagement/index.vue"),
      //     },
      //     {
      //       path: 'user',
      //       name: "userManagement",
      //       component: () => import("@/views/system/userManagement/index.vue"),
      //     }
      //   ],
      // },
  //   ],
  // },
  {
    path: "/login",
    name: "login", // 命名路由
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/404",
    name: "404", // 命名路由
    component: () => import("@/views/404/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "any",
  },
];
