/**
 * 后台 — 技能管理(增删改)。
 */

import { useState } from 'react';
import type { Skill } from '../../api/types';
import { getSkills, saveSkill, deleteSkill } from '../../api/skills';
import { useApi } from '../../hooks/useApi';
import {
  Button,
  Card,
  ConfirmDialog,
  Field,
  Input,
  Loading,
  Select,
} from '../../components/ui';

const BLANK: Skill = { id: '', name: '', category: '前端', level: 70, icon: '' };
const CATEGORIES = ['前端', '后端', '工具', '设计', '其他'];

export default function SkillsAdmin(): JSX.Element {
  const { data: skills, loading } = useApi(getSkills);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Skill>(BLANK);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <Loading />;

  const openCreate = (): void => {
    setForm(BLANK);
    setFormOpen(true);
  };

  const openEdit = (skill: Skill): void => {
    setForm(skill);
    setFormOpen(true);
  };

  const onSave = async (): Promise<void> => {
    if (!form.name.trim()) return;
    setSaving(true);
    await saveSkill({ ...form, name: form.name.trim() });
    setSaving(false);
    setFormOpen(false);
  };

  const onDelete = async (): Promise<void> => {
    if (!confirmId) return;
    await deleteSkill(confirmId);
    setConfirmId(null);
  };

  return (
    <div className="max-w-3xl">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">技能管理</h1>
          <p className="mt-1.5 text-sm text-muted">前台按分类分组展示。</p>
        </div>
        <Button onClick={openCreate}>+ 添加技能</Button>
      </header>

      {formOpen ? (
        <Card className="mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-ink">
            {form.id ? '编辑技能' : '添加技能'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="名称">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如 React"
              />
            </Field>

            <Field label="分类">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="图标(emoji,可选)">
              <Input
                value={form.icon ?? ''}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="⚛️"
              />
            </Field>

            <Field label={`熟练度:${form.level}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                className="mt-2 w-full accent-[var(--accent)]"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              取消
            </Button>
            <Button onClick={() => void onSave()} disabled={saving}>
              {saving ? '保存中…' : '保存'}
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {(skills ?? []).map((skill) => (
            <li key={skill.id} className="flex items-center gap-4 px-5 py-4">
              <span className="w-6 text-center text-lg">
                {skill.icon || '•'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">{skill.name}</p>
                <p className="mt-0.5 text-xs text-muted">{skill.category}</p>
              </div>
              <div className="hidden w-32 items-center gap-2 sm:flex">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted">{skill.level}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="subtle" onClick={() => openEdit(skill)}>
                  编辑
                </Button>
                <Button variant="danger" onClick={() => setConfirmId(skill.id)}>
                  删除
                </Button>
              </div>
            </li>
          ))}

          {(skills ?? []).length === 0 ? (
            <li className="px-5 py-12 text-center text-sm text-muted">
              还没有技能,点击右上角添加。
            </li>
          ) : null}
        </ul>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="删除技能"
        description="删除后前台将不再展示该项,确定继续吗?"
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
