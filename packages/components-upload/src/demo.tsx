import { Upload } from './Upload'

// 满血版：<Upload action="真实上传地址" />，UI + 上传方法一体。
// SDK 版：import { uploadFile } from '@mas/components-upload/sdk'，仅方法无 UI。
export default function UploadDemo() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Upload action="/api/upload" accept="image/*" multiple />
    </div>
  )
}
