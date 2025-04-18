# 🚀 vue3-large-file-uploader

一个基于 **Vue 3 + TypeScript + Pinia + Supabase + 阿里云 OSS** 实现的大文件上传和下载项目，支持分片上传、断点续传、秒传功能，界面清爽、体验流畅。

![upload-flow](./docs/upload-flow.png)

---

## ✨ 项目亮点

- 💾 支持大文件分片上传（阿里云 OSS Multipart Upload）
- 🔄 支持断点续传（支持网络中断自动恢复）
- ⚡ 支持秒传（基于文件 MD5 校验）
- 👥 用户登录/鉴权（Supabase 提供后端服务）
- 📦 使用 Pinia 管理上传状态，逻辑清晰易维护
- 🎨 基于 Element Plus UI，交互体验流畅

---

## 🛠 技术栈

| 技术         | 说明                        |
| ------------ | --------------------------- |
| Vue 3        | 前端框架                    |
| TypeScript   | 静态类型支持                |
| Pinia        | 状态管理                    |
| Supabase     | 后端服务（Auth + DB）       |
| 阿里云 OSS    | 对象存储服务，支持分片上传   |
| Spark-md5    | 文件哈希生成，用于秒传判断   |
| ali-oss SDK  | 阿里云官方 JS SDK           |

---

## 📁 目录结构

```bash
vue3-large-file-uploader/
├── src/
│   ├── components/       # 上传组件
│   ├── store/            # Pinia 状态
│   ├── utils/            # 工具函数（如分片、hash）
│   ├── views/            # 页面组件
│   └── App.vue
├── docs/
│   └── upload-flow.png   # 流程图文档
├── public/
├── README.md
└── ...


📚 未来计划（TODO）
 多文件批量上传

 上传中暂停/恢复功能

 上传任务持久化存储（IndexedDB）

 文件预览（图片/视频）

 上传历史记录管理页
