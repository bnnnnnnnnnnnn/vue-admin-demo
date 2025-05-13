// src/stores/user/index.ts

import { useMenuStore } from '@/stores/user/menuRoutesStore'
import { REMOVE_TOKEN } from '@/utils/token'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: 'JohnDoe', // 用户名
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
    },

    // 退出登录
    logout: async () => {
      try {
        // 把菜单都删了清零
        const menuStore = useMenuStore()
        await menuStore.initMenus()

        // 清除 token
        REMOVE_TOKEN()
      }
      catch (error) {
        throw new Error('退出登录失败')
      }
    },
  },
  getters: {
    username: state => state.username,
  },
})
