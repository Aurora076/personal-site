/**
 * 通用 UI 组件。
 * 保持轻量,不引入第三方 UI 库。
 */

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

/* ---------------- Button ---------------- */

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'subtle';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const BUTTON_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:brightness-110 shadow-[0_10px_24px_-12px_var(--accent)]',
  ghost:
    'border border-line bg-transparent text-ink hover:border-[var(--accent)] hover:text-[var(--accent)]',
  danger:
    'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
  subtle:
    'bg-white/5 text-muted hover:bg-white/10 hover:text-ink',
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-btn px-4 py-2.5 text-sm font-medium transition duration-200 ease-smooth disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_CLASS[variant]} ${className}`}
      {...rest}
    />
  );
}

/* ---------------- 表单 ---------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const INPUT_CLASS =
  'w-full rounded-btn border border-line bg-[#0D1322] px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-600 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-accent/20';

export function Input(props: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  const { className = '', ...rest } = props;
  return <input className={`${INPUT_CLASS} ${className}`} {...rest} />;
}

export function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
): JSX.Element {
  const { className = '', ...rest } = props;
  return <textarea className={`${INPUT_CLASS} resize-y ${className}`} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>): JSX.Element {
  const { className = '', ...rest } = props;
  return <select className={`${INPUT_CLASS} ${className}`} {...rest} />;
}

/* ---------------- 卡片 ---------------- */

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`rounded-card border border-line bg-card/80 p-6 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- 徽章 ---------------- */

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-white/5 px-2.5 py-0.5 text-xs text-muted ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------------- 加载 / 空状态 ---------------- */

export function Loading({ text = '加载中…' }: { text?: string }): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
      {text}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <div className="rounded-card border border-dashed border-line py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1.5 text-xs text-muted">{description}</p> : null}
    </div>
  );
}

/* ---------------- 确认弹窗 ---------------- */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认删除',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}): JSX.Element | null {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card border border-line bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-muted">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
