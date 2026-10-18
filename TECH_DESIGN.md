# TECH_DESIGN — 个人展示网站技术设计

> 配套文档:PRD.md
> 版本:v1.0

---

## 一、技术栈选择

### 1.1 前端

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | React 18 | 生态成熟,组件化清晰 |
| 语言 | TypeScript | 类型约束,减少运行时错误 |
| 构建 | Vite 5 | 冷启动快,配置简单,HMR 体验好 |
| 样式 | Tailwind CSS 3 | 原子化,配合 CSS 变量做主题 |
| 路由 | React Router 6 | 前后台路由隔离,支持路由守卫 |
| Markdown | 自研轻量渲染器 | 避免引入重型依赖,可控性高 |
| 图标 | 内联 SVG | 零依赖,可随主题着色 |

### 1.2 后端与数据

本期**不引入真实服务端**。数据层抽象为 `src/api/`,内部用 `localStorage` 实现,
对外暴露 Promise 接口。后续接入 Supabase / Vercel KV 时,只需替换 `src/api/` 的实现,
上层组件无需改动。

这样做的原因:

1. 课程要求本期交付一个可部署的完整站点,静态托管即可满足
2. 避免依赖数据库账号与密钥,降低部署复杂度
3. API 层收敛后,迁移成本低

> **已知限制**:localStorage 数据仅存在于当前浏览器。换设备或清除浏览器数据后
> 会回到默认种子数据。这是本期方案的边界,v1.1 通过真实后端解决。

### 1.3 认证

- 登录校验在客户端完成,成功后生成一个随机 token 存入 `localStorage`
- **不保存明文密码**;密码仅用于当次校验
- 后台路由由 `<RequireAuth>` 守卫组件包裹,无 token 时重定向到 `/admin/login`
- 说明:客户端认证仅用于演示与防误入,不构成真实安全边界

### 1.4 部署

| 项 | 方案 |
|---|---|
| 代码托管 | GitHub |
| 部署平台 | Vercel(备选 Cloudflare Pages) |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| 路由模式 | HashRouter(SPA 刷新不 404,无需服务端重写规则) |

> 选择 HashRouter 是为了避免静态托管下刷新 `/admin` 等路径返回 404 的问题,
> 无需额外配置 `vercel.json` 重写规则。

---

## 二、项目结构

```
personal-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                  # 数据访问层(本期 localStorage 实现)
│   │   ├── storage.ts        # 底层读写 + 种子数据
│   │   ├── auth.ts           # 登录 / 登出 / 登录态
│   │   ├── profile.ts        # 个人信息
│   │   ├── skills.ts         # 技能
│   │   ├── projects.ts       # 项目
│   │   ├── posts.ts          # 博客文章
│   │   ├── settings.ts       # 站点设置
│   │   └── types.ts          # 共享类型
│   ├── components/           # 通用组件
│   │   ├── Starfield.tsx     # Canvas 星空
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Section.tsx
│   │   ├── Markdown.tsx      # 轻量 Markdown 渲染
│   │   └── ui/               # Button / Input / Card / Modal 等
│   ├── layouts/
│   │   ├── PublicLayout.tsx  # 前台布局(导航 + 页脚 + 星空)
│   │   └── AdminLayout.tsx   # 后台布局(侧边栏 + 顶栏)
│   ├── pages/
│   │   ├── Home.tsx          # 单页聚合:Hero/About/Skills/Projects/Blog/Contact
│   │   ├── BlogPost.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── admin/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── ProfileAdmin.tsx
│   │       ├── SkillsAdmin.tsx
│   │       ├── ProjectsAdmin.tsx
│   │       ├── PostsAdmin.tsx
│   │       └── SettingsAdmin.tsx
│   ├── hooks/
│   │   ├── useData.ts        # 通用数据加载 hook
│   │   └── useTheme.ts       # 强调色注入
│   ├── App.tsx               # 路由表
│   ├── main.tsx
│   └── index.css             # Tailwind + CSS 变量 + 基础样式
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
├── PRD.md
├── TECH_DESIGN.md
└── AGENTS.md
```

---

## 三、数据模型

