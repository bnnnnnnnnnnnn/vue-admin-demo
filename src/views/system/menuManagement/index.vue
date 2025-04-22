<script setup lang="ts" name="menu">
import { ref, reactive, onMounted, markRaw } from "vue";
import type { menus, MenuItem } from "@/api/system/type";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElInputNumber,
  ElInput,
  ElDialog,
  ElForm,
  ElFormItem,
  ElCascader,
} from "element-plus";

import {
  fetchMenusApi,
  addMenuApi,
  updateMenuApi,
  deleteMenuApi,
  updateMenuStatusApi,
  updateMenuSortOrderApi,
} from "@/api/system/menu";

const props = {
  value: "id",
  label: "name",
  children: "children",
  checkStrictly: true,
};
const menuList = ref<menus[]>([]);
const menuOptions = ref<menus[]>([]); // Holds the menu options for cascading
const formRef = ref<unknown>();
const loading = ref<Boolean>(false);

const dialogVisible = ref(false);
const isEdit = ref(false);
const createDefaultForm = (): MenuItem => ({
  id: null,
  type: 1,
  name: "",
  path: "",
  redirect: "",
  component: "",
  icon: "",
  parent_id: null,
  hidden: true,
  sort_order: 0,
});
const form = reactive<MenuItem>(createDefaultForm());
// 重置表单
const resetForm = () => {
  Object.assign(form, createDefaultForm());
};

// 格式化菜单树形数据
const formatMenus = (menus: menus[]) => {
  const map: { [key: number]: menus } = {};
  const result: menus[] = [];
  menus.forEach((menu) => {
    if (menu.id !== null) {
      // 确保 menu.id 不为 null
      map[menu.id as number] = menu;
      menu.children = [];
    }
  });

  menus.forEach((menu) => {
    if (menu.id && menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children?.push(map[menu.id]);
    } else if (menu.id !== null) {
      result.push(map[menu.id as number]);
    }
  });
  return result;
};

// 过滤掉第三层的数据
const filterMenuOptions = (menus: menus[]) => {
  //深拷贝
  const menusCopy = JSON.parse(JSON.stringify(menus));
  let res = formatMenus(menusCopy);
  return res.map((item) => {
    // 仅保留子菜单的第一层和第二层，不保留第三层
    if (item.children) {
      item.children = item.children.map((subItem) => {
        // 如果存在第三层，移除它
        if (subItem.children) {
          delete subItem.children;
        }
        return subItem;
      });
    }
    return item;
  });
};

// 选中父菜单
const handleCascaderChange = (value: any) => {
  if (value) {
    // 判断值的层级，确保只保留前两级
    form.parent_id = value.length > 1 ? value[1] : value[0]; // 保证返回的是前两层的值
  }
};

// 新增菜单
const handleAdd = () => {
  isEdit.value = false;
  resetForm();
  delete form.id;
  dialogVisible.value = true;
};

// 编辑菜单
const handleEdit = (item: menus) => {
  isEdit.value = true;
  // 去掉children
  delete item.children;
  Object.assign(form, item);
  dialogVisible.value = true;
};
// 添加子菜单
const handleAddSubMenu = (parent: menus) => {
  isEdit.value = false;
  resetForm();
  delete form.id;
  form.parent_id = parent.id as number;
  dialogVisible.value = true;
};
// 添加按钮权限
const handleAddButtonPermission = (parent: menus) => {
  isEdit.value = false;
  resetForm();
  delete form.id;
  form.type = 2;
  form.parent_id = parent.id as number;
  dialogVisible.value = true;
};

