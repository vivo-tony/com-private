import React, { useRef, useState } from 'react'
import { cx } from '@mas/shared'
import { uploadFile, type UploadResponse } from './uploader'
import './upload.css'

export interface UploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onProgress'> {
  /** 上传地址（必填） */
  action: string
  /** 是否多选，默认 false */
  multiple?: boolean
  /** 接受的文件类型，如 image/* */
  accept?: string
  /** 表单字段名，默认 'file' */
  fieldName?: string
  /** 附加表单字段 */
  data?: Record<string, string | Blob>
  headers?: Record<string, string>
  withCredentials?: boolean
  disabled?: boolean
  /** 自定义触发区内容 */
  children?: React.ReactNode
  onSuccess?: (file: File, res: UploadResponse) => void
  onError?: (file: File, err: unknown) => void
  onProgress?: (file: File, percent: number) => void
}

export interface UploadFileItem {
  uid: string
  file: File
  status: 'uploading' | 'done' | 'error'
  percent: number
  error?: string
}

let uidSeed = 0
function genUid(): string {
  return `u${Date.now()}-${uidSeed++}`
}

export const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      action,
      multiple,
      accept,
      fieldName = 'file',
      data,
      headers,
      withCredentials,
      disabled,
      children,
      className,
      onSuccess,
      onError,
      onProgress,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [list, setList] = useState<UploadFileItem[]>([])

    const update = (uid: string, patch: Partial<UploadFileItem>) => {
      setList((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)))
    }

    const start = (item: UploadFileItem) => {
      uploadFile(
        { file: item.file, fieldName, data },
        {
          action,
          headers,
          withCredentials,
          onProgress: (percent) => {
            update(item.uid, { percent })
            onProgress?.(item.file, percent)
          },
        },
      )
        .then((res) => {
          update(item.uid, { status: 'done', percent: 100 })
          onSuccess?.(item.file, res)
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : String(err)
          update(item.uid, { status: 'error', error: message })
          onError?.(item.file, err)
        })
    }

    const handleFiles = (files: FileList | File[]) => {
      const arr = Array.from(files)
      if (!arr.length) return
      const items: UploadFileItem[] = arr.map((file) => ({ uid: genUid(), file, status: 'uploading', percent: 0 }))
      setList((prev) => [...prev, ...items])
      items.forEach(start)
    }

    return (
      <div ref={ref} className={cx('mas-upload', disabled && 'mas-upload--disabled', className)} {...rest}>
        <div
          className="mas-upload__trigger"
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) inputRef.current?.click()
          }}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click()
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (!disabled) handleFiles(e.dataTransfer.files)
          }}
        >
          <input
            ref={inputRef}
            className="mas-upload__input"
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
          {children ?? <div className="mas-upload__default">点击或拖拽文件到此处上传</div>}
        </div>

        {list.length > 0 && (
          <ul className="mas-upload__list">
            {list.map((it) => (
              <li key={it.uid} className="mas-upload__item">
                <span className="mas-upload__name">{it.file.name}</span>
                {it.status === 'uploading' && (
                  <span className="mas-upload__progress">
                    <i className="mas-upload__bar" style={{ width: `${it.percent}%` }} />
                  </span>
                )}
                {it.status === 'done' && <span className="mas-upload__status mas-upload__status--done">✓</span>}
                {it.status === 'error' && (
                  <span className="mas-upload__status mas-upload__status--error" title={it.error}>
                    ✕
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
)
Upload.displayName = 'Upload'
