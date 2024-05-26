## 简介
vue3_admin是一个简易的后台前端模板，它基于vite+vue3+typescript+element-plus实现。它使用了前端最新的技术栈。

## 准备工作
你需要在本地安装node和git。本项目基于es2017、vite、vue3、typescript、vue-router、pinia、axios和element-plus，
api接口以nestjs实现。当然本地mock.js也均已实现。

## 功能
```
- 登录 / 注销

- 全局功能
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - 本地/后端 mock 数据
  - 自适应收缩侧边栏
  - i18n国际化 (在i18n分支)
  
- 错误页面
  - 404

```

## 开发
```
# 克隆项目
git clone https://github.com/code-lucky/vue3_admin.git

# 进入项目目录
cd vue-element-admin

# 安装依赖 node版本 >= 18.0
npm install

# 启动服务
npm run dev
```