/**
 * 后台 — 博客文章管理。
 * 支持列表、新建、编辑、删除,正文使用 Markdown 并支持实时预览。
 */

import { useState } from 'react';
import type { Post } from '../../api/types';
import { getPosts, savePost, deletePost } from '../../api/posts';
import { useApi } from '../../hooks/useApi';
import Markdown from '../../components/Markdown';
import {
  Button,
  Card,
  ConfirmDialog,
  Field,
  Input,
  Loading,
  Textarea,
} from '../../components/ui';

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

function blankPost(): Post {
  return {
    id: '',
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: [],
    cover: '',
    date: today(),
    published: true,
  };
}

/** 由标题生成 slug;中文标题则退化为时间戳 */
function makeSlug(title: string): string {
  const ascii = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (/[a-z0-9]/.test(ascii)) return ascii;
  return `post-${Date.now().toString(36)}`;
}

export default function PostsAdmin(): JSX.Element {
  const { data: posts, loading } = useApi(getPosts);

  const [form, setForm] = useState<Post | null>(null);
  const [tagText, setTagText] = useState('');
  const [preview, setPreview] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <Loading />;

  const openCreate = (): void => {
    setForm(blankPost());
    setTagText('');
    setPreview(false);
  };

  const openEdit = (post: Post): void => {
    setForm(post);
    setTagText(post.tags.join(', '));
    setPreview(false);
  };

  const onSave = async (): Promise<void> => {
    if (!form || !form.title.trim()) return;

    const tags = tagText
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const finalForm: Post = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim() || makeSlug(form.title),
      tags,
    };

    setSaving(true);
    await savePost(finalForm);
    setSaving(false);
    setForm(null);
  };

  const onDelete = async (): Promise<void> => {
    if (!confirmId) return;
    await deletePost(confirmId);
    setConfirmId(null);
  };

  /* ---------- 编辑表单 ---------- */
  if (form) {
    return (
      <div className="max-w-3xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => setForm(null)}
            className="text-sm text-muted transition hover:text-[var(--accent)]"
          >
            ← 返回列表
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {form.id ? '编辑文章' : '新建文章'}
          </h1>
        </header>

        <Card className="space-y-5">
          <Field label="标题">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="文章标题"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Slug(URL 标识)" hint="留空将自动生成">
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="my-first-post"
              />
            </Field>
            <Field label="发布日期">
              <Input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="2026-10-18"
              />
            </Field>
          </div>

          <Field label="摘要">
            <Textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </Field>

          <Field label="标签" hint="用逗号分隔">
            <Input value={tagText} onChange={(e) => setTagText(e.target.value)} />
          </Field>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            发布到前台(取消勾选则保存为草稿)
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">正文(Markdown)</span>
              <Button variant="subtle" onClick={() => setPreview((v) => !v)}>
                {preview ? '编辑' : '预览'}
              </Button>
            </div>

            {preview ? (
              <div className="min-h-[320px] rounded-btn border border-line bg-[#0D1322] p-5">
                <Markdown content={form.content || '*还没有内容*'} />
              </div>
            ) : (
              <Textarea
                rows={16}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="支持 Markdown:## 标题、- 列表、```代码块```"
              />
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setForm(null)}>
              取消
            </Button>
            <Button onClick={() => void onSave()} disabled={saving}>
              {saving ? '保存中…' : '保存文章'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------- 列表 ---------- */
  return (
    <div className="max-w-3xl">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">博客管理</h1>
          <p className="mt-1.5 text-sm text-muted">共 {posts?.length ?? 0} 篇文章</p>
        </div>
        <Button onClick={openCreate}>+ 新建文章</Button>
      </header>

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {(posts ?? []).map((post) => (
            <li key={post.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{post.title}</p>
                <p className="mt-1 truncate text-xs text-muted">{post.summary}</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {post.date} · {post.tags.join(' / ') || '无标签'}
                </p>
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
              <div className="flex shrink-0 gap-2">
                <Button variant="subtle" onClick={() => openEdit(post)}>
                  编辑
                </Button>
                <Button variant="danger" onClick={() => setConfirmId(post.id)}>
                  删除
                </Button>
              </div>
            </li>
          ))}

          {(posts ?? []).length === 0 ? (
            <li className="px-5 py-12 text-center text-sm text-muted">
              还没有文章,点击右上角新建。
            </li>
          ) : null}
        </ul>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="删除文章"
        description="删除后该文章将从前台移除,此操作不可撤销。"
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
