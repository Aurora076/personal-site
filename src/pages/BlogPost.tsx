/**
 * 博客详情页:Markdown 渲染 + 目录(TOC)。
 */

import { Link, useParams } from 'react-router-dom';
import Markdown, { extractHeadings } from '../components/Markdown';
import { Badge, Loading } from '../components/ui';
import { useApi } from '../hooks/useApi';
import { getPostBySlug } from '../api/posts';

export default function BlogPost(): JSX.Element {
  const { slug = '' } = useParams();
  const { data: post, loading } = useApi(() => getPostBySlug(slug), [slug]);

  if (loading) return <Loading text="正在加载文章…" />;

  if (!post) {
    return (
      <div className="mx-auto max-w-content px-5 py-24 text-center">
        <p className="text-lg font-semibold text-ink">文章不存在</p>
        <p className="mt-2 text-sm text-muted">它可能已被删除,或者链接有误。</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-btn border border-line px-5 py-2.5 text-sm text-ink transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const headings = extractHeadings(post.content);

  return (
    <article className="mx-auto max-w-content px-5 py-16">
      <Link
        to="/"
        className="text-sm text-muted transition hover:text-[var(--accent)]"
      >
        ← 返回首页
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{post.date}</span>
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">{post.summary}</p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <Markdown content={post.content} />
        </div>

        {headings.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                目录
              </p>
              <ul className="space-y-2 border-l border-line">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#/blog/${post.slug}`}
                      onClick={(event) => {
                        event.preventDefault();
                        document
                          .getElementById(heading.id)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`block border-l-2 border-transparent py-1 text-xs text-muted transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${
                        heading.level === 1 ? 'pl-3' : heading.level === 2 ? 'pl-5' : 'pl-7'
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
