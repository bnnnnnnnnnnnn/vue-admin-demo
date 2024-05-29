

<template>
  <div>
    <div class="test">app根组件</div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { reqLogin } from './api/user/index';

reqLogin({username:'admin',password:'111111'}).then((res)=>{
  console.log(res,'res');
  
})
</script>
<style scoped lang='scss'>
.test{
  color: $color;
}
</style>
