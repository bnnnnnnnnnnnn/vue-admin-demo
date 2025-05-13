<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

declare const particlesJS: any
interface FormState {
  username: string
  password: string
  remember: boolean
}
const formRef = ref<FormInstance>()
const particlesContainer = ref<HTMLElement | null>(null)
const loginType = ref<'email' | 'phone'>('email')
const form = ref<FormState>({
  username: '',
  password: '',
  remember: false,
})
async function handleLogin() {
  if (!formRef.value)
    return
  try {
    await formRef.value.validate()
    ElMessage.success('登录成功')
  }
  catch (error) {
    ElMessage.error('请检查输入信息')
  }
}
onMounted(() => {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#4361ee',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#4361ee',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab',
        },
        onclick: {
          enable: true,
          mode: 'push',
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  })
})
</script>

<template>
  <div class="login-page">
    <div id="particles-js" ref="particlesContainer" />
    <div class="login-container">
      <div class="text-center mb-8">
        <h1 class="font-['Pacifico'] text-white text-3xl mb-2">
          logo
        </h1>
        <p class="text-gray-300 text-sm font-medium">
          欢迎回来，请登录您的账号
        </p>
      </div>
      <div class="flex w-full mb-6">
        <button
          class="flex-1 py-2 text-center text-gray-300 border-b-2 transition-all"
          :class="{ 'border-primary text-white': loginType === 'email' }" @click="loginType = 'email'"
        >
          邮箱登录
        </button>
        <button
          class="flex-1 py-2 text-center text-gray-300 border-b-2 transition-all"
          :class="{ 'border-primary text-white': loginType === 'phone' }" @click="loginType = 'phone'"
        >
          手机登录
        </button>
      </div>
      <el-form ref="formRef" :model="form">
        <div class="input-group">
          <el-icon class="input-icon">
            <User />
          </el-icon>
          <el-input
            v-model="form.username" class="login-input"
            :placeholder="loginType === 'email' ? '请输入邮箱' : '请输入手机号'"
          />
        </div>
        <div class="input-group">
          <el-icon class="input-icon">
            <Lock />
          </el-icon>
          <el-input v-model="form.password" class="login-input" type="password" placeholder="请输入密码" />
        </div>
        <div class="checkbox-wrapper">
          <el-checkbox v-model="form.remember">
            记住密码
          </el-checkbox>
        </div>
        <el-button type="primary" class="login-btn !rounded-button whitespace-nowrap" @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.border-primary {
  border-color: #4361ee !important;
}

.login-page {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a2e;
  font-family: system-ui, -apple-system, sans-serif;
}

#particles-js {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.login-container {
  position: relative;
  z-index: 2;
  width: 420px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  z-index: 2;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(67, 97, 238, 0.6) !important;
  box-shadow: 0 0 15px rgba(67, 97, 238, 0.3) !important;
  transform: translateY(-2px);
}

:deep(.el-input__inner) {
  background: transparent !important;
  color: white !important;
  padding-left: 40px !important;
  transition: all 0.3s ease;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.el-input__wrapper:hover .el-icon) {
  color: rgba(67, 97, 238, 0.8) !important;
  transform: translateY(-50%) scale(1.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4361ee, #3f37c9) !important;
  border: none;
  font-weight: 600;
  margin-top: 12px;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #4361ee !important;
  border-color: #4361ee !important;
}

:deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>
