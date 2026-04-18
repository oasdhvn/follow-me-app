# Follow Me App — 长期记忆

## 项目概述
- **名称**：Follow Me 旅行社交 App
- **技术栈**：Next.js 15 + 智谱 AI SDK（z-ai-web-dev-sdk）+ Tailwind CSS
- **项目路径**：`C:\Users\28613\.qclaw\workspace\follow-me-app`
- **访问地址**：http://localhost:3000

## 完整页面结构（2026-04-15 完善）

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | `src/app/page.tsx` | 首页：AI生成卡片、发布/分享/喜欢、最新攻略预览 |
| `/discover` | `src/app/discover/page.tsx` | 发现页：搜索、热门标签、最新/最热排序、瀑布流 |
| `/card/[id]` | `src/app/card/[id]/page.tsx` | 详情页：完整攻略、点赞收藏、评论区、删除 |
| `/profile` | `src/app/profile/page.tsx` | 个人页：用户信息、编辑简介、我的攻略/收藏 |

## 关键配置

### .z-ai-config
智谱 AI API Key 已配置，文件位于项目根目录（内容不记录）。

### next.config.js
```js
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname),
  serverExternalPackages: ['z-ai-web-dev-sdk'],
}
```

### AI 路由：src/app/api/generate-card/route.ts
- 调用 `zai.chat.completions.create()`，**必须传 `model: 'glm-4-flash'`**
- 接受 `keywords` 参数，返回结构化旅行攻略 JSON

## 部署过程踩坑记录（2026-04-15）

1. **SWC 原生模块不兼容**：需重装 `@next/swc-win32-x64-msvc@15.5.15`
2. **SDK 调用缺少 model 参数**：`z-ai-web-dev-sdk` 的 `chat.completions.create()` 必须显式传入 `model` 字段
3. **Next.js 配置字段变更**：Next.js 15 中 `experimental.serverComponentsExternalPackages` 已改为顶层 `serverExternalPackages`
4. **page.tsx 内嵌重复 Header**：首页原有一个硬编码静态 Header，layout.tsx 又有真实 Header，导致双层导航。修复方式：删除 page.tsx 内的静态 Header

## 启动方式
```powershell
cd C:\Users\28613\.qclaw\workspace\follow-me-app
npm run dev
```
