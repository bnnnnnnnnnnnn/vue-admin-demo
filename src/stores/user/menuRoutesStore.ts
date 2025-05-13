import type { menus } from '@/api/system/type'
import { reqMenuList } from '@/api/user/index'
import useUserStore from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/user/permissionStore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<menus[]>([])
  const routesList = ref<menus[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const permissionStore = usePermissionStore()

  // ✅ 初始化菜单状态
  const initMenus = () => {
    localStorage.removeItem('menuList')
    localStorage.removeItem('routesList')
    permissionStore.clearPermissions()
    menuList.value = []
    routesList.value = []
  }

  // ✅ 通用构建树结构（菜单 + 路由）
  const buildTree = (list: any[], isRoute = false): menus[] => {
    const map = new Map<number, menus>()
    const tree: menus[] = []

    list.forEach((item) => {
      const node: Partial<menus> = {
        id: item.id,
        name: item.name,
        path: isRoute ? item.path.match(/\/([^/]*)$/)?.[1] || '/' : item.path,
        component: item.component,
        redirect: item.redirect,
        parent_id: item.parent_id,
        icon: item.icon,
        hidden: item.hidden,
        children: [],
      }
      map.set(item.id, node as menus)
    })

    list.forEach((item) => {
      const parent = map.get(item.parent_id)
      if (parent) {
        parent.children?.push(map.get(item.id)!)
      }
      else {
        tree.push(map.get(item.id)!)
      }
    })

    return tree
  }

  // ✅ 加载菜单数据（自动缓存处理）
  const loadMenus = async () => {
    const cachedMenus = localStorage.getItem('menuList')
    const cachedRoutes = localStorage.getItem('routesList')

    if (cachedMenus && cachedRoutes) {
      menuList.value = JSON.parse(cachedMenus)
      routesList.value = JSON.parse(cachedRoutes)
      return
    }

    try {
      loading.value = true
      const roleIds = useUserStore().roleIds || []
      if (roleIds.length === 0)
        return

      const allMenus = await reqMenuList(roleIds)

      // 分类处理
      const menus = allMenus.filter(item => item.type !== 2)
      const permissions = allMenus
        .filter(item => item.type === 2)
        .map(item => item.path)

      // 构建菜单、路由、权限
      menuList.value = buildTree(menus)
      routesList.value = buildTree(menus, true)
      permissionStore.setPermissions(permissions)

      // 本地缓存
      localStorage.setItem('menuList', JSON.stringify(menuList.value))
      localStorage.setItem('routesList', JSON.stringify(routesList.value))
    }
    catch (err: any) {
      error.value = err.message || '菜单加载失败'
    }
    finally {
      loading.value = false
    }
  }

  return {
    menuList,
    routesList,
    loading,
    error,
    initMenus,
    loadMenus,
  }
})
