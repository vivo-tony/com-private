#!/usr/bin/env node
// 从 @mas/shared 的构建产物读取 tokens，生成 CSS 变量文件：
//   - dist/tokens.css  发布用（exports + 聚合 CSS）
//   - src/tokens.css   就地 dev 用（dev 页直连源码，无需先构建）
// 必须在 shared 的 `tsup` 之后运行（build 脚本已保证顺序）。
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sharedDir = resolve(root, 'packages/shared')
const { tokens } = await import(pathToFileURL(resolve(sharedDir, 'dist/index.js')).href)

/** 把 camelCase 转成 kebab-case：primaryHover -> primary-hover */
function kebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** 递归展平 token 树为 CSS 变量行，如 --mas-color-primary-hover: #4096ff; */
function flatten(prefix, value, out) {
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      flatten(prefix ? `${prefix}-${kebab(k)}` : kebab(k), v, out)
    }
  } else {
    out.push(`  --mas-${prefix}: ${value};`)
  }
}

const vars = []
flatten('', tokens, vars)

const css = `/* 自动生成，勿手改：来源 packages/shared/src/tokens.ts */\n:root {\n${vars.join('\n')}\n}\n`

mkdirSync(resolve(sharedDir, 'dist'), { recursive: true })
writeFileSync(resolve(sharedDir, 'dist/tokens.css'), css)
writeFileSync(resolve(sharedDir, 'src/tokens.css'), css)
console.log(`✅ 已生成 tokens.css（${vars.length} 个变量）→ dist/ 与 src/`)
