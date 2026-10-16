/** 无 React 依赖的核心上传方法 —— 供 SDK 版（@mas/components-upload/sdk）单独引入 */

export interface UploadFileInput {
  file: File | Blob
  /** 文件名（Blob 无 name 时必填） */
  filename?: string
  /** 表单字段名，默认 'file' */
  fieldName?: string
  /** 附加表单字段 */
  data?: Record<string, string | Blob>
}

export interface UploadOptions {
  /** 上传地址 */
  action: string
  /** HTTP 方法，默认 POST */
  method?: 'POST' | 'PUT'
  headers?: Record<string, string>
  withCredentials?: boolean
  /** 超时毫秒，默认 0 = 不限 */
  timeout?: number
  /** 进度回调（0-100） */
  onProgress?: (percent: number) => void
  /** 取消信号 */
  signal?: AbortSignal
}

export interface UploadResponse {
  status: number
  /** 解析后的响应体：优先 JSON，否则文本 */
  data: unknown
}

/** 上传失败错误，带 HTTP 状态码与响应体 */
export class UploadError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(`[upload] 上传失败（${status || 'network error'}）`)
    this.name = 'UploadError'
  }
}

export function uploadFile(input: UploadFileInput, options: UploadOptions): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const { file, filename, fieldName = 'file', data } = input
    const { action, method = 'POST', headers = {}, withCredentials = false, timeout = 0, onProgress, signal } = options

    const form = new FormData()
    const name = filename ?? (file instanceof File ? file.name : 'blob')
    form.append(fieldName, file, name)
    if (data) for (const [k, v] of Object.entries(data)) form.append(k, v)

    const xhr = new XMLHttpRequest()
    xhr.open(method, action, true)
    xhr.withCredentials = withCredentials
    if (timeout > 0) xhr.timeout = timeout
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v)

    if (signal) {
      if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'))
      signal.addEventListener('abort', () => xhr.abort(), { once: true })
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      const data = parseResponse(xhr.responseText, xhr.getResponseHeader('content-type'))
      if (xhr.status >= 200 && xhr.status < 300) resolve({ status: xhr.status, data })
      else reject(new UploadError(xhr.status, data))
    }
    xhr.onerror = () => reject(new UploadError(0, null))
    xhr.ontimeout = () => reject(new UploadError(0, null))
    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'))

    xhr.send(form)
  })
}

function parseResponse(text: string, contentType: string | null): unknown {
  if (!text) return null
  if (contentType?.includes('application/json')) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return text
}
