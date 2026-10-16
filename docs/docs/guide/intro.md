---
title: 快速上手
nav:
  title: 指南
  order: 1
---

# 快速上手

## 安装

```bash
# ① 总包安装（一键装全部组件）
pnpm add @mas/components-all

# ② 按需安装（只装 Button）
pnpm add @mas/components-button
```

## 引入组件

```tsx
import { Button } from '@mas/components-all'
import '@mas/components-all/style.css'   // 聚合样式（含 token）

export default () => <Button variant="primary">Hello MAS</Button>
```

按需引入时，额外引一次 token：

```tsx
import { Button } from '@mas/components-button'
import '@mas/components-button/style.css'
import '@mas/shared/tokens.css'
```
