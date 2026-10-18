/** 项目读写 */

import type { Project } from './types';
import { STORAGE_KEYS, delay, ensureSeeded, read, uid, write } from './storage';
import { seedProjects } from './seed';

export async function getProjects(): Promise<Project[]> {
  ensureSeeded();
  await delay();
  return read<Project[]>(STORAGE_KEYS.projects, seedProjects);
}

export async function getProject(id: string): Promise<Project | null> {
  const list = await getProjects();
  return list.find((item) => item.id === id) ?? null;
}

export async function saveProject(project: Project): Promise<Project> {
  await delay();
  const list = read<Project[]>(STORAGE_KEYS.projects, seedProjects);
  const next = project.id ? project : { ...project, id: uid() };
  const index = list.findIndex((item) => item.id === next.id);

  if (index >= 0) list[index] = next;
  else list.unshift(next);

  write(STORAGE_KEYS.projects, list);
  return next;
}

export async function deleteProject(id: string): Promise<void> {
  await delay();
  const list = read<Project[]>(STORAGE_KEYS.projects, seedProjects);
  write(STORAGE_KEYS.projects, list.filter((item) => item.id !== id));
}