const fetchMenus = async () => {
  try {
    loading.value = true; // 加載中
    const data = await fetchMenusApi();
    menuList.value = formatMenus(data);
    menuOptions.value = filterMenuOptions(data);
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      "确定要删除这个菜单吗？删除后不可恢复哦！",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    // 用户点击确定后才会执行下面的删除操作
    await deleteMenuApi(id);
    // menuList.value = menuList.value.filter((menu) => menu.id !== id);
    await fetchMenus();
    ElMessage.success("删除成功");
  } catch (error: any) {
    // 如果是取消确认，不提示错误
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

const handleStatusChange = async (row: menus) => {
  try {
    await updateMenuStatusApi(row.id as number, row.hidden);
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};

const handleSortChange = async (row: menus) => {
  try {
    if (row.id) {
      await updateMenuSortOrderApi(row.id, row.sort_order as number);
    }
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};

const handleSubmit = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateMenuApi(form);
          ElMessage.success("编辑成功");
        } else {
          await addMenuApi(form);
          ElMessage.success("添加成功");
        }
        await fetchMenus();
        dialogVisible.value = false;
      } catch (error: any) {
        ElMessage.error(error.message);
      }
    }
  });
};
// 修改图标相关的代码
const iconDialogVisible = ref(false);
const icons = ref<any[]>([]);

onMounted(() => {
  fetchMenus();
  // 使用 markRaw 处理图标组件
  icons.value = Object.entries(ElementPlusIconsVue)
    .filter(([key]) => key !== "default")
    .map(([name, component]) => [name, markRaw(component)]);
});

// 修改图标选择处理函数
const handleSelectIcon = ([iconName]: [string, any]) => {
  form.icon = iconName;
  iconDialogVisible.value = false;
};

// 打开图标选择器
const openIconSelector = () => {
  iconDialogVisible.value = true;
};
// onMounted(fetchMenus);
</script>

<template>
  <el-card>
    <el-button type="primary" @click="handleAdd">新增菜单</el-button>

    <el-table
      :data="menuList"
      v-loading="loading"
      class="mt-[20px] w-full"
      :row-key="(row) => row.id"
      :tree-props="{ children: 'children' }"
      fit
    >
      <el-table-column prop="name" label="菜单/权限名称" />
      <el-table-column prop="path" label="路由路径/权限字段" />
      <el-table-column prop="redirect" label="重定向路径"  />
      <el-table-column prop="component" label="组件路径"  />
      <el-table-column prop="sort_order" label="排序" align="center" />
      <!-- <el-table-column prop="icon" label="图标">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column> -->
      <el-table-column label="是否隐藏" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template #default="{ row }">
          <!-- 添加子菜单按钮 -->
          <el-button size="small" type="primary" @click="handleAddSubMenu(row)"
            >添加子菜单</el-button
          >
          <!-- 添加按钮权限 -->
          <el-button
            size="small"
            type="primary"
            @click="handleAddButtonPermission(row)"
            >添加按钮权限</el-button
          >
          <el-button type="primary" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      v-model="dialogVisible"
    >
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item  v-if="form.type === 1" label="菜单名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-else  label="权限名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="图标" prop="icon">
          <div class="flex items-center gap-2">
            <el-input v-model="form.icon" readonly />
            <el-button @click="openIconSelector">选择图标</el-button>
            <el-icon v-if="form.icon" class="text-xl">
              <component :is="form.icon" />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="路由路径" prop="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item v-else label="权限字段" prop="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="重定向" prop="redirect">
          <el-input v-model="form.redirect" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="组件路径" prop="component">
          <el-input v-model="form.component" />
        </el-form-item>

        <!-- Use el-cascader for parent menu selection -->
        <el-form-item v-if="form.type === 1" label="父菜单" prop="parent_id">
          <el-cascader
            v-model="form.parent_id as number"
            :options="menuOptions"
            :props="props"
            placeholder="选择父菜单"
            clearable
            :expand-trigger="'hover'"
            :checkStrictly="true"
            @change="handleCascaderChange"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改图标选择弹窗的内容 -->
    <el-dialog title="选择图标" v-model="iconDialogVisible" width="800px">
      <div class="icon-grid">
        <div
          v-for="[iconName, comp] in icons"
          :key="iconName"
          class="icon-item"
          @click="handleSelectIcon([iconName, comp])"
        >
          <el-icon>
            <component :is="comp" />
          </el-icon>
          <span>{{ iconName }}</span>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>
<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  padding: 16px;
  max-height: 460px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 80px;
}

.icon-item:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
  color: #409eff;
}

.icon-item .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.icon-item span {
  font-size: 10px;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
