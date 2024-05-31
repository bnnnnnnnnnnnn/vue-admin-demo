<template>
  <div class="login_container">
    <div>
      <el-row>
        <el-col :span="12" :xs="0"></el-col>
        <el-col :span="12" :xs="24">
          <el-form class="login_form">
            <h1>hello,欢迎登录</h1>
            <el-form-item>
              <el-input v-model="from.username" :prefix-icon="User"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="from.password"
                type="password"
                :prefix-icon="Lock"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="default">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";

const from = ref({
  username: "admin",
  password: "111111",
});
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: rgba(81, 247, 233, 0.151);
  .login_form {
    width: 70%;
    position: relative;
    top: 30vh;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 5px;
    h1 {
      font-size: 20px;
      margin-bottom: 30px;
    }
    button {
      width: 100%;
    }
  }
}
</style>
