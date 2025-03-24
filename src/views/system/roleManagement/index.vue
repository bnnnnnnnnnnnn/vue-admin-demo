<template>
  <div>
    <el-button @click="createRole" type="primary">新增角色</el-button>
    <el-table :data="roles" stripe>
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="editRole(scope.row)" size="mini">编辑</el-button>
          <el-button @click="deleteRole(scope.row)" size="mini" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog v-model="roleDialogVisible" title="角色管理">
      <el-form :model="currentRole">
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="currentRole.description" />
        </el-form-item>
        <el-form-item label="分配权限">
          <el-button>权限</el-button>
        </el-form-item>
        <!-- <el-form-item label="分配权限">
          <el-checkbox-group v-model="selectedPermissions">
            <el-checkbox
              v-for="perm in permissions"
              :key="perm.id"
              :label="perm.id"
            >
              {{ perm.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import supabase from "@/services/supabase";

const roles = ref<any[]>([]); // 角色列表
const permissions = ref<any[]>([]); // 权限列表
const roleDialogVisible = ref(false);
const currentRole = ref<{
  id?: number | null;
  name: string;
  description: string;
}>({
  id: null,
  name: "",
  description: "",
});
const selectedPermissions = ref<Array<string | number>>([]); // 选中的权限ID数组

/** 获取角色列表 */
const fetchRoles = async () => {
  const { data, error } = await supabase.from("roles").select();
  if (error) {
    ElMessage.error("获取角色失败");
    return;
  }
  roles.value = data;
};

/** 获取权限列表 */
const fetchPermissions = async () => {
  const { data, error } = await supabase.from("permissions").select();
  if (error) {
    ElMessage.error("获取权限失败");
    return;
  }
  permissions.value = data;
};

/** 获取角色的权限 */
const fetchRolePermissions = async (roleId: number) => {
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission_id")
    .eq("role_id", roleId);
  if (error) {
    ElMessage.error("获取角色权限失败");
    return;
  }
  selectedPermissions.value = data.map((item) => item.permission_id);
};

/** 点击新增角色按钮 */
const createRole = () => {
  currentRole.value = { id: null, name: "", description: "" };
  selectedPermissions.value = [];
  roleDialogVisible.value = true;
};

/** 点击编辑角色按钮 */
const editRole = async (role: any) => {
  currentRole.value = { ...role };
  await fetchRolePermissions(role.id); // 获取该角色的权限
  roleDialogVisible.value = true;
};

/** 删除角色 */
const deleteRole = async (role: any) => {
  try {
    await ElMessageBox.confirm("确认删除该角色吗？", "提示", {
      type: "warning",
    });
    await supabase.from("roles").delete().match({ id: role.id });
    await supabase
      .from("role_permissions")
      .delete()
      .match({ role_id: role.id }); // 删除角色的权限关联
    fetchRoles();
  } catch (error) {
    // Handle error
  }
};

/** 保存角色（新增或更新） */
const saveRole = async () => {
  let roleId = currentRole.value.id;

  // 1. 新增/更新角色
  try {
    if (!roleId) {
      //移出id属性，因为新增时不需要id属性
      delete currentRole.value.id;

      const { data, error } = await supabase
        .from("roles")
        .insert([currentRole.value])
        .select()
        .single();
      if (error) {
        console.error("创建角色失败:", error.message); // 打印错误信息
        ElMessage.error("创建角色失败");
        return;
      }
      roleId = data.id;
    } else {
      const { error } = await supabase
        .from("roles")
        .update(currentRole.value)
        .match({ id: roleId });
      if (error) {
        console.error("更新角色失败:", error.message); // 打印错误信息
        ElMessage.error("更新角色失败");
        return;
      }
    }

    // 2. 更新角色的权限2222    await supabase.from("role_permissions").delete().match({ role_id: roleId }); // 先清除旧权限
    if (selectedPermissions.value.length > 0) {
      const rolePermissions = selectedPermissions.value.map((permId) => ({
        role_id: roleId,
        permission_id: permId,
      }));
      const { error } = await supabase
        .from("role_permissions")
        .insert(rolePermissions);
      if (error) {
        console.error("更新角色权限失败:", error.message); // 打印错误信息
        ElMessage.error("更新角色权限失败");
        return;
      }
    }

    ElMessage.success("角色保存成功");
    roleDialogVisible.value = false;
    fetchRoles(); // 刷新角色列表
  } catch (err) {
    console.error("未知错误:", err); // 打印未知错误
    ElMessage.error("保存角色时发生未知错误");
  }
};

onMounted(() => {
  fetchRoles();
  fetchPermissions();
});
</script>
