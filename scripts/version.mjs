#!/usr/bin/env node
// 时间戳版本：把所有包版本统一设为当前时间（YYYY.M.D-HHmmss），
// 并把跨包 workspace:* 依赖改写为具体版本，方便按时间定位某次修改。
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packagesDir = resolve(root, 'packages')

const pad = (n) => String(n).padStart(2, '0')
function timestampVersion(d = new Date()) {
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

const version = timestampVersion()

const dirs = readdirSync(packagesDir).filter((n) => existsSync(resolve(packagesDir, n, 'package.json')))

for (const dir of dirs) {
  const file = resolve(packagesDir, dir, 'package.json')
  const pkg = JSON.parse(readFileSync(file, 'utf8'))
  pkg.version = version
  // 跨包依赖 workspace:* → 具体时间戳版本（npm 不认 workspace:*）
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (!pkg[field]) continue
    for (const [k, v] of Object.entries(pkg[field])) {
      if (v === 'workspace:*') pkg[field][k] = version
    }
  }
  writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
}

console.log(`✅ 所有包版本已设为 ${version}`)
console.log('   下一步：git add -A && git commit -m "release: v${version}"，再 pnpm release 发布')
