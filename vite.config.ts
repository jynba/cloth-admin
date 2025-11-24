/*
 * @Author: wangch wangch@motern.com
 * @Date: 2025-05-09 17:15:03
 * @LastEditors: xujiayu
 * @LastEditTime: 2025-11-24 16:44:12
 * @FilePath: \picture_admin\vite.config.ts
 * @Description: vite配置
 */

import { resolve } from 'path';
import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import dayjs from 'dayjs';

import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import { createProxy } from './build/vite/proxy';
import pkg from './package.json';

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const isBuild = command === 'build';
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '#': pathResolve('types'),
        '@utils': pathResolve('src/utils'),
      },
    },
    // 定义全局常量
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    build: {
      //浏览器兼容性  "esnext"|"modules"
      target: 'modules', // 浏览器兼容性
      // boolean | 'terser' | 'esbuild'
      // 设置false表示禁用最小化混淆
      minify: 'terser', // 指定混淆器 terser构建文件体积更小
      outDir: OUTPUT_DIR, // 打包文件存放目录
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      reportCompressedSize: false, // 取消计算文件大小，加快打包速度
      chunkSizeWarningLimit: 2000, //chunk 大小警告的限制
    },

    // 全局css
    css: {
      preprocessorOptions: {
        scss: {
          // 全局的scss
          additionalData: `@use "./src/styles/var.scss" as *;`,
        },
      },
    },

    plugins: createVitePlugins(viteEnv, isBuild),

    server: {
      host: true, //'0.0.0.0'
      port: VITE_PORT,
      open: true,
      base: './ ', //生产环境路径
      proxy: {
        '^/api/v1': {
          target: 'http://123.57.129.74:10086', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        },
      },
    },
  };
};
