// 注意：本文件为重建占位 —— 原始内容未能从磁盘恢复，如你有原始版本请替换。
import { createClient } from '../src'

const client = createClient({ baseURL: 'https://example.com/api' })
document.getElementById('out')!.textContent = `sdk-request ready → request 类型: ${typeof client.request}`
