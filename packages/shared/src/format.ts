/** 数字千分位格式化 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** 日期格式化，支持占位符 YYYY MM DD HH mm ss */
export function formatDate(date: Date | string | number, pattern = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k])
}
