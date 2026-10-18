/**
 * 后台仪表盘:内容统计与最近更新。
 */

import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getProjects } from '../../api/projects';
import { getPosts } from '../../api/posts';
import { getSkills } from '../../api/skills';
import { getProfile } from '../../api/profile';

export default function Dashboard(): JSX.Element {
  const { data: projects } = useApi(getProjects);
  const { data: posts } = useApi(getPosts);
  const { data: skills } = useApi(getSkills);
  const { data: profile } = useApi(getProfile);

  const stats = [
    {
      label: '项目',
      value: projects?.length ?? 0,
      to: '/admin/projects',
      hint: '查看与管理项目',
    },
    {
      label: '博客文章',
      value: posts?.length ?? 0,
      to: '/admin/posts',
      hint: '编写与发布文章',
    },
    {
      label: '技能',
      value: skills?.length ?? 0,
      to: '/admin/skills',
      hint: '调整技能与熟练度',
    },
  ];

  const recentPosts = (posts ?? []).slice(0, 4);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">仪表盘</h1>
        <p className="mt-1.5 text-sm text-muted">
          欢迎回来,{profile?.name ?? 'Aurora'}。这里可以快速了解站点内容。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-card border border-line bg-card/60 p-6 transition duration-300 ease-smooth hover:-translate-y-1 hover:border-accent/60"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{stat.value}</p>
            <p className="mt-3 text-xs text-muted transition group-hover:text-[var(--accent)]">
              {stat.hint} →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-card border border-line bg-card/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">最近文章</h2>
            <Link
              to="/admin/posts"
              className="text-xs text-muted transition hover:text-[var(--accent)]"
            >
              全部 →
            </Link>
          </div>

          <ul className="divide-y divide-line">
            {recentPosts.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{post.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{post.date}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${
                    post.published
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-white/5 text-muted'
                  }`}
                >
                  {post.published ? '已发布' : '草稿'}
                </span>
              </li>
            ))}
            {recentPosts.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted">还没有文章</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-card border border-line bg-card/60 p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink">快捷入口</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/profile', label: '编辑个人信息' },
              { to: '/admin/projects', label: '管理项目' },
              { to: '/admin/posts', label: '写一篇博客' },
              { to: '/admin/settings', label: '站点设置' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-sm text-muted transition hover:border-accent/60 hover:text-ink"
              >
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
