<template>
  <div class="menu-manage">
    <el-button type="primary" @click="handleAdd">新增菜单</el-button>

    <el-table
      :data="menuList"
      style="width: 100%; margin-top: 20px"
      :row-key="(row) => row.id"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" width="300" />
      <el-table-column prop="path" label="路径" width="200" />
      <el-table-column prop="sort_order" label="排序" width="100" />
      <el-table-column prop="icon" label="图标" width="200">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏" width="120">
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
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
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
        <el-form-item label="路由路径" prop="path">
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
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
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
// import { FormInstance } from "element-plus";
import supabase from "@/services/supabase";

interface MenuItem {
  id: number | null;
  name: string;
  path: string;
  component: string;
  icon?: string;
  parent_id?: number | null;
  hidden: boolean;
  sort_order: number;
  children?: MenuItem[];
}

const props = { value: 'id', label: 'name', children: 'children', checkStrictly: true, }
const menuList = ref<MenuItem[]>([]);
const menuOptions = ref<MenuItem[]>([]); // Holds the menu options for cascading
const formRef = ref<unknown>();
const form = reactive<MenuItem>({
  id: null,
  name: "",
  path: "",
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

// 获取菜单列表
const fetchMenus = async () => {
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    ElMessage.error("加载菜单失败");
  } else {
    menuList.value = formatMenus(data);
    menuOptions.value = filterMenuOptions(data); //
  }
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

// 删除菜单
const handleDelete = async (id: number) => {
  ElMessageBox.confirm("确定删除该菜单？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const { error } = await supabase.from("menus").delete().match({ id });
    if (error) {
      ElMessage.error("删除失败");
    } else {
      menuList.value = menuList.value.filter((menu) => menu.id !== id);
      ElMessage.success("删除成功");
    }
  });
};

// 更新菜单状态
const handleStatusChange = async (row: MenuItem) => {
  const { error } = await supabase
    .from("menus")
    .update({ hidden: row.hidden }) // 修改字段名
    .match({ id: row.id });

  if (error) {
    ElMessage.error("更新菜单隐藏状态失败"); // 修改错误提示信息
  }
};

// 更新菜单排序
const handleSortChange = async (row: MenuItem) => {
  const { error } = await supabase
    .from("menus")
    .update({ sort_order: row.sort_order })
    .match({ id: row.id });
  if (error) {
    ElMessage.error("更新排序失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        const { error } = await supabase
          .from("menus")
          .update({
            name: form.name,
            path: form.path,
            icon: form.icon,
            parent_id: form.parent_id,
            sort_order: form.sort_order,
          })
          .match({ id: form.id });

        if (error) {
          ElMessage.error("编辑失败");
        } else {
          await fetchMenus();
          dialogVisible.value = false;
          ElMessage.success("编辑成功");
        }
      } else {
        const { error } = await supabase.from("menus").insert([
          {
            name: form.name,
            path: form.path,
            icon: form.icon,
            parent_id: form.parent_id,
            sort_order: form.sort_order,
          },
        ]);

        if (error) {
          ElMessage.error("添加失败");
        } else {
          await fetchMenus();
          dialogVisible.value = false;
          ElMessage.success("添加成功");
        }
      }
    }
  });
};

onMounted(fetchMenus);
</script>

<style scoped lang="scss">
.menu-manage {
  padding: 20px;
  .el-button {
    margin-bottom: 10px;
  }
}
</style>
