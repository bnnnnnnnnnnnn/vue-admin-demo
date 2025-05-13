<script setup lang="ts" name="login">
import type { FormRules } from 'element-plus' // 引入表单验证规则类型
import { cn } from '@/lib/utils' // 引入辅助函数用于处理类名拼接
import { addDynamicRoutes } from '@/router/components/dynamicRoutes' // 动态路由处理
import useUserStore from '@/stores/modules/user' // 引入用户状态管理 store
import { getTime } from '@/utils/time' // 获取当前时间工具
import { Lock, User } from '@element-plus/icons-vue' // 引入 Element Plus 图标
import { ElForm, ElNotification } from 'element-plus' // 引入通知组件
import { debounce } from 'lodash-es' // 引入防抖函数
import { nextTick, reactive, ref } from 'vue' // 引入 Vue 基础函数
import { useRouter } from 'vue-router' // 引入路由管理

type LoginMethod = 'email' | 'phone' // 默认值设置
withDefaults(defineProps<ShimmerButtonProps>(), {
  shimmerColor: '#ffffff',
  shimmerSize: '0.05em',
  shimmerDuration: '3s',
  borderRadius: '100px',
  background: 'rgba(0, 0, 0, 1)',
  class: 'btnClass',
})
// 定义登录方式的类型

// 初始化 store 和路由
const useStore = useUserStore()
const $router = useRouter()

// 当前的登录方式，默认为邮箱登录
const loginMethod = ref<LoginMethod>('email')

// 表单数据，包括邮箱、手机号和密码
const form = reactive<{ email: string, phone: string, password: string }>({
  email: '',
  phone: '',
  password: '',
})

