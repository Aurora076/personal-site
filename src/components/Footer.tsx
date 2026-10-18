/**
 * 前台页脚。
 */

import { useApi } from '../hooks/useApi';
import { getProfile } from '../api/profile';
import { getSettings } from '../api/settings';

export default function Footer(): JSX.Element {
  const { data: profile } = useApi(getProfile);
  const { data: settings } = useApi(getSettings);

  return (
    <footer className="border-t border-line bg-bg/60 py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 text-sm text-muted md:flex-row">
        <p>{settings?.footerText ?? '用代码记录想法,用作品说明自己。'}</p>
        <p>
          © {new Date().getFullYear()} {profile?.name ?? 'Aurora'} · 保留所有权利
        </p>
      </div>
    </footer>
  );
}
