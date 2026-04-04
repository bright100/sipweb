import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  stretch: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999, vx: 0, vy: 0, px: -999, py: -999 });
  const drops = useRef<Drop[]>([]);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      mouse.current.vx = mx - mouse.current.px;
      mouse.current.vy = my - mouse.current.py;
      mouse.current.px = mouse.current.x;
      mouse.current.py = mouse.current.y;
      mouse.current.x = mx;
      mouse.current.y = my;
    };
    window.addEventListener('mousemove', onMove);

    const spawnDrops = () => {
      if (mouse.current.x < -900) return;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * 6;
        const life = Math.random() * 35 + 40;
        drops.current.push({
          x: mouse.current.x + spread,
          y: mouse.current.y,
          vx: spread * 0.06 + (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 2.5 + 3.5,
          life,
          maxLife: life,
          size: Math.random() * 2 + 1.2,
          hue: Math.random() * 30 + 15,
          stretch: Math.random() * 1.4 + 1.0,
        });
      }
    };

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frameRef.current % 2 === 0) spawnDrops();

      drops.current = drops.current.filter(d => d.life > 0);

      for (const d of drops.current) {
        const t = d.life / d.maxLife;
        const alpha = t < 0.25 ? t / 0.25 * 0.7 : t * 0.7;
        const w = d.size * (0.5 + t * 0.5);
        const h = w * d.stretch * (1 + (1 - t) * 2);

        ctx.save();
        ctx.translate(d.x, d.y);

        const grad = ctx.createLinearGradient(0, -h, 0, h * 0.6);
        grad.addColorStop(0, `hsla(${d.hue}, 90%, 72%, 0)`);
        grad.addColorStop(0.2, `hsla(${d.hue}, 90%, 70%, ${alpha})`);
        grad.addColorStop(0.6, `hsla(${d.hue + 15}, 80%, 58%, ${alpha * 0.8})`);
        grad.addColorStop(1, `hsla(${d.hue + 25}, 70%, 45%, 0)`);

        ctx.beginPath();
        ctx.ellipse(0, h * 0.3, w, h, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.18;
        d.vx *= 0.97;
        d.life -= 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  );
}
