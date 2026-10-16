// 注意：本文件为重建占位 —— 原始内容未能从磁盘恢复，如你有原始版本请替换。
/** 极简日志：统一 [sdk] 前缀 */
function log(level: 'info' | 'warn' | 'error', ...args: unknown[]): void {
  console[level]('[sdk]', ...args)
}

export const logger = {
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
}
