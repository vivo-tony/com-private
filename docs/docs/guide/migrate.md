---
title: 存量组件迁移
nav:
  title: 指南
  order: 4
---

# 存量组件迁移

存量组件已上生产，**不重构代码**，只做最小改动迁入本库。五步：

## 1. 生成组件包

```bash
pnpm new component table   # 生成 packages/components-table
```

## 2. 拷贝组件源码

把原组件文件拷进 `packages/components-table/src/`，重命名为 `<Pascal>.tsx`（一个组件一个文件）。

## 3. 对齐规范（最小改动）

- className 前缀对齐 `mas-`（如原 `btn` → `mas-table`）。
- 色值 / 圆角 / 间距换成 `var(--mas-*)`；缺的 token 补进 `packages/shared/src/tokens.ts`。
- 组件 API 保持原样：`forwardRef` + `displayName`，继承原生 props 类型。

## 4. 补 demo 与文档

- 写 `src/demo.tsx`（就地 dev 自动收集渲染）。
- 写 `docs/docs/components/<kebab>/index.md` + `demo/*.tsx`。

## 5. 挂进总包 + 记版本

在 `packages/components-all/src/index.ts` 加一行 `export * from '@mas/components-table'`，然后：

```bash
pnpm changeset
```

之后走正常发布，npm 与 CDN 双通道自动生效。
