/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
// 就地调试时直连地基源码的 token 变量（否则 var(--mas-*) 未定义）
import '../../shared/src/tokens.css'

// 自动发现 src 下所有 demo.tsx —— 新增组件无需手动注册
const demos = import.meta.glob('../src/**/demo.tsx', { eager: true })

function Gallery() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 720 }}>
      <h1>components-button dev</h1>
      {Object.entries(demos).map(([path, mod]) => {
        const Demo = (mod as { default: React.ComponentType }).default
        const name = path.replace('../src/', '').replace('/demo.tsx', '')
        return (
          <section key={path} style={{ margin: '16px 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>{name}</h3>
            <Demo />
          </section>
        )
      })}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Gallery />)
