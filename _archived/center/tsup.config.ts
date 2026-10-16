import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // 总包只是 re-export，保持外部依赖不被内联
  dts: { respectExternal: true },
  clean: true,
  sourcemap: true,
  treeshake: true,
})
