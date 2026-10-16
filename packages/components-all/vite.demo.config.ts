import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 聚合调试页：一个 dev server 渲染所有组件包的 demo，供视觉走查。
// @mas/shared 直连源码，改地基（token/工具）也即时热更。
export default defineConfig({
  root: 'dev',
  plugins: [react()],
  resolve: {
    alias: {
      '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
    },
  },
  server: { port: 5180 },
})
