/**
 * 前台布局:星空背景 + 导航 + 内容 + 页脚。
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Starfield from '../components/Starfield';
import { useApi } from '../hooks/useApi';
import { useTheme } from '../hooks/useTheme';
import { getSettings } from '../api/settings';

export default function PublicLayout(): JSX.Element {
  useTheme();
  const { data: settings } = useApi(getSettings);

  return (
    <div className="relative min-h-screen">
      <Starfield enabled={settings?.showStarfield ?? true} />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
