<template>
    <div class="h-full w-full flex flex-col bg-[#f8f8f8]">
      <div class="flex  justify-center items-center mb-1 h-[60px]" >超频三数据下载中心</div>
      <el-scrollbar >
        <Menu class="flex-1" />
      </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import Menu from "./menu.vue";
</script>

