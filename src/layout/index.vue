<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <Sidebar class="layout_slider" />
    <div class="layout_right">
      <!-- 顶部导航 -->
      <div class="layout_tab"></div>
      <!-- 内容展示区 -->
      <div class="layout_main">
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="layout">
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  display: flex;
  .layout_slider {
    width: $base-menu-width;
  }
  .layout_right {
    flex: 1;
    .layout_tab {
      position: fixed;
      width: 100%;
      height: $base-tab-hight;
      top: 0;
      left: $base-menu-width;
      // background-color: bisque;
    }
    .layout_main {
      position: fixed;
      width: 100%;
      height: calc(100% - $base-tab-hight);
      top: $base-tab-hight;
      // left: $base-menu-width;
      padding: 20px;
      overflow: auto;
    }
  }
}
</style>
