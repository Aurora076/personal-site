/**
 * 颜色工具:把十六进制颜色转换成 "r g b" 通道字符串,
 * 供 CSS 变量 --accent-rgb 使用,从而支持 Tailwind 的透明度修饰符。
 */

export function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace('#', '').trim();

  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    // 非法输入时退回默认强调色
    return '99 102 241';
  }

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
}
