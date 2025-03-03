<template>
  <div class="menu-wrapper">
    <el-menu
      :default-active="router.currentRoute.value.path"
      active-text-color="#409eff"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 根据路由动态生成菜单 -->
      <template v-for="(menu, index) in menuList" :key="index">
        <el-menu-item v-if="!menu.children" :index="menu.path">
          <component class="icon-wrapper" :is="menu.icon" />
          <span @click="handleLink(menu.path)">{{ menu.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="menu.path">
          <template #title>
            <component class="icon-wrapper" :is="menu.icon" :size="20" />
            <span @click="handleLink(menu.path)">{{ menu.name }}</span>
          </template>
          <el-menu-item
            v-for="(child, childIndex) in menu.children"
            :key="childIndex"
            :index="child.path"
          >
            <component class="icon-wrapper" :is="child.icon" :size="20" />
            <span @click="handleLink(child.path)">{{ child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="menu">
// 获取用户相关的小仓库
import useUserStore from "@/stores/modules/user";
import { Tools, HomeFilled, Menu, UserFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

let userStore = useUserStore();
const menuList = [
  {
    name: "首页",
    path: "/",
    icon: HomeFilled,
  },
  {
    name: "设置",
    path: "/set",
    icon: Tools,
    children: [
      {
        name: "菜单管理",
        path: "/set/menu",
        icon: Menu,
      },
      {
        name: "角色管理",
        path: "/set/role",
        icon: UserFilled,
      },
    ],
  },
];
const handleOpen = () => {};
const handleClose = () => {};

const router = useRouter();
const handleLink = (path: string) => {
  console.log(path);

  router.push(path);
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  .el-menu {
    border-right: none;
  }
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-right: 5px;
    width: 20px; /* 设置宽度 */
    height: 20px; /* 设置高度 */
  }
}
</style>
