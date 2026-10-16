# 组件开发规范

> 目标：让 10 个以内的组件统一结构、统一 API、统一样式，方便管理、方便接入。
> 核心约束：**不重构已上生产的组件代码**，迁入时只做「对齐规范」的最小改动。

## 目录 / 包命名

- 一个组件一个 npm 包：`@mas/components-<kebab>`，目录 `packages/components-<kebab>`。
- 聚合总包 `@mas/components-all` 只做 re-export，不写业务逻辑。
- 公共地基 `@mas/shared` 放 token / 通用工具 / 类型，组件不要重复造。

## 组件 API 约定

1. 用 `React.forwardRef` 暴露 ref，并设 `displayName`。
2. 继承对应原生属性类型（`React.ButtonHTMLAttributes<HTMLButtonElement>`、`React.HTMLAttributes<HTMLDivElement>` 等），保证 `className`、`style`、事件透传。
3. 外观用受控联合类型 `variant` / `size` 并给默认值；禁止散落布尔 props（如 `primary`、`danger`）。
4. className 合并用 `cx`（来自 `@mas/shared`），组件自身类名放最前。

## 样式约定（BEM + token）

1. 类名前缀统一 `mas-`，用 BEM：块 `mas-btn`、修饰符 `mas-btn--primary`。
2. 颜色 / 圆角 / 间距 / 字号**一律用 `var(--mas-*)`**，禁止硬编码 hex / px。
3. token 唯一事实源是 `packages/shared/src/tokens.ts`；改它后跑 `pnpm --filter @mas/shared build` 重新生成 `tokens.css`。
4. 样式放组件包内 `src/<kebab>.css`，组件 tsx 里 `import './<kebab>.css'`。

## 每个组件必须带

- `src/demo.tsx`：就地 dev 页自动收集渲染。
- dumi 文档：`docs/docs/components/<kebab>/index.md` + `demo/*.tsx`（用聚合包 `@mas/components-all` 引入）。

## 版本与发布

1. 改动后 `pnpm changeset` 记变更（semver）。
2. `pnpm version` 更新版本 → `pnpm release` 构建并发布私有 npm。
3. CDN：`pnpm build` 后 `node scripts/deploy-cdn.mjs`，按打印的 ossutil 命令上传到 OSS。

## 对外接入方式

- **npm**：`import { X } from '@mas/components-all'` + `import '@mas/components-all/style.css'`；按需则 `@mas/components-x` 的 style.css + `@mas/shared/tokens.css`。
- **CDN**：一个 `<link>` 引 `components.style.css`，一个 `<script>` 引 `components.index.umd.js`，用 `window.MasComponents.X`。
