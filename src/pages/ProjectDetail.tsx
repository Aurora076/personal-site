/**
 * 项目详情页。
 */

import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { Badge, Loading } from '../components/ui';
import { useApi } from '../hooks/useApi';
import { getProject } from '../api/projects';

export default function ProjectDetail(): JSX.Element {
  const { id = '' } = useParams();
  const { data: project, loading } = useApi(() => getProject(id), [id]);

  if (loading) return <Loading text="正在加载项目…" />;

  if (!project) {
    return (
      <div className="mx-auto max-w-content px-5 py-24 text-center">
        <p className="text-lg font-semibold text-ink">项目不存在</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-btn border border-line px-5 py-2.5 text-sm text-ink transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-content px-5 py-16">
      <Link to="/" className="text-sm text-muted transition hover:text-[var(--accent)]">
        ← 返回首页
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{project.date}</span>
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-btn bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              在线预览
            </a>
          ) : null}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-btn border border-line px-5 py-2.5 text-sm text-ink transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              查看源码
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-8">
        <Markdown content={project.content} />
      </div>
    </article>
  );
}
