//生产环境的vite配置文件
import {defineConfig} from 'vite'

export default defineConfig({
  esbuild: {
    // minifyWhitespace: false,  //禁用某些esbuild最小化优化
    drop: ["console", "debugger"]    //去除控制台打印
  },
  build: {
    assetsInlineLimit: 5000,//小于5k转base64
    minify: true,//esbuild精简代码
    rollupOptions: {
      output: {
        compact: true
      }
    },
  },
})
