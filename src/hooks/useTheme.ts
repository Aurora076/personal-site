/**
 * 读取站点设置,把强调色写入 CSS 变量,并同步页面标题。
 * 设置变更后实时生效,无需刷新。
 */

import { useEffect } from 'react';
import { getSettings } from '../api/settings';
import { DATA_EVENT } from '../api/storage';
import { hexToRgbChannels } from '../utils/color';

export function useTheme(): void {
  useEffect(() => {
    let cancelled = false;

    const apply = async (): Promise<void> => {
      const settings = await getSettings();
      if (cancelled) return;

      const root = document.documentElement;
      root.style.setProperty('--accent', settings.accentColor);
      root.style.setProperty('--accent-rgb', hexToRgbChannels(settings.accentColor));
      document.title = settings.siteTitle;
    };

    void apply();
    window.addEventListener(DATA_EVENT, apply);

    return () => {
      cancelled = true;
      window.removeEventListener(DATA_EVENT, apply);
    };
  }, []);
}
