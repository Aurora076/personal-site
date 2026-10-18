/**
 * 演示用的客户端登录。
 * 注意:这是纯前端认证,仅用于区分前台/后台入口,不构成真实的安全边界。
 * 真实项目中应改为服务端签发的会话或 JWT。
 */

import type { ApiResult } from './types';
import { STORAGE_KEYS, delay } from './storage';

/** 演示账号 —— 正式项目请替换为服务端校验 */
export const DEMO_USERNAME = 'admin';
export const DEMO_PASSWORD = 'aurora2026';

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

export async function login(username: string, password: string): Promise<ApiResult> {
  await delay(350);

  if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    return { ok: false, error: '用户名或密码错误' };
  }

  // 只保存随机 token,不保存密码
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  localStorage.setItem(STORAGE_KEYS.token, token);
  return { ok: true };
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
}
