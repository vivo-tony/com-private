import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'dev',
  resolve: { alias: { '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)) } },
  server: { port: 5175 },
})
