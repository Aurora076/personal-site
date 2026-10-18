/**
 * 前台区块容器:统一的标题、副标题与间距。
 */

import type { ReactNode } from 'react';

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-24">
      <div className="mx-auto max-w-content px-5">
        <div className="mb-12 max-w-2xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-3 text-sm leading-7 text-muted">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
