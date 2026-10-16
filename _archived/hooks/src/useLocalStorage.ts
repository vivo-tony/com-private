import { useState } from 'react'
import { getStorage, setStorage } from '@mas/utils'

/** 状态持久化到 localStorage（底层复用 @mas/utils） */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => getStorage(key, initialValue))

  const set = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      setStorage(key, v)
      return v
    })
  }

  return [value, set] as const
}
