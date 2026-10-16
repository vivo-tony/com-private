---
title: 设计规范（token）
nav:
  title: 指南
  order: 3
---

# 设计规范（token）

没有 UI 稿的前提下，以现有组件在用的色值为基准，沉淀成一套最小 token。

## 唯一事实源

`packages/shared/src/tokens.ts`。改这里 → 跑 `pnpm --filter @mas/shared build` 重新生成 `tokens.css`。

## 使用

组件样式里只写 `var(--mas-*)`：

```css
.mas-btn--primary {
  background: var(--mas-color-primary);
  color: var(--mas-color-text-inverse);
}
```

## 约定

- 颜色用 hex；尺寸 / 字号带单位；所有叶子值都是字符串。
- 变量名 `--mas-<类别>-<key>`，camelCase 自动转 kebab-case（`primaryHover` → `--mas-color-primary-hover`）。
- 接入方想换主题，只需覆盖 `:root` 里的变量。
