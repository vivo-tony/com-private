import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseRequestOptions<T> {
  /** 是否手动触发（默认 false，挂载即请求） */
  manual?: boolean
  onSuccess?: (data: T) => void
  onError?: (err: Error) => void
}

/** 轻量异步请求 hook，支持 loading / error / 手动重试 */
export function useRequest<T>(request: () => Promise<T>, options: UseRequestOptions<T> = {}) {
  const { manual = false, onSuccess, onError } = options
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const cbRef = useRef({ onSuccess, onError })
  cbRef.current = { onSuccess, onError }

  const run = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const res = await request()
      setData(res)
      cbRef.current.onSuccess?.(res)
      return res
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setError(err)
      cbRef.current.onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (!manual) void run()
  }, [manual, run])

  return { data, loading, error, run }
}
