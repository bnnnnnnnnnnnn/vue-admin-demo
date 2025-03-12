import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from '@tailwindcss/vite'
// import { viteMockServe } from "vite-plugin-mock";  

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      VueDevTools(),
      tailwindcss(),
      // viteMockServe({
      //   // default
      //   mockPath: "mock",
      //   enable: command === "serve",
      // }),
    ],
    envDir: './', // 确保 Vite 读取根目录的 .env 文件
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    // scss 全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/assets/styles/variable.scss";',
        },
      },
    },
  };
});