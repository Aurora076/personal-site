# AGENTS.md — AI 开发指令

> 本文件告诉 AI 代理在这个项目中应当如何工作。所有代码改动都必须遵守本文件。
> 配套文档:`PRD.md`(要做什么)、`TECH_DESIGN.md`(怎么做)。

---

## 一、项目概述

这是一个**个人展示网站**,包含两大部分:

- **前台** (`/`、`/#/blog/:slug`、`/#/project/:id`):展示个人信息、技能、项目、博客
- **后台** (`/#/admin/*`):登录后管理上述内容

视觉风格:**深色主题 + Canvas 星空背景 + 简洁现代**。
技术栈:**React 18 + TypeScript + Vite + Tailwind CSS 3**。
数据层:**统一走 `src/api/`,本期用 localStorage 实现**。

---

## 二、开发规范

### 2.1 目录职责

| 目录 | 职责 | 禁止 |
|---|---|---|
| `src/api/` | 数据读写与类型定义 | 禁止在这里写 UI 逻辑 |
| `src/components/` | 可复用展示组件 | 禁止直接读写 localStorage |
| `src/pages/` | 路由级页面 | 禁止在页面里重复实现通用逻辑 |
| `src/layouts/` | 前后台两套布局 | 后台布局不得复用前台 Navbar |
| `src/hooks/` | 通用逻辑复用 | 禁止在 hook 里直接渲染 UI |

### 2.2 数据访问

- **所有**数据读写必须经过 `src/api/`,组件不得直接调用 `localStorage`
- API 函数统一返回 `Promise`,便于将来替换为真实后端
- 新增数据类型时,同步更新 `src/api/types.ts` 与 `TECH_DESIGN.md` 的数据模型章节

### 2.3 状态管理

- 本期不引入 Redux / Zustand,使用 React 内置状态 + 自定义 hook
- 跨页面数据变更通过 `window.dispatchEvent(new CustomEvent('ps:data-changed'))` 通知

### 2.4 路由

- 使用 `HashRouter`,避免静态托管刷新 404
- 后台路由统一挂在 `/admin` 下,并由 `<RequireAuth>` 包裹
- 新增后台页面必须同步更新后台侧边栏菜单

---

## 三、代码风格

### 3.1 TypeScript

- 开启 `strict` 模式,禁止使用 `any`(确实需要时用 `unknown` + 类型收窄)
- 所有导出的函数必须显式声明返回类型
- 接口/类型使用 `interface`,联合类型使用 `type`
- 组件 Props 必须定义接口,禁止内联匿名类型

### 3.2 命名

| 对象 | 规则 | 示例 |
|---|---|---|
| 组件文件 | PascalCase | `Starfield.tsx` |
| 工具/API 文件 | camelCase | `storage.ts` |
| 组件名 | PascalCase | `ProjectCard` |
| 函数/变量 | camelCase | `getProjects` |
| 常量 | UPPER_SNAKE_CASE | `STORAGE_KEYS` |
| CSS 变量 | kebab-case | `--accent` |

### 3.3 React

- 函数组件 + hooks,禁止 class 组件
- 每个组件只负责一件事,超过 200 行的组件应拆分
- 列表渲染必须有稳定的 `key`,禁止用数组下标
- 副作用统一放在 `useEffect`,并正确清理监听器与定时器

### 3.4 样式

- 优先使用 Tailwind 原子类
- 颜色、圆角、间距使用 `tailwind.config.js` 或 CSS 变量定义,禁止散落魔法值
- 强调色统一使用 `var(--accent)`,不得硬编码 `#6366F1`
- 类名过长时用换行分组,保持可读

### 3.5 注释

- 复杂逻辑、算法、兼容性处理必须写中文注释
- 每个 API 函数用一行注释说明用途
- 禁止无意义的注释(如 `// 设置变量`)

---

## 四、测试要求

### 4.1 自测清单(每次提交前必须完成)

- [ ] `npm run build` 无 TypeScript 报错
- [ ] 首页在 375px / 768px / 1440px 三个宽度下无横向滚动
- [ ] 后台登录 → 修改个人信息 → 返回前台,数据已更新
- [ ] 新建 / 编辑 / 删除项目与博客均正常
- [ ] 未登录访问 `/#/admin` 会被重定向到登录页
- [ ] 刷新页面后登录态保持
- [ ] 删除操作有二次确认
- [ ] 控制台无报错

### 4.2 回归范围

改动 `src/api/` 时,必须回归验证:前台三个列表(技能 / 项目 / 博客)与后台三个管理页。

---

## 五、注意事项

### 5.1 安全

- **禁止**在代码或仓库中提交任何真实密钥、Token、密码
- 登录密码不得明文写入 `localStorage`,只保存随机 token
- Markdown 渲染不得使用 `dangerouslySetInnerHTML`
- 后台的客户端认证**不是真实安全边界**,页面需注明"演示模式",后续版本接入真实后端

### 5.2 数据

- 首次运行时写入种子数据,确保空浏览器打开也有内容
- 数据结构变更时需要处理旧数据的兼容(读取时做字段兜底)
- 不要删除 `ps.` 前缀的存储键命名约定

### 5.3 性能

- 星空动画在 `document.hidden` 时暂停
- 尊重 `prefers-reduced-motion`
- 避免在滚动事件里做重计算,必要时使用 `requestAnimationFrame` 节流

### 5.4 部署

- 构建产物输出到 `dist`
- 部署平台:Vercel(首选)/ Cloudflare Pages
- 不要提交 `node_modules`、`dist`、`.env*`
- 修改构建配置后,需同步更新 `TECH_DESIGN.md` 的部署章节

### 5.5 提交规范

提交信息使用约定式前缀:

```
feat: 新增博客详情页
fix: 修复后台删除后列表未刷新
style: 调整卡片圆角与间距
docs: 更新 TECH_DESIGN 数据模型
refactor: 抽取通用表单组件
```

每次提交只做一件事,提交前确保 `npm run build` 通过。

---

## 六、AI 行为约定

1. **先读文档再动手**:修改功能前先确认 `PRD.md` 与 `TECH_DESIGN.md` 中的对应描述
2. **小步迭代**:一次只实现一个功能点,完成后自测再继续
3. **不擅自扩大范围**:PRD 中"本期不做"的内容不要实现
4. **保持一致性**:新增页面的布局、配色、交互必须与现有页面一致
5. **如实汇报**:构建失败、测试未通过时必须明确说明,不得声称已完成
