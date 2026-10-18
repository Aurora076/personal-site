/** 站点设置读写 */

import type { SiteSettings } from './types';
import { STORAGE_KEYS, delay, ensureSeeded, read, write } from './storage';
import { seedSettings } from './seed';

export async function getSettings(): Promise<SiteSettings> {
  ensureSeeded();
  await delay();
  return read<SiteSettings>(STORAGE_KEYS.settings, seedSettings);
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await delay();
  write(STORAGE_KEYS.settings, settings);
}
