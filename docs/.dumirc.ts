import { defineConfig } from 'dumi'

export default defineConfig({
  resolve: {
    // 指南与组件文档都放在 docs 目录
    docDirs: ['docs'],
  },
  themeConfig: {
    name: 'MAS Center',
    logo: false,
    nav: [
      { title: '指南', link: '/guide/intro' },
      { title: '设计规范', link: '/guide/tokens' },
      { title: '组件', link: '/components/button' },
    ],
    footer: 'MAS Center · Powered by dumi',
  },
})
