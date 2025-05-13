import type { UserState } from './types/user'
import { reqLoginEmail, reqLoginPhone, reqUserInfo } from '@/api/user/index'
import { useMenuStore } from '@/stores/user/menuRoutesStore'
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'
import { defineStore } from 'pinia'

const useUserStore = defineStore('User', {
  state: (): UserState => ({
    token: GET_TOKEN(), // 用户的唯一标识
    user: null,
    roleIds: null,
    menus: null,
  }),

  actions: {
    // 登录
    async userLogin(data: any) {
      try {
        const loginFn
          = data.loginType === 'email' ? reqLoginEmail : reqLoginPhone
        const result = await loginFn(data)
        this.token = result.token
        SET_TOKEN(result.token)
        // 获取个人角色信息
        await this.loadUserInfo()
        // 在这里初始化菜单 store
        const menuStore = useMenuStore() // 只在需要时初始化
        await menuStore.initMenus() // 登录后初始化菜单列表
        await menuStore.loadMenus() // 加载菜单
        return 'ok'
      }
      catch (error: any) {
        throw new Error(error || '登录失败')
      }
    },

    async loadUserInfo() {
      try {
        const { user, role } = await reqUserInfo()
        this.user = user
        this.roleIds = role.map((i: { id: number, name: string }) => i.id)
      }
      catch (error) {
        console.error('用户信息加载失败:', error)
      }
    },
  },
})

export default useUserStore
