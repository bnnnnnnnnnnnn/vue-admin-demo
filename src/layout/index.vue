<template>
  <div class="flex w-full h-full overflow-hidden">
    <section class="min-w-10 w-[12vw]  p-2">
      <Sidebar />
    </section>
    <section class="flex-1 p-2">
      <header class="h-[60px] p-2 "></header>
      <main class="flex-1 p-2">
        <router-view></router-view>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts" name="layout">
import Sidebar from "./components/Sidebar/index.vue";
</script>

<style scoped lang="scss"></style>
