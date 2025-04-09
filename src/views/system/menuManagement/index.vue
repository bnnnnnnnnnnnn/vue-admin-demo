<script setup lang="ts" name="menu">
import { ref, reactive, onMounted } from "vue";
import type {MenuItem} from '@/api/system/type'
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
const menuList = ref<MenuItem[]>([]);
const menuOptions = ref<MenuItem[]>([]); // Holds the menu options for cascading
const formRef = ref<unknown>();
const loading = ref<Boolean>(false);
const form = reactive<MenuItem>({
  id: null,
  name: "",
  path: "",
  redirect: "",
  component: "",
  icon: "",
  parent_id: null,
  hidden: true,
  sort_order: 0,
});
const dialogVisible = ref(false);
const isEdit = ref(false);

// 格式化菜单树形数据
const formatMenus = (menus: MenuItem[]) => {
  const map: { [key: number]: MenuItem } = {};
  const result: MenuItem[] = [];
  menus.forEach((menu) => {
    map[menu.id] = menu;
    menu.children = [];
  });

  menus.forEach((menu) => {
    if (menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children?.push(map[menu.id]);
    } else {
      result.push(map[menu.id]);
    }
  });
  return result;
};

// 过滤掉第三层的数据
const filterMenuOptions = (menus: MenuItem[]) => {
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
  Object.assign(form, {
    id: 0,
    name: "",
    path: "",
    redirect: "",
    component: "",
    icon: "",
    parent_id: null,
    hidden: true,
    sort_order: 0,
  });
  dialogVisible.value = true;
};

// 编辑菜单
const handleEdit = (item: MenuItem) => {
  isEdit.value = true;
  Object.assign(form, item);
  dialogVisible.value = true;
};

const fetchMenus = async () => {
  try {
    loading.value=true // 加載中
    const data = await fetchMenusApi();
    menuList.value = formatMenus(data);
    menuOptions.value = filterMenuOptions(data);
  } catch (error:any) {
    ElMessage.error(error.message);
  }finally{
    loading.value=false
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteMenuApi(id);
    menuList.value = menuList.value.filter((menu) => menu.id !== id);
    ElMessage.success("删除成功");
  } catch (error:any) {
    ElMessage.error(error.message);
  }
};

const handleStatusChange = async (row: MenuItem) => {
  try {
    await updateMenuStatusApi(row.id as number, row.hidden);
  } catch (error:any) {
    ElMessage.error(error.message);
  }
};

const handleSortChange = async (row: MenuItem) => {
  try {
    await updateMenuSortOrderApi(row.id as number, row.sort_order);
  } catch (error:any) {
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
      } catch (error:any) {
        ElMessage.error(error.message);
      }
    }
  });
};
onMounted(fetchMenus);
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
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="redirect" label="重定向路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="sort_order" label="排序" />
      <el-table-column prop="icon" label="图标">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏">
        <template #default="{ row }">
          <el-switch
            v-model="row.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" :fit="true">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      v-model="dialogVisible"
    >
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="form.redirect" />
        </el-form-item>
        <el-form-item label="组件路径" prop="path">
          <el-input v-model="form.component" />
        </el-form-item>

        <!-- Use el-cascader for parent menu selection -->
        <el-form-item label="父菜单" prop="parent_id">
          <el-cascader
            v-model="form.parent_id"
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
  </el-card>
</template>


