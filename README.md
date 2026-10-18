# Aurora · 个人网站

一个深色星空主题的个人展示网站,包含前台展示与可视化后台管理。

## 文档

- [PRD.md](PRD.md) — 产品需求文档
- [TECH_DESIGN.md](TECH_DESIGN.md) — 技术设计文档
- [AGENTS.md](AGENTS.md) — AI 开发规范

## 功能

### 前台
- Hero 首屏:头像、姓名、职位、一句话介绍、CTA
- 关于:个人简介、工作经历时间线、教育背景
- 技能:按分类展示,带熟练度进度条
- 项目:卡片列表 + 独立详情页
- 博客:文章列表 + Markdown 详情页(含目录、代码高亮)
- 联系:邮箱一键复制、社交链接
- 全局:Canvas 星空背景、吸顶导航、响应式布局

### 后台 `/#/admin`
- 登录(演示账号 `admin` / `aurora2026`)
- 仪表盘:内容统计与最近文章
- 个人信息、技能、项目、博客的增删改
- 站点设置:标题、强调色、页脚文案、星空开关

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS 3 + React Router 6

数据层统一封装在 `src/api/`,本期使用 localStorage 实现,便于后续替换为真实后端。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

产物输出到 `dist/`,可直接部署到 Vercel 或 Cloudflare Pages。

## 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中 Import 该仓库
3. Framework Preset 自动识别为 Vite
4. Build Command `npm run build`,Output Directory `dist`
5. 部署完成后获得访问地址

## 说明

- 后台为演示模式,数据保存在浏览器 localStorage 中,不会上传服务器
- 客户端登录仅用于区分前后台入口,不构成真实安全边界
- 路由使用 HashRouter,静态托管下刷新不会 404
