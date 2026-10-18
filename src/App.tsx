/**
 * 路由表。
 * 使用 HashRouter:静态托管下刷新任意路由都不会 404。
 */

import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import PostsAdmin from './pages/admin/PostsAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import { useTheme } from './hooks/useTheme';

export default function App(): JSX.Element {
  useTheme();

  return (
    <HashRouter>
      <Routes>
        {/* 前台 */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>

        {/* 后台登录 */}
        <Route path="/admin/login" element={<Login />} />

        {/* 后台管理(需要登录) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="posts" element={<PostsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* 未知路径回到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
