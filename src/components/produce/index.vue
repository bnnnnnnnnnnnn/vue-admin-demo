<template>
  <div class="p-6">
    <!-- 搜索与操作栏 -->
    <div class="flex items-center gap-4 mb-6">
      <el-input
        v-model="search"
        placeholder="搜索产品名称、型号..."
        :prefix-icon="Search"
        class="w-96"
      />
      <el-button type="primary" class="ml-auto">
        <el-icon><Download /></el-icon>
        <span>批量下载</span>
      </el-button>
      <el-button type="primary" @click="openUpload">
        <el-icon><UploadFilled /></el-icon>
        <span>批量上传</span>
      </el-button>
    </div>

    <!-- 分类标签 -->
    <div class="flex gap-4 mb-6">
      <el-tag
        v-for="tab in tabs"
        :key="tab"
        :type="activeTab === tab ? 'primary' : 'info'"
        @click="activeTab = tab"
        effect="dark"
        class="cursor-pointer"
      >
        {{ tab }}
      </el-tag>
    </div>

    <!-- 资源卡片 -->
    <div class="grid grid-cols-6 gap-6">
      <div
        v-for="item in filteredResources"
        :key="item.name"
        class="rounded-xl bg-white shadow p-4 hover:shadow-lg transition cursor-pointer"
      >
        <div
          class="aspect-[4/3] mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
        >
          <template v-if="item.preview === 'image'">
            <img :src="item.cover" class="h-full object-cover" />
          </template>
          <template v-else-if="item.preview === 'video'">
            <div
              class="text-5xl text-white bg-gray-800 w-full h-full flex items-center justify-center"
            >
              ▶️
            </div>
          </template>
          <template v-else-if="item.preview === 'pdf'">
            <!-- <img src="/pdf-icon.png" class="h-16" /> -->
          </template>
          <template v-else-if="item.preview === 'zip'">
            <div class="text-4xl text-blue-500">📦</div>
          </template>
        </div>
        <div class="font-medium text-sm mb-1 truncate">{{ item.name }}</div>
        <div class="text-xs text-gray-500">
          {{ item.type }} · {{ item.size }}
        </div>
      </div>
    </div>

    <!-- 上传弹窗组件 -->
    <UploadDialog ref="uploadDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Download, UploadFilled, Search } from "@element-plus/icons-vue";
import UploadDialog from "@/components/uploadFile/index.vue";

const search = ref("");
const activeTab = ref("全部");
const tabs = ["全部", "图片素材", "产品视频", "技术手册", "3D 模型"];

const uploadDialogRef = ref<InstanceType<typeof UploadDialog> | null>(null);

const openUpload = () => {
  if (uploadDialogRef.value) {
    uploadDialogRef.value.open();
  } else {
    console.error("uploadDialogRef 尚未挂载");
  }
};

const resources = [
  {
    name: "玄冰 400 散热器产品图",
    preview: "image",
    type: "JPG",
    size: "2.5MB",
    cover: "/images/p1.jpg",
    tab: "图片素材",
  },
  {
    name: "海王星 240 水冷散热器图集",
    preview: "image",
    type: "JPG",
    size: "3.8MB",
    cover: "/images/p2.jpg",
    tab: "图片素材",
  },
  {
    name: "产品安装教程视频",
    preview: "video",
    type: "MP4",
    size: "58MB",
    tab: "产品视频",
  },
  {
    name: "技术规格说明书",
    preview: "pdf",
    type: "PDF",
    size: "1.2MB",
    tab: "技术手册",
  },
  {
    name: "幻彩 RGB 风扇产品图",
    preview: "image",
    type: "JPG",
    size: "1.8MB",
    cover: "/images/p3.jpg",
    tab: "图片素材",
  },
  {
    name: "散热器 3D 模型文件",
    preview: "zip",
    type: "ZIP",
    size: "25MB",
    tab: "3D 模型",
  },
];

const filteredResources = computed(() => {
  return resources.filter((r) => {
    const matchTab = activeTab.value === "全部" || r.tab === activeTab.value;
    const matchSearch = r.name.includes(search.value);
    return matchTab && matchSearch;
  });
});
</script>

<style scoped>
.el-tag {
  user-select: none;
}
</style>
