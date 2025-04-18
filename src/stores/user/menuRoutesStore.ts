import { defineStore } from "pinia";
import { ref } from "vue";
import useUserStore from "@/stores/modules/user";
import { reqMenuList } from "@/api/user/index";
import type { menus } from "@/api/system/type";

export const useMenuStore = defineStore("menu", () => {
  const menuList = ref<menus[]>([]);
  const routesList = ref<Partial<menus[]>>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 初始化菜单,路由列表
  const initMenus = async () => {
    localStorage.removeItem("menuList");
    localStorage.removeItem("routesList");
  };

  // 加载菜单,路由
  const loadMenus = async () => {
    // 如果菜单数据已经加载过且存在于 localStorage 中，就直接从 localStorage 获取
    const storedMenus = localStorage.getItem("menuList");
    if (storedMenus) {
      // 从 localStorage 获取数据并解析
      menuList.value = JSON.parse(storedMenus);
      return;
    }

    if (menuList.value.length > 0) return;
    loading.value = true;
    error.value = null;

    try {
      const ids: number[] = useUserStore().roleIds || [];
      if (ids.length === 0) return;
      const menus = await reqMenuList(ids);
      menuList.value = buildMenuTree(menus);
      routesList.value = buildRouterTree(menus);

      // 存储菜单,路由数据到 localStorage
      localStorage.setItem("menuList", JSON.stringify(menuList.value));
      localStorage.setItem("routesList", JSON.stringify(routesList.value));
    } catch (err: any) {
      error.value = err.message;
      console.error(err.message);
    } finally {
      loading.value = false;
    }
  };

  // 构建菜单树
  const buildMenuTree = (menus: any[]): menus[] => {
    const menuMap = new Map<number, menus>();
    const tree: menus[] = [];
    menus.forEach((menu) => {
      const menuItem: Partial<menus> = {
        id: menu.id,
        name: menu.name,
        path: menu.path,
        icon: menu.icon, 
        parent_id: menu.parent_id,
        hidden: menu.hidden,
        children: menu.children || [],
      };
      menuMap.set(menu.id, menuItem as menus);
    });

    menus.forEach((menu) => {
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        parent.children?.push(menuMap.get(menu.id)!);
      } else {
        tree.push(menuMap.get(menu.id)!);
      }
    });

    return tree;
  };
  // 构建路由树
  const buildRouterTree = (menus: any[]): menus[] => {
    const menuMap = new Map<number, menus>();
    const tree: menus[] = [];
    menus.forEach((menu) => {
      const menuItem: Partial<menus> = {
        id: menu.id,
        name: menu.name,
        path: menu.path.match(/\/([^\/]*)$/)?.[1]||'/',
        redirect: menu.redirect,
        parent_id: menu.parent_id,
        component: menu.component,
        children: menu.children || [],
      };
      menuMap.set(menu.id, menuItem as menus);
    });

    menus.forEach((menu) => {
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        parent.children?.push(menuMap.get(menu.id)!);
      } else {
        tree.push(menuMap.get(menu.id)!);
      }
    });

    return tree;
  };

  return { menuList, routesList, loading, error, loadMenus, initMenus };
});
