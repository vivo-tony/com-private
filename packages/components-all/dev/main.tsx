/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
// 就地调试直连地基源码的 token 变量（否则 var(--mas-*) 未定义）
import '../../shared/src/tokens.css'

// 收集所有组件包的 demo（约定：每个组件 src/**/demo.tsx）
const demos = import.meta.glob('../../components-*/src/**/demo.tsx', { eager: true })

type DemoModule = { default: React.ComponentType }

function Gallery() {
  const groups: Record<string, { name: string; Demo: React.ComponentType }[]> = {}
  for (const [path, mod] of Object.entries(demos)) {
    const m = path.match(/components-([^/]+)\/src\/(.+)\.tsx$/)
    const pkg = m?.[1] ?? 'unknown'
    const name = m?.[2] ?? path
    ;(groups[pkg] ??= []).push({ name, Demo: (mod as DemoModule).default })
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 960 }}>
      <h1>MAS 组件库 · 全组件调试</h1>
      {Object.entries(groups).map(([pkg, items]) => (
        <section key={pkg} style={{ marginBottom: 32 }}>
          <h2>@mas/components-{pkg}</h2>
          {items.map(({ name, Demo }) => (
            <div key={name} style={{ margin: '16px 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
              <h3 style={{ marginTop: 0, color: '#666' }}>{name}</h3>
              <Demo />
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Gallery />)
