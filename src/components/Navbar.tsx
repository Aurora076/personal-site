/**
 * 前台导航栏。
 * 使用 HashRouter,因此锚点滚动用 JS 实现,避免与路由 hash 冲突。
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
];

function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 当前区块高亮
  useEffect(() => {
    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const go = (id: string): void => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => scrollToSection(id), 120);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition duration-300 ease-smooth ${
        scrolled
          ? 'border-b border-line bg-bg/80 shadow-[0_10px_30px_-24px_rgba(0,0,0,.9)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
            A
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">Aurora</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`rounded-lg px-3 py-2 text-sm transition duration-200 ease-smooth hover:text-ink ${
                active === item.id && location.pathname === '/'
                  ? 'text-[var(--accent)]'
                  : 'text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/admin"
            className="ml-2 rounded-btn border border-line px-4 py-2 text-sm text-muted transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            后台
          </Link>
        </nav>

        {/* 移动端按钮 */}
        <button
          type="button"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-line md:hidden"
        >
          <span
            className={`block h-0.5 w-5 rounded bg-ink transition ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded bg-ink transition ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 rounded bg-ink transition ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* 移动端菜单 */}
      <div
        className={`overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-smooth md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className="rounded-lg px-3 py-2.5 text-left text-sm text-muted transition hover:bg-white/5 hover:text-ink"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg px-3 py-2.5 text-sm text-[var(--accent)]"
          >
            进入后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
