/**
 * 轻量 Markdown 渲染器。
 * 支持:标题、粗体、斜体、行内代码、代码块、列表、引用、链接、段落。
 * 直接生成 React 元素,不使用 dangerouslySetInnerHTML,避免 XSS。
 */

import type { ReactNode } from 'react';
import { createElement } from 'react';

/* ---------------- 行内语法 ---------------- */

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('`')) {
      nodes.push(
        <code
          key={`${keyPrefix}-${key++}`}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-${key++}`} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*')) {
      nodes.push(
        <em key={`${keyPrefix}-${key++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        nodes.push(
          <a
            key={`${keyPrefix}-${key++}`}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {link[1]}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/* ---------------- 代码高亮(轻量) ---------------- */

const CODE_PATTERN =
  /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|new|await|async|interface|type|extends|implements|public|private|typeof|instanceof|throw|try|catch|finally|switch|case|break|continue|of|in|null|undefined|true|false)\b|(\b\d+(?:\.\d+)?\b)/g;

function highlightCode(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  CODE_PATTERN.lastIndex = 0;

  while ((match = CODE_PATTERN.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }

    const token = match[0];
    let className = 'text-slate-200';

    if (match[1]) className = 'text-slate-500 italic'; // 注释
    else if (match[2]) className = 'text-emerald-300'; // 字符串
    else if (match[3]) className = 'text-violet-300'; // 关键字
    else if (match[4]) className = 'text-amber-300'; // 数字

    nodes.push(
      <span key={key++} className={className}>
        {token}
      </span>
    );

    lastIndex = match.index + token.length;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
}

/* ---------------- 块级语法 ---------------- */

function isBlockStart(line: string): boolean {
  return (
    line.trim().startsWith('```') ||
    /^#{1,4}\s+/.test(line) ||
    line.startsWith('> ') ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line)
  );
}

const HEADING_CLASS: Record<number, string> = {
  1: 'mt-8 mb-4 text-2xl font-bold text-ink',
  2: 'mt-8 mb-3 text-xl font-bold text-ink',
  3: 'mt-6 mb-2 text-lg font-semibold text-ink',
  4: 'mt-5 mb-2 text-base font-semibold text-ink',
};

export interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

/** 提取标题,用于生成目录 */
export function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  let index = 0;

  for (const line of content.split('\n')) {
    const match = /^(#{1,3})\s+(.*)$/.exec(line.trim());
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        id: `heading-${index}`,
      });
      index += 1;
    }
  }

  return headings;
}

export default function Markdown({ content }: { content: string }): JSX.Element {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  let headingIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* 代码块 */
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过结束标记

      blocks.push(
        <div key={key++} className="my-5 overflow-hidden rounded-xl border border-line bg-[#0A0E18]">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="text-xs font-medium text-muted">{lang || 'code'}</span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
            </span>
          </div>
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
            <code className="font-mono">{highlightCode(codeLines.join('\n'))}</code>
          </pre>
        </div>
      );
      continue;
    }

    /* 标题 */
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const id = `heading-${headingIndex++}`;
      blocks.push(
        createElement(
          `h${level}`,
          { key: key++, id, className: `${HEADING_CLASS[level]} scroll-mt-24` },
          renderInline(heading[2])
        )
      );
      i += 1;
      continue;
    }

    /* 引用 */
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-5 border-l-2 border-[var(--accent)] bg-white/[0.03] py-3 pl-5 pr-4 text-muted"
        >
          {renderInline(quoteLines.join(' '), `q${key}`)}
        </blockquote>
      );
      continue;
    }

    /* 无序列表 */
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="my-4 list-disc space-y-2 pl-6 text-muted">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    /* 有序列表 */
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={key++} className="my-4 list-decimal space-y-2 pl-6 text-muted">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    /* 空行 */
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    /* 段落 */
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={key++} className="my-4 leading-8 text-muted">
        {renderInline(paragraph.join(' '), `p${key}`)}
      </p>
    );
  }

  return <div className="markdown">{blocks}</div>;
}
