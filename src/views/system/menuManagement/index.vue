<script setup lang="ts" name="menu">
import type { MenuItem, menus } from '@/api/system/type'
import type { FormInstance } from 'element-plus'
import {
  addMenuApi,
  deleteMenuApi,
  fetchMenusApi,
  updateMenuApi,
  updateMenuStatusApi,
} from '@/api/system/menu'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {
  ElButton,
  ElCascader,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElSwitch,
  ElTable,
  ElTableColumn,
} from 'element-plus'

import { markRaw, onMounted, reactive, ref } from 'vue'

const props = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
}
const menuList = ref<menus[]>([])
const menuOptions = ref<menus[]>([]) // Holds the menu options for cascading
const formRef = ref<FormInstance>()
const loading = ref<boolean>(false)

const dialogVisible = ref(false)
const isEdit = ref(false)
function createDefaultForm(): MenuItem {
  return {
    id: null,
    type: 1,
    name: '',
    path: '',
    redirect: '',
    component: '',
    icon: '',
    parent_id: null,
    hidden: false,
    sort_order: 0,
  }
}
const form = reactive<MenuItem>(createDefaultForm())
// 重置表单
function resetForm() {
  Object.assign(form, createDefaultForm())
}

// 格式化菜单树形数据
function formatMenus(menus: menus[]) {
  const map: { [key: number]: menus } = {}
  const result: menus[] = []
  menus.forEach((menu) => {
    if (menu.id !== null) {
      // 确保 menu.id 不为 null
      map[menu.id as number] = menu
      menu.children = []
    }
  })

  menus.forEach((menu) => {
    if (menu.id && menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children?.push(map[menu.id])
    }
    else if (menu.id !== null) {
      result.push(map[menu.id as number])
    }
  })
  return result
}

// 过滤掉第三层的数据
function filterMenuOptions(menus: menus[]) {
  // 深拷贝
  const menusCopy = JSON.parse(JSON.stringify(menus))
  const res = formatMenus(menusCopy)
  return res.map((item) => {
    // 仅保留子菜单的第一层和第二层，不保留第三层
    if (item.children) {
      item.children = item.children.map((subItem) => {
        // 如果存在第三层，移除它
        if (subItem.children) {
          delete subItem.children
        }
        return subItem
      })
    }
    return item
  })
}

// 选中父菜单
function handleCascaderChange(value: any) {
  if (value) {
    // 判断值的层级，确保只保留前两级
    form.parent_id = value.length > 1 ? value[1] : value[0] // 保证返回的是前两层的值
  }
}

// 新增菜单
function handleAdd() {
  isEdit.value = false
  resetForm()
  delete form.id
  dialogVisible.value = true
}

// 编辑菜单
function handleEdit(item: menus) {
  isEdit.value = true
  // 去掉children
  delete item.children
  Object.assign(form, item)
  dialogVisible.value = true
}
// 添加子菜单
function handleAddSubMenu(parent: menus) {
  isEdit.value = false
  resetForm()
  delete form.id
  form.parent_id = parent.id as number
  dialogVisible.value = true
}
// 添加按钮权限
function handleAddButtonPermission(parent: menus) {
  isEdit.value = false
  resetForm()
  delete form.id
  form.type = 2
  form.parent_id = parent.id as number
  dialogVisible.value = true
}

