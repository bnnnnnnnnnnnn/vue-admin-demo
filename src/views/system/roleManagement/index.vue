<template>
  <el-card>
    <!-- 顶部操作栏 -->
    <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>

    <!-- 角色表格 -->
    <el-table :data="roles" class="mt-[20px]"  border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="description" label="角色信息" align="center"></el-table-column>
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
            @click="openPermissionDialog(row)"
            >权限</el-button
          >
          <el-button type="danger" size="small" @click="deleteRole(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色权限弹窗 -->
    <el-dialog v-model="dialogVisible" title="角色权限管理">
      <el-transfer
        v-model="selectedMenus"
        :data="menus"
        :props="{ key: 'key', label: 'label' }"
      ></el-transfer>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="isEditMode ? '编辑角色' : '新增角色'"
    >
      <el-form :model="roleForm" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="description">
          <el-input
            v-model="roleForm.description"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-button type="primary" @click="openRolePermissionDialog"
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

    <!-- 角色权限选择弹窗（新增/编辑） -->
    <el-dialog v-model="rolePermissionDialogVisible" title="选择菜单权限">
      <el-transfer
        v-model="roleSelectedMenus"
        :data="menus"
        :props="{ key: 'key', label: 'label' }"
      ></el-transfer>

      <template #footer>
        <el-button @click="rolePermissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRolePermissions"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
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
import {fetchMenusApi} from "@/api/system/menu";


// 角色和菜单数据
const roles = ref<any[]>([]);
const menus = ref<{ key: number; label: string }[]>([]);
const selectedMenus = ref<number[]>([]);

// 角色权限弹窗
const dialogVisible = ref(false);
const selectedRole = ref<number | null>(null);

// 新增/编辑角色弹窗
const roleDialogVisible = ref(false);
const rolePermissionDialogVisible = ref(false);
const isEditMode = ref(false);
const roleForm = ref<{ id?: number; name: string;description:string }>({ name: "",description:'' });
const roleSelectedMenus = ref<number[]>([]);

// 加载角色列表
const loadRoles = async () => {
  const data = await getRoles();
  roles.value = data;
};

// 加载菜单列表
const loadMenus = async () => {
  const data = await fetchMenusApi();
  menus.value = data.map((item) => ({
    key: item.id,
    label: item.name,
  }));
};

// 打开角色权限弹窗
const openPermissionDialog = async (role: any) => {
  selectedRole.value = role.id;
  const data = await getRoleMenus(role.id);
  selectedMenus.value = data.map((menu) => menu.menu_id);
  dialogVisible.value = true;
};

// 保存角色权限
const savePermissions = async () => {
  if (selectedRole.value === null) return;
  await updateRoleMenus(selectedRole.value, selectedMenus.value);
  ElMessage.success("权限保存成功！");
  dialogVisible.value = false;
};

// 打开新增角色弹框
const openAddRoleDialog = () => {
  roleForm.value = { name: "", description:''};
  roleSelectedMenus.value = [];
  isEditMode.value = false;
  roleDialogVisible.value = true;
};

// 打开编辑角色弹框
const openEditRoleDialog = async (role: any) => {
  roleForm.value = { id: role.id, name: role.name ,description:role.description};
  const data = await getRoleMenus(role.id);
  roleSelectedMenus.value = data.map((menu) => menu.menu_id);
  isEditMode.value = true;
  roleDialogVisible.value = true;
};

// 打开角色的权限穿梭框弹窗
const openRolePermissionDialog = () => {
  rolePermissionDialogVisible.value = true;
};

// 确认角色的权限
const confirmRolePermissions = () => {
  rolePermissionDialogVisible.value = false;
};

// 提交新增/编辑角色
const submitRole = async () => {
  if (!roleForm.value.name.trim()) {
    ElMessage.warning("请输入角色名称！");
    return;
  }

  if (isEditMode.value) {
    // 编辑角色
    await updateRole(roleForm.value.id!, roleForm.value.name, roleForm.value.description);
    await updateRoleMenus(roleForm.value.id!, roleSelectedMenus.value);
    ElMessage.success("角色更新成功！");
  } else {
    // 新增角色
    const newRole = await addRole(roleForm.value.name,roleForm.value.description);
    if (newRole) {
      await updateRoleMenus(newRole.id, roleSelectedMenus.value);
      ElMessage.success("角色添加成功！");
    }
  }

  roleDialogVisible.value = false;
  loadRoles();
};

// 删除角色
const deleteRole = async (roleId: number) => {
  ElMessageBox.confirm("确定删除该角色吗？", "提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteRoleById(roleId);
      ElMessage.success("角色删除成功！");
      loadRoles();
    })
    .catch(() => {
      ElMessage.info("取消删除");
    });
};

// 初始化加载数据
onMounted(() => {
  loadRoles();
  loadMenus();
});
</script>
