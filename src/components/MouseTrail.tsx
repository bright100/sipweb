import { useEffect, useRef } from 'react';

const MAX_PTS = 48;
const EASE    = 0.12;

function catmullRom(pts: { x: number; y: number }[]) {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s <= 6; s++) {
      const t = s / 6, t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  return out;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raw       = useRef({ x: -9999, y: -9999 });
  const smooth    = useRef({ x: -9999, y: -9999 });
  const history   = useRef<{ x: number; y: number }[]>([]);
  const animRef   = useRef<number>(0);
  const masterAlpha = useRef(0);
  const lastMove  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      raw.current = { x: e.clientX, y: e.clientY };
      lastMove.current = performance.now();
    };
    window.addEventListener('mousemove', onMove);

    const draw = (ts: number) => {
      /* spring the smooth position toward raw */
      if (raw.current.x > -9000) {
        if (smooth.current.x < -9000) smooth.current = { ...raw.current };
        smooth.current.x += (raw.current.x - smooth.current.x) * EASE;
        smooth.current.y += (raw.current.y - smooth.current.y) * EASE;
        history.current.push({ x: smooth.current.x, y: smooth.current.y });
        if (history.current.length > MAX_PTS) history.current.shift();
      }

      /* fade in while moving, fade out on idle */
      const idle   = ts - lastMove.current;
      const target = idle < 80 ? 1 : 0;
      const rate   = target > masterAlpha.current ? 0.18 : 0.04;
      masterAlpha.current += (target - masterAlpha.current) * rate;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = history.current;
      if (pts.length < 4 || masterAlpha.current < 0.005) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const curve = catmullRom(pts);
      const n     = curve.length;

      /* ── brush stroke: tapered soft stroke in two blur passes ── */
      for (let pass = 0; pass < 2; pass++) {
        const blur    = pass === 0 ? 9 : 3;
        const opScale = pass === 0 ? 0.5 : 0.75;

        ctx.save();
        ctx.filter = `blur(${blur}px)`;

        for (let i = 1; i < n; i++) {
          const t0 = (i - 1) / (n - 1);
          const t1 = i       / (n - 1);
          const p0 = curve[i - 1];
          const p1 = curve[i];

          /* taper: thin at tail, fuller in the middle, thin at head tip */
          const bell   = Math.sin(t1 * Math.PI);        // 0→1→0
          const width  = 1.5 + bell * 7;                // 1.5 px tail → 8.5 px peak → 1.5 px head
          const alpha  = (0.04 + bell * 0.06) * opScale * masterAlpha.current;

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(220, 230, 245, ${alpha})`;
          ctx.lineWidth   = width;
          ctx.lineCap     = 'round';
          ctx.lineJoin    = 'round';
          ctx.stroke();
        }

        ctx.restore();
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