// 表单验证规则
const rules: FormRules = {
  email: [
    {
      // 自定义邮箱验证逻辑
      validator: (_, value, callback) => {
        if (!value && !form.phone) {
          callback(new Error('邮箱和手机号必须填写一个'))
        }
        else if (value && form.phone) {
          callback(new Error('邮箱和手机号只能填写一个'))
        }
        else if (
          value
          && !/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          callback(new Error('请输入有效的邮箱地址'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur', // 在失去焦点时触发验证
    },
  ],
  phone: [
    {
      // 自定义手机号验证逻辑
      validator: (_, value, callback) => {
        if (!value && !form.email) {
          callback(new Error('邮箱和手机号必须填写一个'))
        }
        else if (value && form.email) {
          callback(new Error('邮箱和手机号只能填写一个'))
        }
        else if (value && !/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入有效的手机号'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur', // 在失去焦点时触发验证
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }, // 密码不能为空
    { min: 6, max: 6, message: '请输入六位登录密码', trigger: 'blur' }, // 密码长度为6
  ],
}

// 引用表单组件实例
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
// 控制加载状态的变量
const loadingShow = ref(false)

// 切换登录方式时清空密码字段
function handleTabChange() {
  form.password = ''
  if (loginMethod.value === 'email') {
    form.phone = '' // 如果切换为邮箱登录，清空手机号
  }
  else {
    form.email = '' // 如果切换为手机登录，清空邮箱
  }
}

// 登录逻辑
async function doLogin() {
  if (!formRef.value)
    return // 如果表单不存在，则返回
  try {
    loadingShow.value = true // 开始加载

    // 清除上一次的验证状态，重新进行校验
    await formRef.value.clearValidate()
    await formRef.value.validate()

    const loginType = loginMethod.value // 获取当前登录方式
    // 调用 store 中的登录方法
    await useStore.userLogin({ ...form, loginType })

    // 登录成功后，动态添加路由并跳转
    addDynamicRoutes($router)
    await nextTick()
    $router.push('/home')

    // 显示登录成功的通知
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `HI!，${getTime()}好`,
    })
  }
  catch (error) {
    // 登录失败，显示错误通知
    ElNotification({
      type: 'error',
      message: '登录失败，请检查账号密码是否填写正确',
    })
  }
  finally {
    loadingShow.value = false // 停止加载
  }
}

// 防抖处理登录函数，避免短时间内重复提交
const login = debounce(doLogin, 800, { leading: true, trailing: false })

// Shimmer按钮的props定义
interface ShimmerButtonProps {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  class?: string
}
</script>

<template>
  <!-- 登录表单 -->
  <ElForm ref="formRef" v-loading="loadingShow" class="login_form" :model="form" :rules="rules">
    <!-- Logo 图片 -->
    <img src="@/assets/img/logo.png" alt="Logo" class="logo">
    <h1>欢迎回来，请登录您的账号</h1>

    <!-- 登录方式选项 -->
    <el-tabs v-model="loginMethod" :stretch="true" @tab-click="handleTabChange">
      <el-tab-pane label="邮箱登录" name="email">
        <el-form-item prop="email">
          <el-input v-model="form.email" :prefix-icon="User" placeholder="请输入邮箱" />
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="手机登录" name="phone">
        <el-form-item prop="phone">
          <el-input v-model="form.phone" :prefix-icon="User" placeholder="请输入手机号" />
        </el-form-item>
      </el-tab-pane>
    </el-tabs>

    <!-- 密码输入框 -->
    <el-form-item prop="password">
      <el-input v-model="form.password" type="password" :prefix-icon="Lock" show-password placeholder="请输入密码" />
    </el-form-item>

    <!-- 登录按钮 -->
    <el-form-item>
      <button
        type="button" :disabled="loadingShow" :class="cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          $props.class,
        )
        " :style="{
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        }" @click="login"
      >
        <div
          :class="cn(
            '-z-30 blur-[2px]',
            'absolute inset-0 overflow-visible [container-type:size]',
          )
          "
        >
          <div
            class="animate-shimmer-btn-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]"
          >
            <div
              class="animate-shimmer-btn-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]"
            />
          </div>
        </div>
        <span>登录</span>
        <div
          :class="cn(
            'insert-0 absolute size-full',
            'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
          )
          "
        />
        <div class="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    </el-form-item>
  </ElForm>
</template>

<style scoped lang="scss">
.login_form {
  position: absolute;
  width: 30vw;
  max-width: 500px;
  padding: 2vw 3vw;
  background-color: #303042;
  border-radius: 10px;
  box-shadow: 0 4px 8px 1px #494959;

  :deep(.el-tabs__item) {
    color: #1a1a2e;
  }

  :deep(.el-tabs__nav) {
    // background-color: #343447;
    border-bottom: 2px solid #000;
  }

  :deep(.el-tabs__item):hover {
    color: #ffffff;
  }

  :deep(.is-active) {
    color: #ffffff;
  }

  :deep(.el-tabs__active-bar) {
    background-color: #ffffff;
  }

  :deep(.el-input__wrapper) {
    background-color: #454555;
    border: none;
    box-shadow: 0 0 0 0;
    color: #ffffff;
  }

  :deep(.el-tabs__content) {
    height: 52px;
  }

  :deep(.el-loading-mask) {
    background-color: #303042;
    opacity: 0.5;
  }

  .logo {
    display: block;
    margin: 0 auto;
    width: 4vw;
  }

  h1 {
    text-align: center;
    color: #ffffff;
    margin-bottom: 20px;
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

.btnClass {
  width: 100%;
  height: 40px;
  display: flex;
}

@keyframes shimmer-btn-shimmer-slide {
  to {
    transform: translate(calc(100cqw - 100%), 0);
  }
}

@keyframes shimmer-btn-spin-around {
  0% {
    transform: translateZ(0) rotate(0);
  }

  15%,
  35% {
    transform: translateZ(0) rotate(90deg);
  }

  65%,
  85% {
    transform: translateZ(0) rotate(270deg);
  }

  100% {
    transform: translateZ(0) rotate(360deg);
  }
}

.animate-shimmer-btn-shimmer-slide {
  animation: shimmer-btn-shimmer-slide var(--speed) ease-in-out infinite alternate;
}

.animate-shimmer-btn-spin-around {
  animation: shimmer-btn-spin-around calc(var(--speed) * 2) infinite linear;
}
</style>
