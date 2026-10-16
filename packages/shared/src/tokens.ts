/**
 * 设计 token —— 唯一事实源。
 *
 * 约定：
 * - 所有叶子值都是字符串（颜色用 hex、尺寸/字号带单位），`scripts/gen-tokens.mjs`
 *   会把它们展平成 CSS 变量（`--mas-<类别>-<key>`）。
 * - 修改后运行 `pnpm --filter @mas/shared build` 重新生成 `dist/tokens.css`。
 * - 组件 CSS 一律使用 `var(--mas-*)`，禁止硬编码色值/尺寸。
 */
export const tokens = {
  color: {
    primary: '#1677ff',
    primaryHover: '#4096ff',
    primaryActive: '#0958d9',
    danger: '#ff4d4f',
    dangerHover: '#ff7875',
    dangerActive: '#d9363e',
    success: '#52c41a',
    successHover: '#73d13d',
    warning: '#faad14',
    warningHover: '#ffc53d',
    text: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    textInverse: '#fff',
    border: '#d9d9d9',
    borderSecondary: '#f0f0f0',
    bg: '#fff',
    bgDisabled: '#f5f5f5',
  },
  radius: {
    small: '4px',
    medium: '6px',
    large: '8px',
  },
  spacing: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    xxlarge: '24px',
  },
  font: {
    sizeSmall: '12px',
    sizeMedium: '14px',
    sizeLarge: '16px',
    lineHeight: '1.5',
  },
} as const

export type Tokens = typeof tokens
