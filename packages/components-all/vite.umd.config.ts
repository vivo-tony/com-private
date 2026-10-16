import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 聚合 UMD 构建：产出单文件 dist/index.umd.js，暴露 window.MasComponents。
// - React/ReactDOM 走 external + globals（宿主用 <script> 引入 react.umd.js）
// - @mas/shared 与各组件包直接打进包（alias 到源码，用 classic runtime 编译 JSX，
//   避免 automatic runtime 的 react/jsx-runtime 全局映射问题）
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  resolve: {
    alias: {
      '@mas/components-button': fileURLToPath(new URL('../components-button/src/index.ts', import.meta.url)),
      '@mas/components-upload': fileURLToPath(new URL('../components-upload/src/index.ts', import.meta.url)),
      '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MasComponents',
      formats: ['umd'],
      fileName: () => 'index.umd.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
