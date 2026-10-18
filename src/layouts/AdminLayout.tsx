/**
 * 后台布局:独立侧边栏 + 顶栏,不复用前台 Navbar。
 */

import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

const MENU = [
  { to: '/admin', label: '仪表盘', end: true },
  { to: '/admin/profile', label: '个人信息' },
  { to: '/admin/skills', label: '技能' },
  { to: '/admin/projects', label: '项目' },
  { to: '/admin/posts', label: '博客' },
  { to: '/admin/settings', label: '站点设置' },
];

export default function AdminLayout(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = (): void => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    `block rounded-lg px-3.5 py-2.5 text-sm transition duration-200 ease-smooth ${
      isActive
        ? 'bg-accent/15 font-medium text-[var(--accent)]'
        : 'text-muted hover:bg-white/5 hover:text-ink'
    }`;

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="切换菜单"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-sm md:hidden"
          >
            ☰
          </button>
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
              A
            </span>
            <span className="text-sm font-semibold">后台管理</span>
          </Link>
          <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300 sm:inline">
            演示模式 · 数据存于本机浏览器
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-btn border border-line px-3.5 py-2 text-xs text-muted transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            查看网站
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-btn border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300 transition hover:bg-rose-500/20"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1320px]">
        {/* 侧边栏 */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-60 transform border-r border-line bg-bg p-4 transition-transform duration-300 ease-smooth md:static md:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-1">
            {MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-line bg-white/[0.02] p-3.5 text-xs leading-6 text-muted">
            <p className="font-medium text-ink">提示</p>
            <p className="mt-1">修改内容后返回前台即可看到更新。</p>
          </div>
        </aside>

        {/* 内容区 */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
