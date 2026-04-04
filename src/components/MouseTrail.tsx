import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  born: number;
}

const MAX_RADIUS = 380;
const DURATION = 4000;    // ms a ripple lives
const SPAWN_INTERVAL = 220; // ms between new ripple spawns while moving

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const mouse = useRef({ x: -9999, y: -9999 });

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
      mouse.current = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      if (now - lastSpawn.current > SPAWN_INTERVAL) {
        lastSpawn.current = now;
        ripples.current.push({ x: e.clientX, y: e.clientY, born: now });
      }
    };
    window.addEventListener('mousemove', onMove);

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* prune dead ripples */
      ripples.current = ripples.current.filter(r => ts - r.born < DURATION);

      for (const r of ripples.current) {
        const age = ts - r.born;
        const t = age / DURATION;           // 0→1

        /* draw 3 rings per ripple origin, each offset in time */
        for (let ring = 0; ring < 3; ring++) {
          const tRing = t - ring * 0.18;    // stagger rings
          if (tRing <= 0 || tRing >= 1) continue;

          const radius = tRing * MAX_RADIUS;
          const alpha  = Math.pow(1 - tRing, 1.3) * 0.18; // slow, gentle fade

          /* thin ring stroke */
          const lineW = (1 - tRing) * 1.6 + 0.3;

          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(190, 220, 255, ${alpha})`;
          ctx.lineWidth = lineW;
          ctx.stroke();

          /* very faint inner fill for the slight "lens" distortion look */
          if (ring === 0) {
            const innerAlpha = Math.pow(1 - tRing, 4) * 0.04;
            const g = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, radius);
            g.addColorStop(0,   `rgba(210, 230, 255, 0)`);
            g.addColorStop(0.7, `rgba(210, 230, 255, 0)`);
            g.addColorStop(0.88,`rgba(220, 235, 255, ${innerAlpha * 1.5})`);
            g.addColorStop(1,   `rgba(210, 230, 255, 0)`);
            ctx.beginPath();
            ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
        }
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
      style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}
    />
  );
}
