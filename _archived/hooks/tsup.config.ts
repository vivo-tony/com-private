import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { respectExternal: true },
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['react'],
})
