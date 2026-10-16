---
title: Button 按钮
nav:
  title: 组件
  order: 1
group:
  title: 通用
  order: 1
---

# Button 按钮

按钮用于触发一个即时操作。

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## 代码演示

### 基本用法

最简单的用法，一个 primary 按钮。

<code src="./demo/basic.tsx"></code>

### 按钮类型

提供 `primary`、`default`、`danger` 三种类型。

<code src="./demo/variants.tsx"></code>

### 按钮尺寸

提供 `small`、`medium`、`large` 三种尺寸。

<code src="./demo/sizes.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 按钮类型 | `'primary' \| 'default' \| 'danger'` | `'default'` |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| className | 自定义类名 | `string` | - |
| children | 按钮内容 | `React.ReactNode` | - |

其余属性继承自原生 `React.ButtonHTMLAttributes<HTMLButtonElement>`。