async function fetchMenus() {
  try {
    loading.value = true // 加載中
    const data = await fetchMenusApi()
    menuList.value = formatMenus(data)
    menuOptions.value = filterMenuOptions(data)
  }
  catch (error: any) {
    ElMessage.error(error.message)
  }
  finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      '确定要删除这个菜单吗？删除后不可恢复哦！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    // 用户点击确定后才会执行下面的删除操作
    await deleteMenuApi(id)
    // menuList.value = menuList.value.filter((menu) => menu.id !== id);
    await fetchMenus()
    ElMessage.success('删除成功')
  }
  catch (error: any) {
    // 如果是取消确认，不提示错误
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

async function handleStatusChange(row: menus) {
  try {
    await updateMenuStatusApi(row.id as number, row.hidden)
  }
  catch (error: any) {
    ElMessage.error(error.message)
  }
};

// async function handleSortChange(row: menus) {
//   try {
//     if (row.id) {
//       await updateMenuSortOrderApi(row.id, row.sort_order as number)
//     }
//   }
//   catch (error: any) {
//     ElMessage.error(error.message)
//   }
// }

async function handleSubmit() {
  // formRef.value?.validate(async (valid) => {
  //   if (valid) {
  try {
    if (isEdit.value) {
      await updateMenuApi(form)
      ElMessage.success('编辑成功')
    }
    else {
      await addMenuApi(form)
      ElMessage.success('添加成功')
    }
    await fetchMenus()
    dialogVisible.value = false
  }
  catch (error: any) {
    ElMessage.error(error.message)
  }
}
// });
// };
// 修改图标相关的代码
const iconDialogVisible = ref(false)
const icons = ref<any[]>([])

onMounted(() => {
  fetchMenus()
  // 使用 markRaw 处理图标组件
  icons.value = Object.entries(ElementPlusIconsVue)
    .filter(([key]) => key !== 'default')
    .map(([name, component]) => [name, markRaw(component)])
})

// 修改图标选择处理函数
function handleSelectIcon([iconName]: [string, any]) {
  form.icon = iconName
  iconDialogVisible.value = false
}

// 打开图标选择器
function openIconSelector() {
  iconDialogVisible.value = true
}
// onMounted(fetchMenus);
</script>

<template>
  <el-card>
    <ElButton type="primary" @click="handleAdd">
      新增菜单
    </ElButton>

    <ElTable
      v-loading="loading"
      :data="menuList"
      class="mt-[20px] w-full"
      :row-key="(row) => row.id"
      :tree-props="{ children: 'children' }"
      fit
    >
      <ElTableColumn prop="name" label="菜单/权限名称" />
      <ElTableColumn prop="path" label="路由路径/权限字段" />
      <ElTableColumn prop="redirect" label="重定向路径" />
      <ElTableColumn prop="component" label="组件路径" />
      <ElTableColumn prop="sort_order" label="排序" align="center" />
      <!-- <el-table-column prop="icon" label="图标">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column> -->
      <ElTableColumn label="是否隐藏" align="center">
        <template #default="{ row }">
          <ElSwitch
            v-model="row.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" width="400">
        <template #default="{ row }">
          <!-- 添加子菜单按钮 -->
          <ElButton size="small" type="primary" @click="handleAddSubMenu(row)">
            添加子菜单
          </ElButton>
          <!-- 添加按钮权限 -->
          <ElButton
            size="small"
            type="primary"
            @click="handleAddButtonPermission(row)"
          >
            添加按钮权限
          </ElButton>
          <ElButton type="primary" size="small" @click="handleEdit(row)">
            编辑
          </ElButton>
          <ElButton size="small" type="danger" @click="handleDelete(row.id)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑' : '新增'"
    >
      <ElForm ref="formRef" :model="form" label-width="80px">
        <ElFormItem v-if="form.type === 1" label="菜单名称" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
        <ElFormItem v-else label="权限名称" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
        <ElFormItem v-if="form.type === 1" label="图标" prop="icon">
          <div class="flex items-center gap-2">
            <ElInput v-model="form.icon" readonly />
            <ElButton @click="openIconSelector">
              选择图标
            </ElButton>
            <el-icon v-if="form.icon" class="text-xl">
              <component :is="form.icon" />
            </el-icon>
          </div>
        </ElFormItem>
        <ElFormItem v-if="form.type === 1" label="路由路径" prop="path">
          <ElInput v-model="form.path" />
        </ElFormItem>
        <ElFormItem v-else label="权限字段" prop="path">
          <ElInput v-model="form.path" />
        </ElFormItem>
        <ElFormItem v-if="form.type === 1" label="重定向" prop="redirect">
          <ElInput v-model="form.redirect" />
        </ElFormItem>
        <ElFormItem v-if="form.type === 1" label="组件路径" prop="component">
          <ElInput v-model="form.component" />
        </ElFormItem>

        <!-- Use el-cascader for parent menu selection -->
        <ElFormItem v-if="form.type === 1" label="父菜单" prop="parent_id">
          <ElCascader
            v-model="form.parent_id as number"
            :options="menuOptions"
            :props="props"
            placeholder="选择父菜单"
            clearable
            expand-trigger="hover"
            :check-strictly="true"
            @change="handleCascaderChange"
          />
        </ElFormItem>

        <ElFormItem label="排序" prop="sort_order">
          <ElInputNumber v-model="form.sort_order" :min="0" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="handleSubmit">
          确认
        </ElButton>
      </template>
    </ElDialog>

    <!-- 修改图标选择弹窗的内容 -->
    <ElDialog v-model="iconDialogVisible" title="选择图标" width="800px">
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
    </ElDialog>
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
