/**
 * 后台 — 项目管理。
 * 支持列表、新建、编辑、删除,正文使用 Markdown 并支持实时预览。
 */

import { useState } from 'react';
import type { Project } from '../../api/types';
import { getProjects, saveProject, deleteProject } from '../../api/projects';
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

function blankProject(): Project {
  const now = new Date();
  return {
    id: '',
    title: '',
    summary: '',
    content: '',
    cover: '',
    tags: [],
    link: '',
    repo: '',
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    featured: false,
  };
}

export default function ProjectsAdmin(): JSX.Element {
  const { data: projects, loading } = useApi(getProjects);

  const [form, setForm] = useState<Project | null>(null);
  const [tagText, setTagText] = useState('');
  const [preview, setPreview] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <Loading />;

  const openCreate = (): void => {
    setForm(blankProject());
    setTagText('');
    setPreview(false);
  };

  const openEdit = (project: Project): void => {
    setForm(project);
    setTagText(project.tags.join(', '));
    setPreview(false);
  };

  const onSave = async (): Promise<void> => {
    if (!form || !form.title.trim()) return;

    const tags = tagText
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    setSaving(true);
    await saveProject({ ...form, title: form.title.trim(), tags });
    setSaving(false);
    setForm(null);
  };

  const onDelete = async (): Promise<void> => {
    if (!confirmId) return;
    await deleteProject(confirmId);
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
            {form.id ? '编辑项目' : '新建项目'}
          </h1>
        </header>

        <Card className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="项目标题">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="如 图提取 ImageGrab"
              />
            </Field>
            <Field label="日期">
              <Input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="2026-10"
              />
            </Field>
          </div>

          <Field label="一句话简介">
            <Input
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="线上地址">
              <Input
                value={form.link ?? ''}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <Field label="源码地址">
              <Input
                value={form.repo ?? ''}
                onChange={(e) => setForm({ ...form, repo: e.target.value })}
                placeholder="https://github.com/…"
              />
            </Field>
          </div>

          <Field label="技术标签" hint="用逗号分隔">
            <Input value={tagText} onChange={(e) => setTagText(e.target.value)} />
          </Field>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            标记为精选项目
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">项目详情(Markdown)</span>
              <Button variant="subtle" onClick={() => setPreview((v) => !v)}>
                {preview ? '编辑' : '预览'}
              </Button>
            </div>

            {preview ? (
              <div className="min-h-[300px] rounded-btn border border-line bg-[#0D1322] p-5">
                <Markdown content={form.content || '*还没有内容*'} />
              </div>
            ) : (
              <Textarea
                rows={14}
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
              {saving ? '保存中…' : '保存项目'}
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
          <h1 className="text-2xl font-bold tracking-tight text-ink">项目管理</h1>
          <p className="mt-1.5 text-sm text-muted">共 {projects?.length ?? 0} 个项目</p>
        </div>
        <Button onClick={openCreate}>+ 新建项目</Button>
      </header>

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {(projects ?? []).map((project) => (
            <li key={project.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {project.title}
                  {project.featured ? (
                    <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-[var(--accent)]">
                      精选
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 truncate text-xs text-muted">{project.summary}</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {project.date} · {project.tags.join(' / ') || '无标签'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="subtle" onClick={() => openEdit(project)}>
                  编辑
                </Button>
                <Button variant="danger" onClick={() => setConfirmId(project.id)}>
                  删除
                </Button>
              </div>
            </li>
          ))}

          {(projects ?? []).length === 0 ? (
            <li className="px-5 py-12 text-center text-sm text-muted">
              还没有项目,点击右上角新建。
            </li>
          ) : null}
        </ul>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="删除项目"
        description="删除后前台将不再展示该项目,此操作不可撤销。"
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
