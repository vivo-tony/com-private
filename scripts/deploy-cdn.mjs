// CDN 发布脚本：收集聚合总包的 UMD 产物与聚合 CSS 到 cdn-output/<version>/，
// 生成 manifest.json，并打印上传命令（按你的 OSS/COS 替换）。
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const version = process.env.CDN_VERSION ?? '0.0.0'
const cdnBase = process.env.CDN_BASE ?? 'https://cdn.your-company.com/mas-center'
const outDir = resolve(root, 'cdn-output', version)
const componentsDist = resolve(root, 'packages/components-all/dist')

mkdirSync(outDir, { recursive: true })

// 只发聚合总包的 UMD + 聚合 CSS（React 由宿主另从 CDN 引）
const assets = [
  { src: 'index.umd.js', dst: 'components.index.umd.js' },
  { src: 'style.css', dst: 'components.style.css' },
]

const uploaded = []
for (const { src, dst } of assets) {
  const from = join(componentsDist, src)
  if (!existsSync(from)) {
    console.warn(`⚠️  缺少产物：${from}（先运行 pnpm build）`)
    continue
  }
  copyFileSync(from, join(outDir, dst))
  uploaded.push(dst)
}

const manifest = {
  version,
  cdnBase,
  files: uploaded.map((f) => `${cdnBase}/${version}/${f}`),
  globals: { components: 'MasComponents' },
  usage: {
    js: `${cdnBase}/${version}/components.index.umd.js`,
    css: `${cdnBase}/${version}/components.style.css`,
    global: 'MasComponents',
  },
}
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log(`\n已收集 ${uploaded.length} 个文件到 ${outDir}`)
console.log('上传（按你的 OSS/COS 替换命令）：')
console.log(`  ossutil cp -r ${outDir} oss://your-bucket/mas-center/${version}/`)
console.log('\n前端接入示例：')
console.log('  <script src="https://cdn/react.umd.js"></script>')
console.log('  <script src="https://cdn/react-dom.umd.js"></script>')
console.log(`  <link rel="stylesheet" href="${cdnBase}/${version}/components.style.css">`)
console.log(`  <script src="${cdnBase}/${version}/components.index.umd.js"></script>`)
console.log('  <script>const { Button } = window.MasComponents</script>')
