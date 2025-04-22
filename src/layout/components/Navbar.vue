<template>
  <div>
    <!-- 登录管理 -->
    <div class="login-management flex items-center justify-end">
      <!-- 消息通知 -->
      <el-dropdown>
        <el-badge :value="unreadMessagesCount" class="mr-4">
          <el-button type="text" class="flex items-center">
            <el-icon class="mr-1"><Bell /></el-icon>
          </el-button>
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(message, index) in messages" :key="index">
              {{ message.content }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span class="text-gray-400">|</span>

      <!-- 退出登录按钮 -->
      <span
        @click="handleLogout"
        class="ml-4 LogoutBtn text-gray-600 cursor-pointer"
        >退出登录</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Bell } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user/index";
import { ElMessageBox,ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
// 模拟消息数据
const messages = ref([
  { content: "消息1" },
  { content: "消息2" },
  { content: "消息3" },
]);
const unreadMessagesCount = ref(messages.value.length);

// 使用 Pinia store
const user = useUserStore();

// 退出处理函数
const handleLogout = () => {
  // 弹框提示
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 用户点击确定后才会执行下面的退出登录操作
      user.logout();
    })
    .then(() => {
      // 退出登录成功后，重定向到登录页面
      router.push("/login");
    })
    .catch(() => {
      // 如果是取消确认，不提示错误
    }).finally(() => {
      ElMessage.success('退出登录成功');
    });
};
</script>

<style scoped>
/* 移除原有的 SCSS 样式 */
.login-management {
  height: 60px; /* 设置高度 */
  padding: 0 20px; /* 内边距 */
  border-bottom: 1px solid #ebeef5;
  /* 底部边框 */
}

.el-badge__content {
  background-color: #f56c6c; /* 未读消息数量背景色 */
  color: #fff; /* 未读消息数量文字颜色 */
  font-size: 12px; /* 未读消息数量字体大小 */
}

.el-button--text {
  color: #909399; /* 按钮文字颜色 */
}

.text-gray-600 {
  color: #606266; /* 退出登录文字颜色 */
}

.cursor-pointer {
  cursor: pointer; /* 鼠标悬停时变为指针 */
}
.LogoutBtn:hover {
  color: #409eff;
}
</style>
