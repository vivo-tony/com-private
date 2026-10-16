---
title: 引用方式
nav:
  title: 指南
  order: 2
---

# 引用方式

## npm 引用

```ts
// ① 总包引用（一键装全部组件）
import { Button } from '@mas/components-all'
import '@mas/components-all/style.css'      // 聚合样式（含 token）

// ② 单包按需引用（配合 tree-shaking，只打包用到的）
import { Button } from '@mas/components-button'
import '@mas/components-button/style.css'
import '@mas/shared/tokens.css'         // token 变量只需引一次

// ③ SDK
import { createClient } from '@mas/sdk'
```

## CDN 引用（script 标签）

React 单独从 CDN 引，组件走聚合 UMD 全局变量，注意**额外引一个聚合 CSS**：

```html
<script src="https://cdn/react.umd.js"></script>
<script src="https://cdn/react-dom.umd.js"></script>
<link rel="stylesheet" href="https://cdn.your-company.com/mas-center/1.0.0/components.style.css">
<script src="https://cdn.your-company.com/mas-center/1.0.0/components.index.umd.js"></script>
<script>
  const { Button } = window.MasComponents
</script>
```

> 发布到 CDN：`pnpm build` 后跑 `node scripts/deploy-cdn.mjs`，产物在 `cdn-output/<version>/`。
