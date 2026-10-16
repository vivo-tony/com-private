import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 包内调试页：@mas/shared 直连源码，改地基也即时热更
export default defineConfig({
  root: 'dev',
  plugins: [react()],
  resolve: {
    alias: {
      '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
    },
  },
  server: { port: 5174 },
})
