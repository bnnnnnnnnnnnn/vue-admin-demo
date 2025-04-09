<script setup lang="ts" name="menu">
import { onMounted, ref } from "vue";
import { useMenuStore } from "@/stores/user/menuRoutesStore";
import { useRouter } from "vue-router";

const router = useRouter();
const menuStore = useMenuStore();
const activePath = ref("");

onMounted(() => {
  menuStore.loadMenus();
});

// 路由跳转
const handleLink = (path: string) => {
  activePath.value = path;
  router.push(path);
};
</script>

<template>
  <div class="menu menu-md bg-base-200 rounded-box w-full h-full">
    <template v-for="menu in menuStore.menuList" :key="menu?.id">
      <li
        v-if="
          menu && !menu.hidden && (!menu.children || menu.children.length === 0)
        "
        :class="{ 'menu-active': activePath === menu.path }"
      >
        <p @click.stop="handleLink(menu.path)">{{ menu.name }}</p>
      </li>

      <!-- 渲染有子菜单的项 -->
      <li v-else-if="menu && !menu.hidden">
        <details open>
          <summary>{{ menu.name }}</summary>
          <ul>
            <li
              v-for="child in menu.children"
              :class="{ 'menu-active': activePath === child.path }"
            >
              <p @click.stop="handleLink(child.path)">{{ child.name }}</p>

              <!-- 渲染嵌套子菜单 -->
              <details v-if="child.children && child.children.length">
                <summary>{{ child.name }}</summary>
                <ul>
                  <li
                    v-for="subChild in child.children"
                    v-if="subChild && !subChild.hidden"
                    :class="{ 'menu-active': activePath === subChild.path }"
                  >
                    <p @click.stop="handleLink(subChild.path)">
                      {{ subChild.name }}
                    </p>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>
    </template>
  </div>
</template>
<style>
.menu-active{
  background-color: #09090b;
  color: #f5f5f5;
  border-radius: 5px;
  box-shadow:0 2px 2px #0b0809
}
</style>

