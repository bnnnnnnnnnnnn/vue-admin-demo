<template>
  <el-card>
    <!-- 顶部操作栏 -->
    <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>

    <!-- 角色表格 -->
    <el-table v-loading="loading" :data="roles" class="mt-[20px]" border>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="description" label="角色信息" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="openEditRoleDialog(row)"
            >编辑</el-button
          >
          <el-button
            type="success"
            size="small"
            @click="openRolePermissionDialog({ type: 1, id: row.id })"
            >权限</el-button
          >
          <el-button type="danger" size="small" @click="deleteRole(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="isEditMode ? '编辑角色' : '新增角色'"
    >
      <el-form :model="roleForm" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-button
            type="primary"
            @click="openRolePermissionDialog({ type: 0 })"
            >选择权限</el-button
          >
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRole">{{
          isEditMode ? "保存" : "新增"
        }}</el-button>
      </template>
    </el-dialog>

    <!-- 菜单权限弹窗 -->
    <el-dialog
      v-model="rolePermissionDialogVisible"
      title="菜单权限选择"
      width="30%"
    >
      <MenuTransfer :allMenus="menusRaw" v-model="roleSelectedMenus" />
      <template #footer>
        <el-button @click="rolePermissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRolePermissions"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts" name="Role">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getRoles,
  getRoleMenus,
  updateRoleMenus,
  addRole,
  updateRole,
  deleteRoleById,
} from "@/api/system/roles";
import { fetchMenusApi } from "@/api/system/menu";
import MenuTransfer from "@/views/system/roleManagement/components/MenuTransfer.vue";

// ======================== 数据区域 ========================
const roles = ref<any[]>([]);
const menusRaw = ref<any[]>([]);
const loading = ref(false);

// ======================== 弹窗与表单状态 ========================
const roleDialogVisible = ref(false); // 新增/编辑弹窗
const rolePermissionDialogVisible = ref(false); // 菜单权限弹窗
const roleId = ref<number>(0);
const isEditMode = ref(false); // 是否编辑模式
const roleForm = ref<{ id?: number; name: string; description: string }>({
  name: "",
  description: "",
});
const roleFormRef = ref();
const roleSelectedMenus = ref<number[]>([]);
const selectedMenuIds = ref<number[]>([]); // 权限弹窗中当前角色ID

// ======================== 初始化 ========================
const loadRoles = async () => {
  try {
    loading.value = true;
    roles.value = await getRoles();
  } catch (err) {
    console.error("加载角色失败:", err);
  } finally {
    loading.value = false;
  }
};

const loadMenus = async () => {
  menusRaw.value = await fetchMenusApi();
};

// ======================== 弹窗操作 ========================
const openAddRoleDialog = () => {
  roleForm.value = { name: "", description: "" };
  roleSelectedMenus.value = [];
  isEditMode.value = false;
  roleDialogVisible.value = true;
};

const openEditRoleDialog = async (role: any) => {
  roleForm.value = {
    id: role.id,
    name: role.name,
    description: role.description,
  };
  const data = await getRoleMenus(role.id);
  roleSelectedMenus.value = data.map((menu) => menu.menu_id);
  isEditMode.value = true;
  roleDialogVisible.value = true;
};

const openRolePermissionDialog = async (data: {
  type: number;
  id?: number;
}) => {
  // type=1 表示单独权限设置弹窗
  if (data.type === 1 && data.id) {
    roleId.value = data.id;
    const menus = await getRoleMenus(data.id);
    roleSelectedMenus.value = menus.map((m) => m.menu_id);
  }
  rolePermissionDialogVisible.value = true;
};

const confirmRolePermissions = async () => {
  if (roleId.value) {
    await updateRoleMenus(roleId.value, roleSelectedMenus.value);
    ElMessage.success("权限保存成功！");
  }

  rolePermissionDialogVisible.value = false;
};

// ======================== 提交逻辑 ========================
const submitRole = async () => {
  if (!roleForm.value.name.trim()) {
    ElMessage.warning("请输入角色名称！");
    return;
  }

  if (isEditMode.value && roleForm.value.id) {
    await updateRole(
      roleForm.value.id,
      roleForm.value.name,
      roleForm.value.description
    );
    await updateRoleMenus(roleForm.value.id, roleSelectedMenus.value);
    ElMessage.success("角色更新成功！");
  } else {
    const newRole = await addRole(
      roleForm.value.name,
      roleForm.value.description
    );

    if (newRole && newRole.id) {
      await updateRoleMenus(newRole.id, roleSelectedMenus.value);
      ElMessage.success("角色添加成功！");
    }
  }

  roleDialogVisible.value = false;
  loadRoles();
};

// ======================== 删除角色 ========================
const deleteRole = async (roleId: number) => {
  ElMessageBox.confirm(
    "该操作将永久删除该角色及其所有关联权限，删除后无法恢复。是否继续？",
    "警告",
    {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      await deleteRoleById(roleId);
      ElMessage.success("角色删除成功！");
      loadRoles();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// ======================== 初始化加载 ========================
onMounted(() => {
  loadRoles();
  loadMenus();
});
</script>
