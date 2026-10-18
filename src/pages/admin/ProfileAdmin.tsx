/**
 * 后台 — 个人信息管理。
 * 支持编辑基础信息、社交链接、工作经历与教育背景。
 */

import { useEffect, useState } from 'react';
import type { Profile } from '../../api/types';
import { getProfile, saveProfile } from '../../api/profile';
import { uid } from '../../api/storage';
import { Button, Card, Field, Input, Loading, Textarea } from '../../components/ui';

export default function ProfileAdmin(): JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getProfile().then(setProfile);
  }, []);

  if (!profile) return <Loading />;

  const patch = (partial: Partial<Profile>): void => {
    setProfile({ ...profile, ...partial });
    setSaved(false);
  };

  const onSave = async (): Promise<void> => {
    setSaving(true);
    await saveProfile(profile);
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="max-w-3xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">个人信息</h1>
          <p className="mt-1.5 text-sm text-muted">修改后前台会立即更新。</p>
        </div>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-xs text-emerald-300">已保存 ✓</span> : null}
          <Button onClick={() => void onSave()} disabled={saving}>
            {saving ? '保存中…' : '保存修改'}
          </Button>
        </div>
      </header>

      <Card className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="姓名">
            <Input value={profile.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="职位">
            <Input value={profile.role} onChange={(e) => patch({ role: e.target.value })} />
          </Field>
        </div>

        <Field label="一句话介绍">
          <Input value={profile.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="邮箱">
            <Input value={profile.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="所在地">
            <Input value={profile.location} onChange={(e) => patch({ location: e.target.value })} />
          </Field>
        </div>

        <Field label="头像地址" hint="留空则显示姓名首字母">
          <Input
            value={profile.avatar}
            onChange={(e) => patch({ avatar: e.target.value })}
            placeholder="https://…"
          />
        </Field>

        <Field label="个人简介" hint="空行分段">
          <Textarea
            rows={6}
            value={profile.bio}
            onChange={(e) => patch({ bio: e.target.value })}
          />
        </Field>
      </Card>

      {/* 社交链接 */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">社交链接</h2>
          <Button
            variant="subtle"
            onClick={() =>
              patch({ socials: [...profile.socials, { label: '新链接', url: 'https://' }] })
            }
          >
            + 添加
          </Button>
        </div>

        <div className="space-y-3">
          {profile.socials.map((social, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row">
              <Input
                className="sm:w-40"
                value={social.label}
                placeholder="名称"
                onChange={(e) => {
                  const next = [...profile.socials];
                  next[index] = { ...social, label: e.target.value };
                  patch({ socials: next });
                }}
              />
              <Input
                value={social.url}
                placeholder="https://…"
                onChange={(e) => {
                  const next = [...profile.socials];
                  next[index] = { ...social, url: e.target.value };
                  patch({ socials: next });
                }}
              />
              <Button
                variant="danger"
                onClick={() => patch({ socials: profile.socials.filter((_, i) => i !== index) })}
              >
                删除
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* 工作经历 */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">工作经历</h2>
          <Button
            variant="subtle"
            onClick={() =>
              patch({
                experiences: [
                  ...profile.experiences,
                  { id: uid(), company: '', role: '', period: '', description: '' },
                ],
              })
            }
          >
            + 添加
          </Button>
        </div>

        <div className="space-y-5">
          {profile.experiences.map((exp, index) => {
            const update = (partial: Partial<typeof exp>): void => {
              const next = [...profile.experiences];
              next[index] = { ...exp, ...partial };
              patch({ experiences: next });
            };

            return (
              <div key={exp.id} className="rounded-xl border border-line p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={exp.company}
                    placeholder="公司"
                    onChange={(e) => update({ company: e.target.value })}
                  />
                  <Input
                    value={exp.role}
                    placeholder="职位"
                    onChange={(e) => update({ role: e.target.value })}
                  />
                  <Input
                    value={exp.period}
                    placeholder="时间,如 2024.07 - 至今"
                    onChange={(e) => update({ period: e.target.value })}
                  />
                </div>
                <Textarea
                  className="mt-3"
                  rows={2}
                  value={exp.description}
                  placeholder="工作内容"
                  onChange={(e) => update({ description: e.target.value })}
                />
                <div className="mt-3 text-right">
                  <Button
                    variant="danger"
                    onClick={() =>
                      patch({
                        experiences: profile.experiences.filter((item) => item.id !== exp.id),
                      })
                    }
                  >
                    删除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 教育背景 */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">教育背景</h2>
          <Button
            variant="subtle"
            onClick={() =>
              patch({
                education: [
                  ...profile.education,
                  { id: uid(), school: '', degree: '', period: '' },
                ],
              })
            }
          >
            + 添加
          </Button>
        </div>

        <div className="space-y-3">
          {profile.education.map((edu, index) => {
            const update = (partial: Partial<typeof edu>): void => {
              const next = [...profile.education];
              next[index] = { ...edu, ...partial };
              patch({ education: next });
            };

            return (
              <div key={edu.id} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={edu.school}
                  placeholder="学校"
                  onChange={(e) => update({ school: e.target.value })}
                />
                <Input
                  value={edu.degree}
                  placeholder="专业 / 学历"
                  onChange={(e) => update({ degree: e.target.value })}
                />
                <Input
                  value={edu.period}
                  placeholder="时间"
                  onChange={(e) => update({ period: e.target.value })}
                />
                <Button
                  variant="danger"
                  onClick={() =>
                    patch({ education: profile.education.filter((item) => item.id !== edu.id) })
                  }
                >
                  删除
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? '保存中…' : '保存修改'}
        </Button>
      </div>
    </div>
  );
}
