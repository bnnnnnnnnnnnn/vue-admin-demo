<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  updateAccounts,
} from "@/api/system/user";
import { getRoles } from "@/api/system/roles";

import type { User } from "@/api/system/type";

// 用户列表
const users = ref<User[]>([]);


// 弹窗和表单
const accountDialogVisible = ref(false);
const isEditMode = ref(false);
const isEditPassword = ref(false);
const accountForm = ref<Partial<User>>({
  email: "",
  password: "",
  role: [],
});

// 加载用户列表
const loadUsers = async () => {
  try {
    users.value = await getUsers();
  } catch (error) {
    ElMessage.error("加载用户失败！");
  }
};

// 角色选项
const roles = ref<any[]>([]);

//获取角色类别
const loadRoles = async () => {
  try {
    const rolesData = await getRoles();
    roles.value = rolesData;
  } catch (error) {
    ElMessage.error("获取角色列表失败！");
  }
};

// 打开新增、编辑用户弹窗
const openAddUserDialog = () => {
  //判断是新增还是编辑
  accountForm.value = { email: "", password: "", role:[]};
  isEditMode.value = false;
  isEditPassword.value = false;
  accountDialogVisible.value = true;
};

// 打开修改弹窗
const openEditUserDialog = (user: User, type: string) => {
  if (type === "isEditMode") {
    accountForm.value = { email: user.email, role:user.role };
    isEditMode.value = true;
    isEditPassword.value = false;
    accountDialogVisible.value = true;
  }
  if (type === "isEditPassword") {
    accountForm.value = { email: user.email, password: "" };
    isEditPassword.value = true;
    isEditMode.value = false;
    accountDialogVisible.value = true;
  }
};

// 提交用户（新增、修改角色、修改密码）
const submitUser = async (): Promise<void> => {
  try {
    const { email, password, role } = accountForm.value;
    const targetUser = users.value.find((u) => u.email === email);

    // 校验邮箱格式（仅在新增时校验）
    if (!isEditMode.value && !isEditPassword.value) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!emailRegex.test(email)) {
        ElMessage.warning("邮箱格式不正确！");
        return;
      }
    }

    // 修改角色
    if (isEditMode.value) {
      if (role === targetUser?.role) {
        ElMessage.warning("角色未修改，无需操作！");
        return;
      }
      await updateUserRole(targetUser!.id, role || []);
      ElMessage.success("用户角色更新成功！");
    }

    // 修改密码
    else if (isEditPassword.value) {
      if (!password?.trim()) {
        ElMessage.warning("请输入新密码！");
        return;
      }
      if (password.length < 6) {
        ElMessage.warning("新密码长度不得小于6位！");
        return;
      }
      //提示
      ElMessageBox.confirm("请确认修改新密码，此操作不可逆转转", "确认修改", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await updateAccounts({ email, password });
        ElMessage.success("用户密码修改成功！");
      });
    }

    // 新增用户
    else {
      if (!email.trim() || !password?.trim()) {
        ElMessage.warning("请输入邮箱和密码！");
        return;
      }
      if (targetUser) {
        ElMessage.warning("邮箱已存在，请更换邮箱！");
        return; // 邮箱已存在，不创建
      }
      await createUser({email, password,role});
      ElMessage.success("用户创建成功！");
    }

    // 关闭弹窗并初始化并刷新用户列表
    isEditMode.value = false;
    isEditPassword.value = false;
    // accountForm.value = { email: "", password: "" };
    accountDialogVisible.value = false;
    await loadUsers();
  } catch (error) {
    ElMessage.error(`操作失败，请稍后再试!`);
  }
};

// 删除用户
const deleteUserById = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定删除该用户吗？", "提示", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteUser(id);
    ElMessage.success("用户删除成功！");
    loadUsers();
  } catch (error) {
    ElMessage.info("取消删除");
  }
};

// 初始化
onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>

<template>
  <el-card>
    <el-button type="primary" @click="openAddUserDialog">新增用户</el-button>

    <el-table :data="users" border style="margin-top: 20px">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="role" label="角色" align="center" >
        <template #default="{ row }">
          <el-tag class="mr-1" v-for="r in row.role" :key="r.id">{{ r.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="openEditUserDialog(row, 'isEditMode')"
            >修改角色</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="openEditUserDialog(row, 'isEditPassword')"
            >修改密码</el-button
          >
          <el-button type="danger" size="small" @click="deleteUserById(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 用户编辑弹窗 -->
  <el-dialog
    v-model="accountDialogVisible"
    :title="isEditMode || isEditPassword ? '修改' : '新增用户'"
  >
    <el-form label-width="80px">
      <el-form-item label="邮箱">
        <el-input
          v-model="accountForm.email"
          :disabled="isEditMode || isEditPassword"
        />
      </el-form-item>
      <el-form-item label="密码" v-if="!isEditMode">
        <el-input v-model="accountForm.password" type="password" />
      </el-form-item>
      <el-form-item label="角色" v-if="!isEditPassword">
        <el-select v-model="accountForm.role" multiple value-key="id">
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="accountDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitUser">保存</el-button>
    </template>
  </el-dialog>
</template>
