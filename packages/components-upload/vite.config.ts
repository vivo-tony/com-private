import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// 双入口：index（满血版 = 方法 + UI）、sdk（仅上传方法，无 React）
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.json', rollupTypes: false })],
  build: {
    lib: {
      entry: { index: 'src/index.ts', sdk: 'src/sdk.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
      cssFileName: 'style',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', '@mas/shared'] },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
