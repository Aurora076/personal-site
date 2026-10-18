/**
 * 后台登录页。
 * 演示账号:admin / aurora2026
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Field, Input } from '../../components/ui';
import { DEMO_PASSWORD, DEMO_USERNAME, isLoggedIn, login } from '../../api/auth';

export default function Login(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  if (isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? '登录失败');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-lg font-bold text-white">
            A
          </div>
          <h1 className="text-xl font-semibold text-ink">后台管理登录</h1>
          <p className="mt-1.5 text-sm text-muted">登录后可管理个人信息、项目与博客</p>
        </div>

        <form
          onSubmit={(event) => void onSubmit(event)}
          className="rounded-card border border-line bg-card/80 p-6 backdrop-blur-sm"
        >
          <div className="space-y-4">
            <Field label="用户名">
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                autoFocus
              />
            </Field>

            <Field label="密码">
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Field>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? '登录中…' : '登录'}
          </Button>

          <div className="mt-5 rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-xs leading-6 text-muted">
            <p className="font-medium text-ink">演示账号</p>
            <p>
              用户名:{DEMO_USERNAME} · 密码:{DEMO_PASSWORD}
            </p>
            <p className="mt-1 text-[11px]">本系统为演示模式,数据保存在本机浏览器。</p>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          <a href="#/" className="transition hover:text-[var(--accent)]">
            ← 返回个人网站
          </a>
        </p>
      </div>
    </div>
  );
}
