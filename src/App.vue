<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { reqLogin } from "./api/user/index";
</script>
<style scoped lang="scss">
.test {
  // color: $color;
}
</style>
