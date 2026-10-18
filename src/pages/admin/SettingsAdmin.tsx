/**
 * 后台 — 站点设置。
 */

import { useEffect, useState } from 'react';
import type { SiteSettings } from '../../api/types';
import { getSettings, saveSettings } from '../../api/settings';
import { Button, Card, Field, Input, Loading } from '../../components/ui';
import { hexToRgbChannels } from '../../utils/color';

const PRESET_COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

export default function SettingsAdmin(): JSX.Element {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getSettings().then(setSettings);
  }, []);

  if (!settings) return <Loading />;

  const patch = (partial: Partial<SiteSettings>): void => {
    setSettings({ ...settings, ...partial });
    setSaved(false);
    // 强调色实时预览(同时更新 RGB 通道,供透明度类名使用)
    if (partial.accentColor) {
      document.documentElement.style.setProperty('--accent', partial.accentColor);
      document.documentElement.style.setProperty(
        '--accent-rgb',
        hexToRgbChannels(partial.accentColor)
      );
    }
  };

  const onSave = async (): Promise<void> => {
    setSaving(true);
    await saveSettings(settings);
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="max-w-2xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">站点设置</h1>
          <p className="mt-1.5 text-sm text-muted">修改站点的全局外观与文案。</p>
        </div>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-xs text-emerald-300">已保存 ✓</span> : null}
          <Button onClick={() => void onSave()} disabled={saving}>
            {saving ? '保存中…' : '保存设置'}
          </Button>
        </div>
      </header>

      <Card className="space-y-6">
        <Field label="站点标题" hint="显示在浏览器标签页上">
          <Input
            value={settings.siteTitle}
            onChange={(e) => patch({ siteTitle: e.target.value })}
          />
        </Field>

        <Field label="强调色" hint="影响按钮、链接、进度条等">
          <div className="flex flex-wrap items-center gap-2.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`使用颜色 ${color}`}
                onClick={() => patch({ accentColor: color })}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  settings.accentColor.toUpperCase() === color
                    ? 'border-white'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <Input
              className="w-32"
              value={settings.accentColor}
              onChange={(e) => patch({ accentColor: e.target.value })}
            />
          </div>
        </Field>

        <Field label="页脚文案">
          <Input
            value={settings.footerText}
            onChange={(e) => patch({ footerText: e.target.value })}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={settings.showStarfield}
            onChange={(e) => patch({ showStarfield: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          显示星空背景
        </label>
      </Card>

      <div className="mt-6 rounded-card border border-amber-500/20 bg-amber-500/5 p-5 text-xs leading-6 text-amber-200/80">
        <p className="font-medium text-amber-200">关于数据存储</p>
        <p className="mt-1">
          当前为演示模式,所有内容保存在本机浏览器的 localStorage 中,不会上传到服务器。
          换设备或清除浏览器数据后会恢复为默认内容。后续版本将接入真实后端实现多设备同步。
        </p>
      </div>
    </div>
  );
}
