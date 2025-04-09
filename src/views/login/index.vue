<template>
  <div class="login_container">
    <div class="login_form">
      <img src="../../assets/img/logo.png" alt="Logo" class="logo" />
      <h1>欢迎回来，请登录您的账号</h1>

      <!-- Using el-tabs to select login method -->
      <el-tabs
        v-model="loginMethod"
        :stretch="true"
        @tab-click="handleTabChange"
      >
        <el-tab-pane label="邮箱登录" name="email">
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              :prefix-icon="User"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="手机登录" name="phone">
          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              :prefix-icon="User"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          :prefix-icon="Lock"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <!-- <el-checkbox v-model="rememberPassword">记住密码</el-checkbox> -->

      <el-form-item>
        <el-button
          :loading="loadingShow"
          type="primary"
          size="default"
          @click="login"
        >
          登录
        </el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import useUserStore from "@/stores/modules/user";
import { useRouter } from "vue-router";
import HomeView from "@/layout/index.vue";
import { addDynamicRoutes } from "@/router/components/dynamicRoutes";
import { ElNotification } from "element-plus";
import type { FormRules } from "element-plus";
import { getTime } from "@/utils/time";
import { nextTick } from "vue";

// 定义登录方式类型
type LoginMethod = "email" | "phone";

const useStore = useUserStore();
const $router = useRouter();
const loginMethod = ref<LoginMethod>("email"); // 控制登录方式
const form = reactive<{ email: string; phone: string; password: string }>({
  email: "",
  phone: "",
  password: "",
});

const rules = reactive<FormRules<typeof form>>({
  email: [
    { required: true, message: "账号不能为空", trigger: "change" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "账号不能为空", trigger: "change" },
    { pattern: /^[1-9]\d{9}$/, message: "请输入有效的手机号", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "change" },
    { min: 6, max: 6, message: "请输入六位登录密码", trigger: "blur" },
  ],
});

const loadingShow = ref(false);
// const rememberPassword = ref(false);

const handleTabChange = () => {
  // 重置密码字段
  form.password = "";
};

const login = async () => {
  loadingShow.value = true;
  try {
    // 登录逻辑
    if (loginMethod.value === "email") {
      await useStore.userLogin({ ...form, loginType: "email" });
    } else if (loginMethod.value === "phone") {
      await useStore.userLogin({ ...form, loginType: "phone" });
    }
    // 动态添加路由
    const dynamicRoute = await addDynamicRoutes();
    // 添加路由
    $router.addRoute({
      path: "/",
      component: HomeView, // 父布局组件
      children: dynamicRoute, // 将动态路由添加到 children 中
    });

    // 使用 nextTick 确保路由已添加完毕
    await nextTick();

    // 跳转到首页
    $router.push("/");

    // 登录成功通知
    ElNotification({
      type: "success",
      message: "登录成功",
      title: `HI!，${getTime()}好`,
    });
    loadingShow.value = false;
  } catch (error: any) {
    loadingShow.value = false;
    ElNotification({
      type: "error",
      message: error.message || "登录失败",
    });
  }
};

</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a2e;

  .login_form {
    width: 30vw;
    max-width: 500px;
    padding: 2vw 3vw;
    background-color: #303042;
    border-radius: 10px;
    color: #ffffff;
    box-shadow: 0 4px 8px 1px #494959;
    ::v-deep .el-tabs__item {
      color: #ffffff;
    }
    ::v-deep .el-input__wrapper {
      background-color: #454555;
      border: none;
      box-shadow: 0 0 0 0;
      color: #ffffff;
    }
    ::v-deep .el-tabs__active-bar {
      background-color: #4151e0;
    }
    .logo {
      display: block;
      margin: 0 auto;
      width: 5vw;
    }

    h1 {
      text-align: center;
      color: #ffffff;
      margin-bottom: 30px;
    }

    .el-input {
      margin: 10px 0;
      background-color: #393e46;
      border: 0px;
      border-radius: 5px;
      color: #ffffff;
    }

    .el-checkbox {
      margin-bottom: 20px;
      color: #ffffff;
    }

    .el-button {
      width: 100%;
      background-color: #4151e0;
      border: none;
      border-radius: 5px;
      color: #ffffff;
      font-weight: bold;
    }
  }
}
</style>
