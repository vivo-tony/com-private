export interface ClientOptions {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  token?: string
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  params?: Record<string, string | number | boolean>
}

/** 基于 fetch 的最小请求客户端，可配置鉴权 token 与超时 */
export class SdkClient {
  private opts: Required<Pick<ClientOptions, 'timeout'>> & ClientOptions

  constructor(opts: ClientOptions) {
    this.opts = { timeout: 10000, headers: {}, ...opts }
  }

  setToken(token: string): void {
    this.opts.token = token
  }

  async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { baseURL, timeout, headers, token } = this.opts
    const url = new URL(path, baseURL)
    if (config.params) {
      Object.entries(config.params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url.toString(), {
        method: config.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`[sdk] request failed: ${res.status} ${res.statusText}`)
      return (await res.json()) as T
    } finally {
      clearTimeout(timer)
    }
  }
}

export function createClient(opts: ClientOptions): SdkClient {
  return new SdkClient(opts)
}
