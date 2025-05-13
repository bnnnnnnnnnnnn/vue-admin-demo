<template>
  <el-dialog v-model="visible" title="上传资源" width="50%">
    <el-upload
      class="upload-demo"
      drag
      :multiple="true"
      :http-request="customUpload"
      :before-upload="beforeUpload"
      :show-file-list="true"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import { recordUpload, checkFileExistsByHash } from "@/api/upload/index.ts";

const visible = ref(false);
defineExpose({ open: () => (visible.value = true) });

// const ossClient = new OSS({
//   region: 'oss-cn-shenzhen',
//   bucket: "pccooler-zn",
//   accessKeyId: "<YourAccessKeyId>",// 本地开发环境用
//   accessKeySecret: "<YourAccessKeySecret>",// 本地开发环境用
 
// });
const isProd = import.meta.env.VITE_APP_ENV === 'production'

const ossClient = new OSS({
  region: import.meta.env.VITE_OSS_REGION,  // 使用环境变量配置区域
  bucket: import.meta.env.VITE_OSS_BUCKET,  // 使用环境变量配置桶名
  endpoint: 'https://oss-cn-shenzhen.aliyuncs.com',
  ...(isProd
    ? {}  // 生产环境使用 ECS 角色，不需要显式配置 AK
    : {
        accessKeyId: import.meta.env.VITE_OSS_AK_ID,
        accessKeySecret: import.meta.env.VITE_OSS_AK_SECRET,
      }),
})

const getFileHash = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const spark = new SparkMD5();
      spark.appendBinary(e.target.result);
      resolve(spark.end());
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

const beforeUpload = async (file) => {
  const hash = await getFileHash(file);
  file.hash = hash;
  file.resourceName = file.name.replace(/\.[^/.]+$/, "");
  return true;
};

const customUpload = async ({ file }) => {
  const existing = await checkFileExistsByHash(file.hash);
  if (existing) {
    console.log("已存在，跳过上传", existing.url);
    return;
  }

  const ext = file.name.split(".").pop();
  const objectKey = `${file.resourceName}-${file.hash}.${ext}`;
  const result = await ossClient.multipartUpload(objectKey, file);
  const fileUrl = result.res.requestUrls[0].split("?")[0];

  await recordUpload({
    name: file.resourceName,
    url: fileUrl,
    type: file.type,
    md5: file.hash,
  });

  console.log("上传成功并记录入库");
};
</script>

<style scoped>
.upload-demo {
  width: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  padding: 40px 0;
  text-align: center;
}
</style>
