// 保证 SSR / 非浏览器环境下不报错
const storage = typeof window !== 'undefined' ? window.localStorage : undefined

/** 读取 localStorage，自动 JSON 反序列化，带默认值 */
export function getStorage<T>(key: string, fallback: T): T {
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

/** 写入 localStorage，自动 JSON 序列化 */
export function setStorage<T>(key: string, value: T): void {
  if (!storage) return
  storage.setItem(key, JSON.stringify(value))
}

/** 删除 localStorage 中的 key */
export function removeStorage(key: string): void {
  storage?.removeItem(key)
}
