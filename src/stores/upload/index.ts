// src/stores/uploadStore.ts
import { defineStore } from "pinia";

interface UserInfo {
  name: string;
  id: string;
  // 可按需扩展更多字段
}

export const useUploadStore = defineStore("uploadStore", {
  state: () => ({
    user: {
      name: "演示用户",
      id: "demo-user-id",
    } as UserInfo,
  }),
  actions: {
    setUser(user: UserInfo) {
      this.user = user;
    },
  },
});
