<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div>
    <div class="test">12345</div>
    <RouterView />
  </div>
</template>

<style scoped lang='scss'>
.test{
  color: $color;
}
</style>
