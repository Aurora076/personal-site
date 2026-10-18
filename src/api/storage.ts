/**
 * localStorage 读写封装 + 种子数据初始化。
 * 所有 API 模块都通过这里访问存储,便于将来整体替换为真实后端。
 */

import type { Post, Profile, Project, SiteSettings, Skill } from './types';
import { seedPosts, seedProfile, seedProjects, seedSettings, seedSkills } from './seed';

export const STORAGE_KEYS = {
  profile: 'ps.profile',
  skills: 'ps.skills',
  projects: 'ps.projects',
  posts: 'ps.posts',
  settings: 'ps.settings',
  token: 'ps.token',
} as const;

/** 数据变更事件名,页面可监听它实现自动刷新 */
export const DATA_EVENT = 'ps:data-changed';

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  // 通知前台页面数据已变化
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
}

/** 生成简单的唯一 id */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** 模拟网络延迟,方便将来切换到真实接口 */
export function delay(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 首次访问时写入种子数据 */
export function ensureSeeded(): void {
  if (!localStorage.getItem(STORAGE_KEYS.profile)) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(seedProfile));
  }
  if (!localStorage.getItem(STORAGE_KEYS.skills)) {
    localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(seedSkills));
  }
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(seedProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.posts)) {
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(seedPosts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(seedSettings));
  }
}

/* 类型再导出,减少组件的导入路径 */
export type { Post, Profile, Project, SiteSettings, Skill };
