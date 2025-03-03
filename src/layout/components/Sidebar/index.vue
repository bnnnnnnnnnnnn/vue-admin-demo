<template>
  <div>
    <div class="layout_slider">
      <div class="layout_slider_logo">运营平台</div>
      <el-scrollbar class="scrollbar">
        <Menu />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from "./menu.vue";
</script>

<style lang="scss" scoped>
.layout_slider {
  width: $base-menu-width;
  height: 100vh;
  background: $base-menu-background;

  .layout_slider_logo {
    color: #ffff;
    font-size: 26px;
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
  .scrollbar {
    height: calc(100vh - 55px);
    // padding: 0 5px;
  }
}
</style>