```ts
// 个人信息
interface Profile {
  name: string;
  role: string;            // 职位
  tagline: string;         // 一句话介绍
  avatar: string;          // 头像 URL
  bio: string;             // 个人简介(支持多段)
  email: string;
  location: string;
  socials: SocialLink[];   // GitHub / 微博 / 知乎等
  experiences: Experience[];
  education: Education[];
}

interface SocialLink { label: string; url: string; }

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;          // 如 "2023.07 - 至今"
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
}

// 技能
interface Skill {
  id: string;
  name: string;
  category: string;        // 前端 / 后端 / 工具 / 设计
  level: number;           // 0-100
  icon?: string;           // emoji 或 SVG 路径
}

// 项目
interface Project {
  id: string;
  title: string;
  summary: string;
  content: string;         // Markdown 正文
  cover?: string;
  tags: string[];
  link?: string;
  repo?: string;
  date: string;            // YYYY-MM
  featured: boolean;
}

// 博客文章
interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;         // Markdown 正文
  tags: string[];
  cover?: string;
  date: string;            // YYYY-MM-DD
  published: boolean;
}

// 站点设置
interface SiteSettings {
  siteTitle: string;
  accentColor: string;     // 十六进制色值
  footerText: string;
  showStarfield: boolean;
}
```

存储键设计:

| Key | 内容 |
|---|---|
| `ps.profile` | Profile |
| `ps.skills` | Skill[] |
| `ps.projects` | Project[] |
| `ps.posts` | Post[] |
| `ps.settings` | SiteSettings |
| `ps.token` | string(null 表示未登录) |

---

## 四、关键技术点

### 4.1 星空背景

- 使用 `<canvas>` + `requestAnimationFrame` 绘制
- 粒子数量按视口面积计算,移动端乘以 0.4
- 每颗粒子有基础透明度、闪烁相位、漂移速度
- 鼠标位置映射为最大 ±20px 的视差偏移
- `prefers-reduced-motion: reduce` 时只绘制一帧静态星空,不启动动画循环
- 组件卸载时取消动画帧并移除事件监听,避免内存泄漏

### 4.2 Markdown 渲染

自研轻量渲染器,支持:

- 标题 `#` ~ `####`
- 粗体、斜体、行内代码
- 无序 / 有序列表
- 代码块(带语言标签)
- 链接
- 引用块
- 段落与换行

实现方式:按行解析 → 生成 React 元素(不直接使用 `dangerouslySetInnerHTML`),
避免 XSS 风险。

### 4.3 数据层抽象

```ts
// 所有 API 返回 Promise,模拟真实网络请求
export async function getProjects(): Promise<Project[]> { ... }
export async function saveProject(p: Project): Promise<void> { ... }
export async function deleteProject(id: string): Promise<void> { ... }
```

- 首次访问时写入种子数据(内置示例项目、文章、技能)
- 读写统一经过 `storage.ts`,方便将来替换为 `fetch('/api/...')`
- 数据变更后触发自定义事件 `ps:data-changed`,前台页面监听后自动刷新

### 4.4 路由守卫

```tsx
function RequireAuth({ children }: { children: ReactNode }) {
  const token = getToken();
  const location = useLocation();
  if (!token) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
```

### 4.5 主题色

- `useTheme` 读取 `settings.accentColor`,写入 CSS 变量 `--accent`
- Tailwind 中通过 `bg-[var(--accent)]` / `text-[var(--accent)]` 使用
- 修改设置后无需刷新,变量实时生效

### 4.6 性能

- 路由级代码分割(`React.lazy`)可选,本期体积较小暂不启用
- 星空在页面不可见时(`document.hidden`)暂停动画
- 列表渲染使用稳定的 `key`

---

## 五、部署方案

1. 代码推送到 GitHub 仓库
2. 在 Vercel 中 Import 该仓库
3. Framework Preset 自动识别为 Vite
4. Build Command:`npm run build`,Output Directory:`dist`
5. 部署完成后获得 `https://<project>.vercel.app` 域名

Cloudflare Pages 配置等价:构建命令相同,输出目录同为 `dist`。
