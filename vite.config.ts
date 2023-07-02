/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import viteDevConfig from "./vite.dev.config";
import viteProdConfig from "./vite.prod.config";


// vite 基础配置 无论开发环境和生产环境都用的
const baseConfig = defineConfig({
  base: '/',
  resolve: {
    alias: {// 别名配置
      "@": "/src",
      "@static": "/src/static"
    }
  },
  plugins: [uni()],
  optimizeDeps: {
    include: ['@dcloudio/uni-ui']
  }
});

// 组合成配置
const envResolver = {
  production: () => {
    console.log('---生产环境---');
    return Object.assign({}, baseConfig, viteProdConfig);
  },
  development: () => {
    console.log("---开发环境---");
    return Object.assign({}, baseConfig, viteDevConfig);
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }): any => {
    // console.log('🎈 mode>>>', mode);// "development"|"production"
    return envResolver[mode as "development" | "production"]();
  }
);
