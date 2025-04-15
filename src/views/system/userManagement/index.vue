<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  updateAccounts,
  getRoles,
} from "@/api/system/user";
import type { User, Role } from "@/api/system/type";

// 用户数据
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(false);

// 表单相关
const accountDialogVisible = ref(false);
const isEditMode = ref(false);
const isEditPassword = ref(false);
const registerMethod = ref<"email" | "phone">("email");
const options = ref([
  { value: "email", label: "邮箱" },
  { value: "phone", label: "手机号" },
]);

const accountForm = ref<Partial<User>>({
  id: "",
  email: "",
  phone: "",
  password: "",
  role: [],
  description: "",
});

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true;
    users.value = await getUsers();
  } catch (err) {
    ElMessage.error("加载用户失败！");
  } finally {
    loading.value = false;
  }
};

// 加载角色列表
const loadRoles = async () => {
  try {
    roles.value = await getRoles();
  } catch (err) {
    ElMessage.error("获取角色列表失败！");
  }
};

// 打开新增弹窗
const openAddUserDialog = () => {
  accountForm.value = {
    id: "",
    email: "",
    phone: "",
    password: "",
    role: [],
    description: "",
  };
  isEditMode.value = false;
  isEditPassword.value = false;
  registerMethod.value = "email";
  accountDialogVisible.value = true;
};

// 打开编辑弹窗（修改角色 / 修改密码）
const openEditUserDialog = (
  user: User,
  type: "isEditMode" | "isEditPassword"
) => {
  const { id, email, phone, role, description } = user;

  // 优先判断手机号是否存在
  const isPhoneUser = !!phone;
  registerMethod.value = isPhoneUser ? "phone" : "email";

  accountForm.value = {
    id,
    email: email || "",
    phone: phone || "",
    password: "",
    role: type === "isEditMode" ? role : [],
    description: description || "",
  };

  isEditMode.value = type === "isEditMode";
  isEditPassword.value = type === "isEditPassword";

  accountDialogVisible.value = true;
};

// 表单提交逻辑
const submitUser = async () => {
  try {
    const { id, email, phone, password, role, description } = accountForm.value;
    const isEmail = registerMethod.value === "email";

    // 新增用户逻辑
    if (!isEditMode.value && !isEditPassword.value) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      const phoneRegex = /^1[3-9]\d{9}$/;

      if (isEmail) {
        if (!email || !emailRegex.test(email)) {
          return ElMessage.warning("请输入有效的邮箱地址！");
        }
      } else {
        if (!phone || !phoneRegex.test(phone)) {
          return ElMessage.warning("请输入有效的手机号！");
        }
      }

      if (!password?.trim()) {
        return ElMessage.warning("请输入密码！");
      }

      if (password.length < 6) {
        return ElMessage.warning("密码长度不能小于6位！");
      }

      if (!role || role.length === 0) {
        return ElMessage.warning("请选择角色！");
      }

      await createUser({
        ...accountForm.value,
        ...(isEmail ? { phone: "" } : { email: "" }),
      });

      ElMessage.success("用户新增成功！");
    }

    // 编辑角色逻辑
    else if (isEditMode.value) {
      if (!id) return ElMessage.error("缺少用户ID！");
      const current = users.value.find((u) => u.id === id);
      if (JSON.stringify(current?.role) === JSON.stringify(role)) {
        return ElMessage.warning("角色未发生变化！");
      }

      await updateUserRole(id, role || [], description || "");
      ElMessage.success("用户角色更新成功！");
    }

    // 修改密码逻辑
    else if (isEditPassword.value) {
      if (!password?.trim()) {
        return ElMessage.warning("请输入新密码！");
      }
      if (password.length < 6) {
        return ElMessage.warning("新密码长度不得小于6位！");
      }

      await ElMessageBox.confirm(
        "请确认修改新密码，此操作不可逆转",
        "确认修改",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      );

      if (!id) return ElMessage.error("缺少用户ID！");
      await updateAccounts({ id, password });
      ElMessage.success("用户密码修改成功！");
    }

    accountDialogVisible.value = false;
    await loadUsers();
  } catch (error: any) {
    ElMessage.error(error?.message || "操作失败！");
  }
};

// 删除用户
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.email || user.phone} 吗？该操作无法撤销`,
      "确认删除",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    await deleteUser(user.id!);
    ElMessage.success("删除成功");
    await loadUsers();
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err?.message || "删除失败");
    }
  }
};

// 初始化加载
onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>

<template>
  <el-card>
    <el-button type="primary" @click="openAddUserDialog">新增用户</el-button>

    <el-table v-loading="loading" :data="users" border style="margin-top: 20px">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column label="邮箱/手机号码" align="center">
        <template #default="{ row }">
          {{ row.email || row.phone || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center">
        <template #default="{ row }">
          <el-tag class="mr-1" v-for="r in row.role" :key="r.id">
            {{ r.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详情" prop="description" align="center" />

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
          <el-button type="danger" size="small" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 用户弹窗 -->
  <el-dialog
    v-model="accountDialogVisible"
    :title="isEditMode || isEditPassword ? '修改用户' : '新增用户'"
  >
    <el-form label-width="80px">
      <!-- 注册方式 -->
      <el-form-item label="注册方式" v-if="!isEditMode && !isEditPassword">
        <el-select
          v-model="registerMethod"
          placeholder="请选择注册方式"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" v-if="registerMethod === 'email'">
        <el-input
          v-model="accountForm.email"
          :disabled="isEditMode || isEditPassword"
        />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" v-if="registerMethod === 'phone'">
        <el-input
          v-model="accountForm.phone"
          :disabled="isEditMode || isEditPassword"
        />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" v-if="!isEditMode">
        <el-input v-model="accountForm.password" type="password" />
      </el-form-item>

      <!-- 角色 -->
      <el-form-item label="角色" v-if="!isEditPassword">
        <el-select
          v-model="accountForm.role"
          multiple
          value-key="id"
          placeholder="请选择角色"
        >
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户详情" v-if="!isEditPassword">
        <el-input
          v-model="accountForm.description"
          type="textarea" 
          rows="3"
          placeholder="请输入用户描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="accountDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitUser">提交</el-button>
    </template>
  </el-dialog>
</template>
