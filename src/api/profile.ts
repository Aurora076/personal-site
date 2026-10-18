/** 个人信息读写 */

import type { Profile } from './types';
import { STORAGE_KEYS, delay, ensureSeeded, read, write } from './storage';
import { seedProfile } from './seed';

export async function getProfile(): Promise<Profile> {
  ensureSeeded();
  await delay();
  return read<Profile>(STORAGE_KEYS.profile, seedProfile);
}

export async function saveProfile(profile: Profile): Promise<void> {
  await delay();
  write(STORAGE_KEYS.profile, profile);
}
