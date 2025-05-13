// stores/permissionStore.ts
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [] as string[],
  }),
  actions: {
    setPermissions(perms: string[]) {
      this.permissions = perms
      localStorage.setItem('permissions', JSON.stringify(perms)) // 👉 同步到本地
    },
    loadPermissionsFromStorage() {
      const perms = JSON.parse(localStorage.getItem('permissions') || '[]')
      this.permissions = perms
    },
    hasPermission(code: string) {
      return this.permissions.includes(code)
    },
    clearPermissions() {
      this.permissions = []
      localStorage.removeItem('permissions')
    },
  },
})
