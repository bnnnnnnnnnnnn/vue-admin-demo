<script setup lang="ts" name="menu">
import { onMounted, ref, markRaw } from "vue";
import { useMenuStore } from "@/stores/user/menuRoutesStore";
import { useRouter } from "vue-router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { Menu } from "@element-plus/icons-vue";

const router = useRouter();
const menuStore = useMenuStore();
const activePath = ref("");

// 注册所有图标组件
const icons = ref<Record<string, any>>({});
onMounted(() => {
  menuStore.loadMenus();
  // 初始化图标组件，使用 markRaw 处理
  icons.value = Object.entries(ElementPlusIconsVue).reduce((acc, [key, component]) => {
    if (key !== 'default') {
      acc[key] = markRaw(component);
    }
    return acc;
  }, {} as Record<string, any>);
});

// 获取图标组件
const getIcon = (iconName: string) => {
  return icons.value[iconName] || markRaw(Menu);
};

// 路由跳转
const handleLink = (path: string) => {
  // console.log(path,'path');
  activePath.value = path;
  router.push(path);
};
</script>

<template>
  <div class="menu menu-md bg-base-200 rounded-box w-full h-full">
    <template v-for="menu in menuStore.menuList" :key="menu?.id">
      <li
        v-if="menu && !menu.hidden && (!menu.children || menu.children.length === 0)"
        :class="{ 'menu-active': activePath === menu.path }"
      >
        <p @click.stop="handleLink(menu.path)">
          <el-icon class="menu-icon">
            <component :is="getIcon(menu.icon) || 'Menu'" />
          </el-icon>
          {{ menu.name }}
        </p>
      </li>

      <li v-else-if="menu && !menu.hidden">
        <details open>
          <summary>
            <el-icon class="menu-icon">
              <component :is="getIcon(menu.icon) || 'Menu'" />
            </el-icon>
            {{ menu.name }}
          </summary>
          <ul>
            <li
              v-for="child in menu.children"
              :class="{ 'menu-active': activePath === child.path }"
            >
              <p @click.stop="handleLink(child.path)">
                <el-icon class="menu-icon">
                  <component :is="getIcon(child.icon) || 'Menu'" />
                </el-icon>
                {{ child.name }}
              </p>

              <details v-if="child.children && child.children.length">
                <summary>
                  <el-icon class="menu-icon">
                    <component :is="getIcon(child.icon) || 'Menu'" />
                  </el-icon>
                  {{ child.name }}
                </summary>
                <ul>
                  <li
                    v-for="subChild in child.children"
                    v-if="subChild && !subChild.hidden"
                    :class="{ 'menu-active': activePath === subChild.path }"
                  >
                    <p @click.stop="handleLink(subChild.path)">
                      <el-icon class="menu-icon">
                        <component :is="getIcon(subChild.icon) || 'Menu'" />
                      </el-icon>
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
<style scoped>
.menu-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  vertical-align: middle;
}

.menu-active {
  background-color: #09090b;
  color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 2px 2px #0b0809;
}

.menu-icon {
  margin-right: 8px;
  vertical-align: middle;
}

/* 调整菜单项的布局 */
p, summary {
  display: flex;
  align-items: center;
  padding: 8px;
}
</style>

