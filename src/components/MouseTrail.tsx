import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  born: number;
}

const MAX_RADIUS = 380;
const DURATION   = 4200;
const REST_DELAY = 160; // ms of stillness before we consider mouse "rested"

export default function MouseTrail() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const ripples    = useRef<Ripple[]>([]);
  const animRef    = useRef<number>(0);
  const mouse      = useRef({ x: -9999, y: -9999 });
  const lastMove   = useRef(0);
  const didRest    = useRef(false); // have we already fired a ripple for this rest?

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouse.current  = { x: e.clientX, y: e.clientY };
      lastMove.current = performance.now();
      didRest.current  = false; // reset so next rest spawns a fresh ripple
    };
    window.addEventListener('mousemove', onMove);

    const draw = (ts: number) => {
      /* detect rest: mouse has been still for REST_DELAY ms */
      const idle = ts - lastMove.current;
      if (idle >= REST_DELAY && !didRest.current && mouse.current.x > -9000) {
        didRest.current = true;
        ripples.current.push({ x: mouse.current.x, y: mouse.current.y, born: ts });
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* prune dead ripples */
      ripples.current = ripples.current.filter(r => ts - r.born < DURATION);

      for (const r of ripples.current) {
        const age = ts - r.born;
        const t   = age / DURATION; // 0 → 1

        for (let ring = 0; ring < 3; ring++) {
          const tRing = t - ring * 0.16;
          if (tRing <= 0 || tRing >= 1) continue;

          const radius = tRing * MAX_RADIUS;
          const alpha  = Math.pow(1 - tRing, 1.2) * 0.20;
          const lineW  = (1 - tRing) * 1.8 + 0.3;

          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(190, 220, 255, ${alpha})`;
          ctx.lineWidth = lineW;
          ctx.stroke();

          /* faint lens glow on the wavefront */
          if (ring === 0) {
            const ga = Math.pow(1 - tRing, 3) * 0.05;
            const g  = ctx.createRadialGradient(r.x, r.y, radius * 0.82, r.x, r.y, radius);
            g.addColorStop(0,   `rgba(215, 235, 255, 0)`);
            g.addColorStop(0.7, `rgba(215, 235, 255, ${ga})`);
            g.addColorStop(1,   `rgba(215, 235, 255, 0)`);
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
