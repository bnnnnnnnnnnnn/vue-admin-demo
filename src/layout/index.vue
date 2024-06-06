<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider"></div>
    <!-- 顶部导航 -->
    <div class="layout_tab"></div>
    <!-- 内容展示区 -->
    <div class="layout_main"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }
  .layout_tab {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tab-hight;
    top: 0;
    left: $base-menu-width;
    background-color: bisque;
  }
  .layout_main {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-tab-hight);
    top: $base-tab-hight;
    left: $base-menu-width;
    background-color: rgb(99, 59, 192);
  }
}
</style>
