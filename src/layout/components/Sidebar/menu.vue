<template>
  <div class="menu-wrapper">
    <el-menu
      :default-active="router.currentRoute.value.path"
      active-text-color="#409eff"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 渲染菜单项 -->
      <template v-for="menu in menuList" :key="menu?.id">
        <el-menu-item
          v-if="
            menu &&
            !menu.hidden &&
            (!menu.children || menu.children.length === 0)
          "
          :index="menu.path"
          @click="handleLink(menu.path)"
        >
          <component class="icon-wrapper" :is="menu.icon" />
          <span>{{ menu.name }}</span>
        </el-menu-item>

        <!-- 渲染有子菜单的项 -->
        <el-sub-menu v-else-if="menu && !menu.hidden" :index="menu.path">
          <template #title>
            <component class="icon-wrapper" :is="menu.icon" />
            <span>{{ menu.name }}</span>
          </template>
          <template v-for="child in menu.children" :key="child?.id">
            <el-menu-item
              v-if="
                child &&
                !child.hidden &&
                (!child.children || child.children.length === 0)
              "
              :index="child.path"
              @click="handleLink(child.path)"
            >
              <component class="icon-wrapper" :is="child.icon" />
              <span>{{ child.name }}</span>
            </el-menu-item>

            <!-- 渲染嵌套子菜单 -->
            <el-sub-menu v-else-if="child && !child.hidden" :index="child.path">
              <template #title>
                <component class="icon-wrapper" :is="child.icon" />
                <span>{{ child.name }}</span>
              </template>
              <el-menu-item
                v-for="subChild in child.children"
                :key="subChild?.id"
                v-if="subChild && !subChild.hidden"
                :index="subChild.path"
                @click="handleLink(subChild.path)"
              >
                <component class="icon-wrapper" :is="subChild.icon" />
                <span>{{ subChild.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="menu">
import { ref, onMounted, markRaw } from "vue";
import { useRouter } from "vue-router";
import supabase from "@/lib/supabase";
import { HomeFilled, Tools, Menu, UserFilled } from "@element-plus/icons-vue";

const router = useRouter();
const menuList = ref<MenuItem[]>([]);

interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon: any;
  parent_id: number | null;
  hidden: boolean;
  children?: MenuItem[];
}

// **菜单图标映射**
const iconMap: Record<string, any> = {
  home: markRaw(HomeFilled),
  settings: markRaw(Tools),
  menu: markRaw(Menu),
  role: markRaw(UserFilled),
};

// **加载菜单数据**
const loadMenus = async () => {
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("加载菜单失败:", error.message);
    return;
  }

  // **构建树形结构**
  menuList.value = buildMenuTree(data);
};

// **构建树形菜单**
const buildMenuTree = (menus: any[]): MenuItem[] => {
  const menuMap = new Map<number, MenuItem>();
  const tree: MenuItem[] = [];
  console.log(menus, "menus1");
  menus = menus.filter((menu) => menu.parent_id !== null);
  console.log(menus, "menus2");
  menus.forEach((menu) => {
    const menuItem: MenuItem = {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      icon: markRaw(iconMap[menu.icon] || Tools), // **使用 markRaw 避免组件变为响应式**
      parent_id: menu.parent_id,
      hidden: menu.hidden,
      children: [],
    };
    menuMap.set(menu.id, menuItem);
  });

  menus.forEach((menu) => {
    const parent = menuMap.get(menu.parent_id);
    if (parent) {
      parent.children?.push(menuMap.get(menu.id)!);
    } else {
      tree.push(menuMap.get(menu.id)!);
    }
  });
  console.log(tree, "tree");

  return tree;
};

// **路由跳转**
const handleLink = (path: string) => {
  console.log("跳转到路径:", path);
  router.push(path); // 路由跳转
};

// **监听菜单展开/关闭**
const handleOpen = () => {};
const handleClose = () => {};

// **组件加载时获取菜单**
onMounted(loadMenus);
</script>

<style lang="scss" scoped>
.menu-wrapper {
  .el-menu {
    border-right: none;
  }
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-right: 5px;
    width: 20px;
    height: 20px;
  }
}
</style>
