---
title: Upload 上传
nav:
  title: 组件
  order: 2
group:
  title: 通用
  order: 2
---

# Upload 上传

文件上传组件，两种引入方式：**SDK 版**（仅上传方法，无 React / 无 UI）与**满血版**（上传方法 + UI 组件）。

## 代码演示

<code src="../../../../packages/components-upload/src/demo.tsx"></code>

## 两种引入方式

### 满血版（方法 + UI）

```tsx
import { Upload } from '@mas/components-upload'
import '@mas/components-upload/style.css'

<Upload action="/api/upload" accept="image/*" multiple />
```

### SDK 版（仅上传方法）

```ts
import { uploadFile } from '@mas/components-upload/sdk'

const res = await uploadFile(
  { file, fieldName: 'file', data: { biz: 'x' } },
  { action: '/api/upload', headers: { Authorization: 'xx' }, onProgress: (p) => console.log(p) },
)
```

## API

### Upload（满血版）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| action | 上传地址 | `string` | -（必填） |
| multiple | 是否多选 | `boolean` | `false` |
| accept | 接受的文件类型 | `string` | - |
| fieldName | 表单字段名 | `string` | `'file'` |
| data | 附加表单字段 | `Record<string, string \| Blob>` | - |
| headers | 请求头 | `Record<string, string>` | - |
| withCredentials | 是否携带 cookie | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| children | 自定义触发区 | `ReactNode` | - |

### uploadFile（SDK 方法）

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| input.file | 文件 | `File \| Blob` |
| input.fieldName | 表单字段名 | `string` |
| input.data | 附加表单字段 | `Record<string, string \| Blob>` |
| options.action | 上传地址 | `string` |
| options.headers | 请求头 | `Record<string, string>` |
| options.onProgress | 进度回调 | `(percent: number) => void` |
| options.signal | 取消信号 | `AbortSignal` |
