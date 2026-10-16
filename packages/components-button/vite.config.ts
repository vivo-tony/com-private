import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    // 类型打包成单文件 dist/index.d.ts
    dts({ tsconfigPath: './tsconfig.json', rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'style',
    },
    rollupOptions: {
      // React 与 @mas/shared 不打进包，由宿主项目解析
      external: ['react', 'react-dom', 'react/jsx-runtime', '@mas/shared'],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
