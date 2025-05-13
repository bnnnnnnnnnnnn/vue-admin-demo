<script setup lang="ts" name="layout">
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
</script>

<template>
  <div class="flex w-full h-full overflow-hidden">
    <section class="min-w-10 w-[12vw] p-2">
      <Sidebar />
    </section>
    <section class="flex-1 p-2">
      <header class="h-[60px] p-2">
        <Navbar />
      </header>
      <main class="flex-1 p-2">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style scoped lang="scss"></style>
