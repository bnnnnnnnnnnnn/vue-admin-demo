// 此函数执行会返回一个路由数组 
function createUserRoutes() {
    return [
        {
            path: "/",
            name: "Home",
            component: "home/index.vue",  // 不加开头的 /
            meta: {
                title: "首页",
                icon: "home"
            }
        },
        {
            path: "/set",
            name: "Settings",
            component: "system/settings/index.vue",
            meta: {
                title: "设置",
                icon: "settings"
            },
            children: [
                {
                    path: "menu",
                    name: "MenuManagement",
                    component: "system/menuManagement/index.vue",
                    meta: {
                        title: "菜单管理",
                        icon: "menu"
                    }
                },
                {
                    path: "role",
                    name: "RoleManagement",
                    component: "system/roleManagement/index.vue",
                    meta: {
                        title: "角色管理",
                        icon: "role"
                    },
                    children: [
                        {
                            path: "edit/:id",
                            name: "EditRole",
                            component: "system/roleManagement/editRole.vue",
                            meta: {
                                title: "编辑角色",
                                icon: "edit"
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: "/user",
            name: "UserManagement",
            component: "system/userManagement/index.vue",
            meta: {
                title: "用户管理",
                icon: "user"
            }
        }
    ];
}

// 生成假数据的函数
function generateMockRoutes(token) {
    const mockRoutes = createUserRoutes(); // 调用原有的路由生成函数
    // 可以在这里添加更多的逻辑来修改或扩展假数据
    if (token==='Admin Token') {
        return mockRoutes;
    }
}

// 
export default [
    {
        url: "/api/user/routes",
        method: "get",
        response: (request) => {
          //获取请求头携带token
          const token = request.headers.token;
          //请求用户的动态路由信息
          const checkUser = generateMockRoutes(token);
          //没有返回失败的信息
          if (!checkUser) {
            return { code: 201, data: { message: "获取动态路由信息失败" } };
          }
          //如果有返回成功信息
          return { code: 200, data: { checkUser } };
        },
      },
];