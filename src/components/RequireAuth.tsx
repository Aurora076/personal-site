/**
 * 后台路由守卫:未登录时重定向到登录页。
 * 注意:这是客户端守卫,仅用于防止误入,不构成真实安全边界。
 */

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../api/auth';

export default function RequireAuth({ children }: { children: ReactNode }): JSX.Element {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
