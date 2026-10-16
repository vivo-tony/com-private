#!/usr/bin/env node
// 脚手架：生成独立组件包 / SDK 包
// 用法：
//   node scripts/create-package.mjs component table   -> packages/components-table
//   node scripts/create-package.mjs sdk auth           -> packages/sdk-auth

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [type, rawName] = process.argv.slice(2)

if (!type || !rawName) {
  console.error('用法: node scripts/create-package.mjs <component|sdk> <name>')
  process.exit(1)
}
if (type !== 'component' && type !== 'sdk') {
  console.error('type 只能是 component 或 sdk')
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]*$/.test(rawName)) {
  console.error('name 必须是小写 kebab-case，如 table、auth')
  process.exit(1)
}

const kebab = rawName
const pascal = kebab
  .split('-')
  .map((s) => s[0].toUpperCase() + s.slice(1))
  .join('')
const pkgName = type === 'component' ? `@mas/components-${kebab}` : `@mas/sdk-${kebab}`
const dirName = type === 'component' ? `components-${kebab}` : `sdk-${kebab}`
const dir = resolve(root, 'packages', dirName)

if (existsSync(dir)) {
  console.error(`已存在: ${dir}`)
  process.exit(1)
}

const files = type === 'component' ? componentFiles() : sdkFiles()

for (const [rel, content] of Object.entries(files)) {
  const p = resolve(dir, rel)
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, content)
}

console.log(`✅ 已生成 packages/${dirName}`)
console.log(`   pnpm --filter ${pkgName} dev   # 就地调试页`)
console.log(`   记得在 packages/${type === 'component' ? 'components' : 'sdk'}/src/index.ts 加一行：`)
console.log(`     export * from '${pkgName}'`)

function componentFiles() {
  return {
    'package.json': JSON.stringify(
      {
        name: pkgName,
        version: '0.0.0',
        description: `${pascal} 组件`,
        type: 'module',
        main: './dist/index.cjs',
        module: './dist/index.js',
        types: './dist/index.d.ts',
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' },
          './style.css': './dist/style.css',
        },
        sideEffects: ['**/*.css'],
        files: ['dist'],
        scripts: { build: 'vite build', dev: 'vite --config vite.demo.config.ts' },
        dependencies: { '@mas/shared': 'workspace:*' },
        peerDependencies: { react: '>=18', 'react-dom': '>=18' },
        publishConfig: { access: 'restricted' },
        devDependencies: {
          '@types/react': '^18.3.12',
          '@types/react-dom': '^18.3.1',
          '@vitejs/plugin-react': '^4.3.4',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          typescript: '^5.6.3',
          vite: '^6.0.7',
          'vite-plugin-dts': '^4.3.0',
        },
      },
      null,
      2,
    ) + '\n',
    'tsconfig.json': JSON.stringify(
      { extends: '../../tsconfig.base.json', compilerOptions: { rootDir: 'src', outDir: 'dist' }, include: ['src'] },
      null,
      2,
    ) + '\n',
    'vite.config.ts': `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.json', rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'style',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', '@mas/shared'] },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
`,
    'vite.demo.config.ts': `import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'dev',
  plugins: [react()],
  resolve: { alias: { '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)) } },
  server: { port: 5176 },
})
`,
    [`src/${pascal}.tsx`]: `import React from 'react'
import { cx } from '@mas/shared'
import './${kebab}.css'

export interface ${pascal}Props extends React.HTMLAttributes<HTMLDivElement> {}

export const ${pascal} = React.forwardRef<HTMLDivElement, ${pascal}Props>(
  ({ className, ...rest }, ref) => {
    return <div ref={ref} className={cx('mas-${kebab}', className)} {...rest} />
  },
)
${pascal}.displayName = '${pascal}'
`,
    [`src/${kebab}.css`]: `.mas-${kebab} {
  /* 样式约定：只写 var(--mas-*)，禁止硬编码色值/尺寸 */
  color: var(--mas-color-text);
}
`,
    'src/index.ts': `export * from './${pascal}'
`,
    'src/demo.tsx': `import { ${pascal} } from './${pascal}'

export default function ${pascal}Demo() {
  return <${pascal}>${pascal} demo</${pascal}>
}
`,
    'dev/index.html': `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${kebab} dev</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
`,
    'dev/main.tsx': `/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
// 就地调试时直连地基源码的 token 变量（否则 var(--mas-*) 未定义）
import '../../shared/src/tokens.css'

const demos = import.meta.glob('../src/**/demo.tsx', { eager: true })

function Gallery() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 720 }}>
      <h1>${kebab} dev</h1>
      {Object.entries(demos).map(([path, mod]) => {
        const Demo = (mod as { default: React.ComponentType }).default
        const name = path.replace('../src/', '').replace('/demo.tsx', '')
        return (
          <section key={path} style={{ margin: '16px 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>{name}</h3>
            <Demo />
          </section>
        )
      })}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Gallery />)
`,
  }
}

function sdkFiles() {
  return {
    'package.json': JSON.stringify(
      {
        name: pkgName,
        version: '0.0.0',
        description: `${pascal} SDK`,
        type: 'module',
        main: './dist/index.cjs',
        module: './dist/index.js',
        types: './dist/index.d.ts',
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js', require: './dist/index.cjs' },
        },
        sideEffects: false,
        files: ['dist'],
        scripts: { build: 'tsup', dev: 'vite --config vite.demo.config.ts' },
        dependencies: { '@mas/shared': 'workspace:*' },
        publishConfig: { access: 'restricted' },
        devDependencies: { tsup: '^8.3.5', typescript: '^5.6.3', vite: '^6.0.7' },
      },
      null,
      2,
    ) + '\n',
    'tsconfig.json': JSON.stringify(
      { extends: '../../tsconfig.base.json', compilerOptions: { rootDir: 'src', outDir: 'dist' }, include: ['src'] },
      null,
      2,
    ) + '\n',
    'tsup.config.ts': `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { respectExternal: true },
  clean: true,
  sourcemap: true,
  treeshake: true,
})
`,
    'vite.demo.config.ts': `import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'dev',
  resolve: { alias: { '@mas/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)) } },
  server: { port: 5176 },
})
`,
    'src/index.ts': `export function hello${pascal}(name: string): string {
  return \`hello \${name} from ${pkgName}\`
}
`,
    'dev/index.html': `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>${kebab} dev</title>
  </head>
  <body>
    <h1>${kebab} dev</h1>
    <pre id="out"></pre>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
`,
    'dev/main.ts': `import { hello${pascal} } from '../src'

document.getElementById('out')!.textContent = hello${pascal}('world')
`,
  }
}
