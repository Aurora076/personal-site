/**
 * Canvas 星空背景。
 * - 粒子缓慢漂移 + 闪烁
 * - 鼠标移动产生轻微视差
 * - 移动端降低粒子数量
 * - 尊重 prefers-reduced-motion
 * - 页面隐藏时暂停动画
 */

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
}

export default function Starfield({ enabled = true }: { enabled?: boolean }): JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let mouseX = 0;
    let mouseY = 0;

    const buildStars = (): void => {
      const area = width * height;
      const isMobile = width < 768;
      // 按面积估算,移动端乘以 0.4
      const raw = (area / 9000) * (isMobile ? 0.4 : 1);
      const count = Math.max(40, Math.min(Math.round(raw), 260));

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.55 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.2,
        driftX: (Math.random() - 0.5) * 0.05,
        driftY: (Math.random() - 0.5) * 0.05,
      }));
    };

    const resize = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const draw = (time: number): void => {
      ctx.clearRect(0, 0, width, height);

      // 鼠标视差
      const offsetX = mouseX * 18;
      const offsetY = mouseY * 18;

      for (const star of stars) {
        if (!reduceMotion) {
          star.x += star.driftX;
          star.y += star.driftY;
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        const twinkle = reduceMotion
          ? 1
          : 0.55 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.45;
        const alpha = Math.min(1, star.baseAlpha * twinkle);

        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 205, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      if (running && !reduceMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    const onMouseMove = (event: MouseEvent): void => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onVisibilityChange = (): void => {
      running = !document.hidden;
      if (running && !reduceMotion) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('visibilitychange', onVisibilityChange);

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
