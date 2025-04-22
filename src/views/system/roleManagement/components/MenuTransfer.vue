<template>
  <div class="flex">
    <!-- 左侧菜单树 -->
    <el-tree
      :data="menuTree"
      node-key="id"
      show-checkbox
      default-expand-all
      highlight-current
      :props="defaultProps"
      ref="treeRef"
      @check-change="updateSelected"
      check-strictly
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

interface MenuItem {
  id: number | string;
  name: string;
  parent_id?: number | null;
  children?: MenuItem[];
}

// 父组件传入的 proString
const props = defineProps<{
  allMenus: MenuItem[]; // 全部菜单（扁平结构）
  modelValue: number[]; // 绑定的选中菜单 ID 列表
}>();

// 子组件抛出更新事件String
const emit = defineEmits<{
  (e: "update:modelValue", val: number[]): void;
}>();

const treeRef = ref();
const defaultProps = { label: "name", children: "children" };

// 构建树结构
const menuTree = ref<MenuItem[]>([]);

// 更新选中 ID 列表
const updateSelected = () => {
  const nodes = treeRef.value.getCheckedNodes(false, true);
  const checkedIds = nodes.map((n: MenuItem) => String(n.id));

  const checkedSet = new Set(checkedIds);

  // 向上递归设置父节点为选中
  const checkParent = (node: MenuItem) => {
    if (node.parent_id != null) {
      const parentNode = treeRef.value.getNode(node.parent_id);
      if (parentNode && !checkedSet.has(String(parentNode.key))) {
        treeRef.value.setChecked(parentNode, true);
        checkedSet.add(String(parentNode.key));
        checkParent(parentNode.data); // 继续向上递归
      }
    }
  };

  nodes.forEach((node: MenuItem) => {
    checkParent(node);
  });

  // 最终再更新一次已勾选的 key（避免重复）
  const allChecked = treeRef.value.getCheckedNodes(false, true);
  emit(
    "update:modelValue",
    allChecked.map((n: MenuItem) => Number(n.id))
  );
};


// 构建树结构
const buildTree = (flatList: MenuItem[]): MenuItem[] => {
  const map = new Map<number, MenuItem>();
  const roots: MenuItem[] = [];

  flatList.forEach((item) => {
    map.set(item.id as number, { ...item, id: String(item.id), children: [] });
  });

  map.forEach((item) => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
};

// 递归获取树的所有节点ID
const getAllNodeIds = (tree: MenuItem[]): string[] => {
  let ids: string[] = [];
  tree.forEach((node) => {
    ids.push(String(node.id)); // 转为字符串
    if (node.children) {
      ids = ids.concat(getAllNodeIds(node.children));
    }
  });
  return ids;
};

// 监听 allMenus 更新
watch(
  () => props.allMenus,
  (newMenus) => {
    menuTree.value = buildTree(newMenus);
    nextTick(() => {
      if (
        treeRef.value &&
        props.modelValue?.length &&
        menuTree.value.length > 0
      ) {
        const checkedKeys = props.modelValue.map((id) => String(id));
        treeRef.value.setCheckedKeys(checkedKeys);  // 设置树的选中项
      }
    });
  },
  { immediate: true }
);

// 监听 modelValue 更新时回显
watch(
  () => props.modelValue,
  (newModelValue) => {
    nextTick(() => {
      if (!treeRef.value || menuTree.value.length === 0) return;
      // 统一转换为字符串
      const checkedKeys = newModelValue.map(String); 
      // 设置选中项，如果为空则清空
      treeRef.value.setCheckedKeys(checkedKeys.length ? checkedKeys : []);
    });
  },
  { immediate: true }  // 立即执行一次
);

</script>
