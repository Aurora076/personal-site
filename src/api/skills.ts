/** 技能读写 */

import type { Skill } from './types';
import { STORAGE_KEYS, delay, ensureSeeded, read, uid, write } from './storage';
import { seedSkills } from './seed';

export async function getSkills(): Promise<Skill[]> {
  ensureSeeded();
  await delay();
  return read<Skill[]>(STORAGE_KEYS.skills, seedSkills);
}

/** 新建或更新一条技能(id 已存在则替换) */
export async function saveSkill(skill: Skill): Promise<Skill> {
  await delay();
  const list = read<Skill[]>(STORAGE_KEYS.skills, seedSkills);
  const next = skill.id ? skill : { ...skill, id: uid() };
  const index = list.findIndex((item) => item.id === next.id);

  if (index >= 0) list[index] = next;
  else list.push(next);

  write(STORAGE_KEYS.skills, list);
  return next;
}

export async function deleteSkill(id: string): Promise<void> {
  await delay();
  const list = read<Skill[]>(STORAGE_KEYS.skills, seedSkills);
  write(STORAGE_KEYS.skills, list.filter((item) => item.id !== id));
}
