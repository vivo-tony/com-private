import { useState } from 'react'
import { Button } from './Button'

// 组件 demo：和组件放一起，dev 页会自动收集渲染
export default function ButtonDemo() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" onClick={() => setCount((c) => c + 1)}>
        clicked {count}
      </Button>
      <Button variant="default">default</Button>
      <Button variant="danger">danger</Button>
      <Button size="small">small</Button>
      <Button size="large" variant="primary">large</Button>
    </div>
  )
}
