/**
 * 前台首页:单页聚合展示 Hero / 关于 / 技能 / 项目 / 博客 / 联系。
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { Badge, Loading } from '../components/ui';
import { useApi } from '../hooks/useApi';
import { getProfile } from '../api/profile';
import { getSkills } from '../api/skills';
import { getProjects } from '../api/projects';
import { getPosts } from '../api/posts';

const COVER_GRADIENTS = [
  'from-indigo-500/30 via-violet-500/20 to-fuchsia-500/10',
  'from-sky-500/30 via-cyan-500/20 to-emerald-500/10',
  'from-amber-500/25 via-orange-500/15 to-rose-500/10',
];

function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Home(): JSX.Element {
  const { data: profile } = useApi(getProfile);
  const { data: skills } = useApi(getSkills);
  const { data: projects } = useApi(getProjects);
  const { data: posts } = useApi(getPosts);

  const [copied, setCopied] = useState(false);

  const groupedSkills = useMemo(() => {
    const map = new Map<string, typeof skills>();
    (skills ?? []).forEach((skill) => {
      const list = map.get(skill.category) ?? [];
      list.push(skill);
      map.set(skill.category, list);
    });
    return Array.from(map.entries());
  }, [skills]);

  const publishedPosts = useMemo(
    () => (posts ?? []).filter((post) => post.published),
    [posts]
  );

  const copyEmail = async (): Promise<void> => {
    if (!profile?.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!profile) return <Loading text="正在加载个人信息…" />;

  const bioParagraphs = profile.bio.split('\n\n').filter(Boolean);

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative mx-auto grid w-full max-w-content gap-14 px-5 py-20 md:grid-cols-[1.15fr_.85fr] md:items-center">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              你好,我是
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-3 text-xl font-medium text-[var(--accent)] md:text-2xl">
              {profile.role}
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted">
              {profile.tagline}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToId('projects')}
                className="rounded-btn bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_-14px_var(--accent)] transition duration-200 ease-smooth hover:-translate-y-0.5 hover:brightness-110"
              >
                查看项目
              </button>
              <button
                type="button"
                onClick={() => scrollToId('contact')}
                className="rounded-btn border border-line px-6 py-3 text-sm text-ink transition duration-200 ease-smooth hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                联系我
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span>📍 {profile.location}</span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <div className="flex gap-4">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="transition hover:text-[var(--accent)]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 头像 / 装饰 */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl" />
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="relative h-52 w-52 rounded-full border border-line object-cover md:h-64 md:w-64"
                />
              ) : (
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-line bg-gradient-to-br from-accent/30 to-transparent text-7xl font-bold text-ink md:h-64 md:w-64">
                  {profile.name.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 关于 ================= */}
      <Section
        id="about"
        eyebrow="About"
        title="关于我"
        subtitle="一点自我介绍,以及一路走来的经历。"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-5 text-sm leading-8 text-muted">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
                工作经历
              </h3>
              <ol className="relative space-y-5 border-l border-line pl-6">
                {profile.experiences.map((exp) => (
                  <li key={exp.id} className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-[var(--accent)]" />
                    <p className="text-sm font-medium text-ink">{exp.role}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {exp.company} · {exp.period}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-muted">{exp.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
                教育背景
              </h3>
              <ul className="space-y-3">
                {profile.education.map((edu) => (
                  <li
                    key={edu.id}
                    className="rounded-xl border border-line bg-white/[0.02] px-4 py-3"
                  >
                    <p className="text-sm font-medium text-ink">{edu.school}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {edu.degree} · {edu.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ================= 技能 ================= */}
      <Section
        id="skills"
        eyebrow="Skills"
        title="技能栈"
        subtitle="日常使用、可以独当一面的技术。"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {groupedSkills.map(([category, list]) => (
            <div
              key={category}
              className="rounded-card border border-line bg-card/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-5 text-sm font-semibold text-ink">{category}</h3>
              <ul className="space-y-4">
                {(list ?? []).map((skill) => (
                  <li key={skill.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink">
                        {skill.icon ? <span aria-hidden="true">{skill.icon}</span> : null}
                        {skill.name}
                      </span>
                      <span className="text-xs text-muted">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-fuchsia-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= 项目 ================= */}
      <Section
        id="projects"
        eyebrow="Projects"
        title="项目作品"
        subtitle="一些自己动手做的东西,点击可以查看详情。"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group flex flex-col overflow-hidden rounded-card border border-line bg-card/60 backdrop-blur-sm transition duration-300 ease-smooth hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_24px_50px_-30px_var(--accent)]"
            >
              <div
                className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${
                  COVER_GRADIENTS[index % COVER_GRADIENTS.length]
                }`}
              >
                <span className="text-5xl font-bold text-white/80">
                  {project.title.slice(0, 1)}
                </span>
                {project.featured ? (
                  <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] text-white/80 backdrop-blur">
                    精选
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-ink">{project.title}</h3>
                  <span className="shrink-0 text-xs text-muted">{project.date}</span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ================= 博客 ================= */}
      <Section
        id="blog"
        eyebrow="Blog"
        title="技术博客"
        subtitle="记录学习过程和一些踩过的坑。"
      >
        <div className="space-y-4">
          {publishedPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block rounded-card border border-line bg-card/50 p-6 backdrop-blur-sm transition duration-300 ease-smooth hover:border-accent/60 hover:bg-card"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted">{post.date}</span>
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold text-ink transition group-hover:text-[var(--accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.summary}</p>
                </div>
                <span className="text-sm text-muted transition group-hover:translate-x-1 group-hover:text-[var(--accent)]">
                  阅读 →
                </span>
              </div>
            </Link>
          ))}

          {publishedPosts.length === 0 ? (
            <p className="rounded-card border border-dashed border-line py-14 text-center text-sm text-muted">
              还没有发布文章,去后台上传第一篇吧。
            </p>
          ) : null}
        </div>
      </Section>

      {/* ================= 联系 ================= */}
      <Section
        id="contact"
        eyebrow="Contact"
        title="保持联系"
        subtitle="有合作、机会或者只是想聊聊,都欢迎联系我。"
      >
        <div className="rounded-card border border-line bg-card/60 p-8 backdrop-blur-sm md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted">邮箱</p>
              <p className="mt-1 text-lg font-medium text-ink">{profile.email}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="rounded-btn bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
              >
                {copied ? '已复制 ✓' : '复制邮箱'}
              </button>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-btn border border-line px-5 py-2.5 text-sm text-ink transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                发送邮件
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
