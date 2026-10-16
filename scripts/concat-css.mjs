#!/usr/bin/env node
// 聚合组件 CSS：按顺序拼接 shared 的 tokens.css + 各 components-* 包的 style.css，
// 输出到 packages/components/dist/style.css（权威聚合样式，含 :root token 定义）。
// 依赖 shared 与各组件包已构建（pnpm build 的拓扑顺序保证）。
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packagesDir = resolve(root, 'packages')
const outDir = resolve(packagesDir, 'components-all/dist')

const chunks = []

// 1) 设计 token（:root 变量）放在最前，保证组件样式能取到变量
const tokensCss = resolve(packagesDir, 'shared/dist/tokens.css')
if (existsSync(tokensCss)) chunks.push(readFileSync(tokensCss, 'utf8'))

// 2) 各组件包样式，按目录名排序保证顺序稳定
for (const name of readdirSync(packagesDir).sort()) {
  if (!name.startsWith('components-') || name === 'components-all') continue
  const css = resolve(packagesDir, name, 'dist/style.css')
  if (existsSync(css)) chunks.push(readFileSync(css, 'utf8'))
}

mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'style.css'), chunks.join('\n'))
console.log(`✅ 已聚合 ${chunks.length} 份 CSS 到 packages/components-all/dist/style.css`)
