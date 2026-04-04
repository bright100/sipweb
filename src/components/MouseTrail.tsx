import { useEffect, useRef } from 'react';

const MAX_PTS = 60;

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raw = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const history = useRef<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);

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
      raw.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      /* spring-follow the raw mouse position */
      const ease = 0.18;
      if (raw.current.x > -9000) {
        smooth.current.x += (raw.current.x - smooth.current.x) * ease;
        smooth.current.y += (raw.current.y - smooth.current.y) * ease;
        history.current.push({ x: smooth.current.x, y: smooth.current.y });
        if (history.current.length > MAX_PTS) history.current.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = history.current;
      if (pts.length < 3) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      /* ── Build catmull-rom smooth path points ── */
      const curve: { x: number; y: number }[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (let t = 0; t < 1; t += 0.25) {
          const t2 = t * t, t3 = t2 * t;
          curve.push({
            x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
            y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
          });
        }
      }
      curve.push(pts[pts.length - 1]);

      const n = curve.length;
      if (n < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      /* ── Pass 1: wide diffuse outer haze ── */
      for (let i = 1; i < n; i++) {
        const t = i / n;
        const alpha = t * t * 0.06;
        const width = 40 * t;
        const p0 = curve[i - 1], p1 = curve[i];

        const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        g.addColorStop(0, `rgba(160,210,255,${alpha * 0.6})`);
        g.addColorStop(1, `rgba(200,230,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.filter = 'blur(8px)';
        ctx.stroke();
      }
      ctx.filter = 'none';

      /* ── Pass 2: mid glow ── */
      for (let i = 1; i < n; i++) {
        const t = i / n;
        const alpha = t * t * 0.22;
        const width = 10 * t;
        const p0 = curve[i - 1], p1 = curve[i];

        const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        g.addColorStop(0, `rgba(180,220,255,${alpha * 0.7})`);
        g.addColorStop(1, `rgba(220,240,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      /* ── Pass 3: bright inner filament ── */
      for (let i = 1; i < n; i++) {
        const t = i / n;
        const alpha = t * t * 0.85;
        const width = 2.5 * t;
        const p0 = curve[i - 1], p1 = curve[i];

        const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        g.addColorStop(0, `rgba(220,240,255,${alpha * 0.7})`);
        g.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      /* ── Head: crystalline burst at cursor ── */
      const head = curve[n - 1];
      const headGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 22);
      headGlow.addColorStop(0,   'rgba(255,255,255,0.95)');
      headGlow.addColorStop(0.2, 'rgba(200,235,255,0.50)');
      headGlow.addColorStop(0.6, 'rgba(160,210,255,0.15)');
      headGlow.addColorStop(1,   'rgba(140,200,255,0)');
      ctx.beginPath();
      ctx.arc(head.x, head.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = headGlow;
      ctx.fill();

      /* tiny diamond-bright core */
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();

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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  );
}
