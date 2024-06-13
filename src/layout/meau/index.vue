<template>
  <div>
    <el-menu
      active-text-color="#409eff"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 根据路由动态生成菜单 -->
      <!-- <el-menu-item index="0">
        <el-icon><location /></el-icon>
        <span>首页</span></el-menu-item
      >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>设置</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title>item four</template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu> -->
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="menu">
// 获取用户相关的小仓库
import  useUserStore  from "@/stores/modules/user";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
let userStore = useUserStore();
const handleOpen = () => {};
const handleClose = () => {};
</script>
 
<style lang="scss" scoped></style>
