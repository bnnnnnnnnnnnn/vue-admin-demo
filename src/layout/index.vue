<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider"></div>
    <!-- 右侧内容 -->
    <div>
      <!-- 顶部导航 -->
      <div></div>
      <!-- 内容展示区 -->
      <div></div>
    </div>
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
}
</style>
