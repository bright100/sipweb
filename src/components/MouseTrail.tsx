import { useEffect, useRef } from 'react';

const MAX_PTS = 55;

function catmullRom(pts: { x: number; y: number }[]) {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < 4; s++) {
      const t = s / 4, t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y: 0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raw = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const history = useRef<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const opacity = useRef(0);
  const lastMove = useRef(0);

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
      timeRef.current = ts * 0.001;

      if (raw.current.x > -9000) {
        smooth.current.x += (raw.current.x - smooth.current.x) * 0.13;
        smooth.current.y += (raw.current.y - smooth.current.y) * 0.13;
        history.current.push({ x: smooth.current.x, y: smooth.current.y });
        if (history.current.length > MAX_PTS) history.current.shift();
      }

      /* fade master opacity with mouse movement */
      const idle = ts - lastMove.current;
      const target = idle < 60 ? 1 : 0;
      opacity.current += (target - opacity.current) * (target > opacity.current ? 0.15 : 0.05);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = history.current;
      if (pts.length < 3 || opacity.current < 0.004) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const curve = catmullRom(pts);
      const n = curve.length;
      const time = timeRef.current;
      const o = opacity.current;

      /* ── Draw everything into an offscreen canvas then blur the whole thing ── */
      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const oc = off.getContext('2d')!;

      /* Draw soft blobs along the path */
      oc.globalCompositeOperation = 'source-over';

      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);           // 0=tail, 1=head
        const p = curve[i];

        /* ripple: vary radius slightly like water */
        const ripple = 1 + Math.sin(t * Math.PI * 3 + time * 2.5) * 0.18;
        const r = (12 + t * 38) * ripple;

        /* very faint alpha — blobs overlap and merge */
        const alpha = t * t * 0.22;

        /* hue shifts gently along path for the iridescent water look */
        const hue = 195 + Math.sin(t * Math.PI + time * 0.6) * 20;
        const sat = 55 + t * 20;
        const lig = 72 + t * 15;

        const g = oc.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `hsla(${hue}, ${sat}%, ${lig}%, ${alpha})`);
        g.addColorStop(0.5, `hsla(${hue + 15}, ${sat - 10}%, ${lig - 8}%, ${alpha * 0.5})`);
        g.addColorStop(1,   'hsla(0,0%,100%,0)');

        oc.beginPath();
        oc.arc(p.x, p.y, r, 0, Math.PI * 2);
        oc.fillStyle = g;
        oc.fill();
      }

      /* small bright head blob */
      const head = curve[n - 1];
      const headH = (200 + time * 18) % 360;
      const hg = oc.createRadialGradient(head.x, head.y, 0, head.x, head.y, 22);
      hg.addColorStop(0,   `hsla(${headH}, 60%, 92%, 0.28)`);
      hg.addColorStop(0.5, `hsla(${headH + 30}, 50%, 80%, 0.12)`);
      hg.addColorStop(1,   'hsla(0,0%,100%,0)');
      oc.beginPath();
      oc.arc(head.x, head.y, 22, 0, Math.PI * 2);
      oc.fillStyle = hg;
      oc.fill();

      /* blur the whole offscreen canvas → soft, zero hard edges */
      ctx.save();
      ctx.filter = 'blur(18px)';
      ctx.globalAlpha = o;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(off, 0, 0);
      ctx.restore();

      /* second pass at less blur for a subtle inner crispness */
      ctx.save();
      ctx.filter = 'blur(6px)';
      ctx.globalAlpha = o * 0.55;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(off, 0, 0);
      ctx.restore();

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
