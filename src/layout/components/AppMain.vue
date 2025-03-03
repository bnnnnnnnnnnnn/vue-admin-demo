<template>
    <section class="app-main">
    <transition name="fade-transform" mode="out-in">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
    </transition>
  </section>
</template>

<script setup lang="ts"  name='AppMain'>

</script>

<style scoped lang='scss'>

</style>