# mas-center

「一组件一包」的组件库 monorepo：每个组件 / SDK 模块都是独立 npm 包，独立开发、独立构建、独立版本、独立发布，研发互不干扰。

## 目录结构

```
packages/
├── shared/                @mas/shared              公共地基（设计 token / 通用工具 / 类型）
├── components-button/     @mas/components-button   独立组件包（就地 demo + dev 页）
├── sdk-request/           @mas/sdk-request         独立 SDK 包（就地 dev 页）
├── components-all/        @mas/components-all   组件聚合总包（re-export 所有 @mas/components-*）
└── sdk/                   @mas/sdk                  SDK 聚合总包（re-export 所有 @mas/sdk-*）

scripts/
├── create-package.mjs     脚手架：pnpm new component table / pnpm new sdk auth
```

依赖方向：`@mas/shared ← 各组件包 / 各 SDK 包 ← 聚合总包`

## 每个包独立开发（核心特性）

一个包一个 dev 页，就地调试，只加载自己的代码：

```bash
pnpm dev:button        # @mas/components-button → http://localhost:5174
pnpm dev:components-all    # 全组件聚合调试页     → http://localhost:5180
pnpm dev:sdk-request   # @mas/sdk-request      → http://localhost:5175
```

写组件时，demo 就放在组件旁边（`src/Button/demo.tsx`），dev 页用 `import.meta.glob` 自动收集渲染，**无需注册、无需切目录**。`pnpm dev:components-all` 会一次起一个页、渲染所有组件包的 demo，供视觉走查。

## 新增一个包

```bash
pnpm new component table   # 生成 packages/components-table
pnpm new sdk auth          # 生成 packages/sdk-auth
```

生成后在对应总包 `packages/components-all/src/index.ts`（或 `sdk/src/index.ts`）加一行 re-export。

## 构建 / 发布

```bash
pnpm build     # 按拓扑顺序构建所有包 → 各包 dist/
pnpm changeset # 记录变更 → pnpm version → pnpm release 发布私有源
```

## 引用方式

```ts
// 单包引用（按需）
import { Button } from '@mas/components-button'
import '@mas/components-button/style.css'
import { createClient } from '@mas/sdk-request'

// 总包引用（一键装全部）
import { Button } from '@mas/components-all'
import { createClient } from '@mas/sdk'
```

## 关键约定

- 每个组件包 `sideEffects: ["**/*.css"]`，其它包 `sideEffects: false`，保证 tree-shaking。
- React/ReactDOM 始终是 `peerDependencies`；`@mas/shared` 是 `dependencies`，不打进各包产物。
- 跨包引用用 `workspace:*`，发布时 changesets 自动替换成真实版本。
- 各包 dev 页通过 alias 把 `@mas/shared` 直连源码，改地基也即时热更。
