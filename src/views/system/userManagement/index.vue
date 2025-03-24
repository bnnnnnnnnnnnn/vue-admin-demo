<template>
  <div>
    <el-button @click="createPermission" type="primary">新增权限</el-button>

    <el-table :data="permissions" stripe>
      <el-table-column label="权限名称" prop="name" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="editPermission(scope.row)" size="mini"
            >编辑</el-button
          >
          <el-button
            @click="deletePermission(scope.row)"
            size="mini"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="permissionDialogVisible" title="编辑权限">
      <el-form :model="currentPermission">
        <el-form-item label="权限名称">
          <el-input v-model="currentPermission.name" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="currentPermission.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import supabase from "@/services/supabase";

const permissions = ref<any[]>([]);
const permissionDialogVisible = ref(false);
const currentPermission = ref<{
  id?: number | null;
  name: string;
  description: string;
}>({ id: null, name: "", description: "" });

const fetchPermissions = async () => {
  const { data, error } = await supabase.from("permissions").select();
  if (error) {
    ElMessage.error("获取权限失败");
    return;
  }
  permissions.value = data;
};

const createPermission = () => {
  currentPermission.value = { name: "", description: "" };
  permissionDialogVisible.value = true;
};

const editPermission = (permission: any) => {
  currentPermission.value = { ...permission };
  permissionDialogVisible.value = true;
};

const deletePermission = async (permission: any) => {
  const { error } = await supabase
    .from("permissions")
    .delete()
    .match({ id: permission.id });
  if (error) {
    ElMessage.error("删除权限失败");
    return;
  }
  fetchPermissions(); // 删除成功后刷新列表
};

const savePermission = async () => {
  let { error } = await supabase
    .from("permissions")
    .upsert([currentPermission.value]);
  if (error) {
    ElMessage.error("保存权限失败");
    return;
  }
  permissionDialogVisible.value = false;
  fetchPermissions(); // 保存成功后刷新列表
};

fetchPermissions();
</script>
