import { useEffect, useRef } from 'react';

const MAX_PTS = 60;
const RIBBON_WIDTH = 48;

function catmullRom(pts: { x: number; y: number }[]) {
  const curve: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < 5; s++) {
      const t = s / 5, t2 = t * t, t3 = t2 * t;
      curve.push({
        x: 0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y: 0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
      });
    }
  }
  curve.push(pts[pts.length - 1]);
  return curve;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raw = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const history = useRef<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const opacity = useRef(0);           // master opacity, fades in/out with movement
  const lastMoveTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = () => { lastMoveTime.current = performance.now(); };
    window.addEventListener('mousemove', (e) => {
      raw.current = { x: e.clientX, y: e.clientY };
      onMove();
    });

    const draw = (ts: number) => {
      timeRef.current = ts * 0.001;

      /* spring-follow */
      if (raw.current.x > -9000) {
        smooth.current.x += (raw.current.x - smooth.current.x) * 0.14;
        smooth.current.y += (raw.current.y - smooth.current.y) * 0.14;
        history.current.push({ x: smooth.current.x, y: smooth.current.y });
        if (history.current.length > MAX_PTS) history.current.shift();
      }

      /* fade opacity in/out based on whether mouse is moving */
      const idle = ts - lastMoveTime.current;
      const target = idle < 80 ? 1 : 0;   // start fading after 80ms of stillness
      opacity.current += (target - opacity.current) * (target > opacity.current ? 0.12 : 0.06);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = history.current;
      if (pts.length < 4 || opacity.current < 0.005) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const curve = catmullRom(pts);
      const n = curve.length;
      if (n < 2) { animRef.current = requestAnimationFrame(draw); return; }

      /* build ribbon edges */
      const left: { x: number; y: number }[] = [];
      const right: { x: number; y: number }[] = [];
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const halfW = RIBBON_WIDTH * (t * t) * 0.5;
        const prev = curve[Math.max(0, i - 1)];
        const next = curve[Math.min(n - 1, i + 1)];
        const dx = next.x - prev.x, dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const p = curve[i];
        left.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
        right.push({ x: p.x - nx * halfW, y: p.y - ny * halfW });
      }

      const buildPath = () => {
        ctx.beginPath();
        ctx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
        for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
        ctx.closePath();
      };

      const o = opacity.current;
      const time = timeRef.current;
      const head = curve[n - 1];
      const tail = curve[0];

      ctx.save();
      ctx.globalAlpha = o;

      /* 1 — glass base */
      ctx.save();
      buildPath();
      const base = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      base.addColorStop(0, 'rgba(210,225,255,0)');
      base.addColorStop(1, 'rgba(230,240,255,0.07)');
      ctx.fillStyle = base;
      ctx.fill();
      ctx.restore();

      /* 2 — iridescent washes (very low alpha) */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const washes = [
        { hue: 215 + Math.sin(time * 0.4) * 18, a: 0.10 },
        { hue: 275 + Math.sin(time * 0.3) * 22, a: 0.08 },
        { hue:  25 + Math.sin(time * 0.5) * 14, a: 0.07 },
      ];
      for (const w of washes) {
        buildPath();
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, n * 0.7);
        g.addColorStop(0, `hsla(${w.hue}, 80%, 75%, ${w.a})`);
        g.addColorStop(0.5, `hsla(${(w.hue + 50) % 360}, 70%, 60%, ${w.a * 0.5})`);
        g.addColorStop(1, 'hsla(0,0%,100%,0)');
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.restore();

      /* 3 — specular edge */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
      const edge = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      edge.addColorStop(0, 'rgba(255,255,255,0)');
      edge.addColorStop(0.6, 'rgba(255,255,255,0.06)');
      edge.addColorStop(1, 'rgba(255,255,255,0.18)');
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      /* 4 — head caustic (very subtle) */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const blobH = (210 + time * 25) % 360;
      const blob = ctx.createRadialGradient(head.x - 6, head.y - 6, 0, head.x, head.y, 28);
      blob.addColorStop(0,   'rgba(255,255,255,0.18)');
      blob.addColorStop(0.3, `hsla(${blobH}, 80%, 80%, 0.10)`);
      blob.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(head.x, head.y, 28, 0, Math.PI * 2);
      ctx.fillStyle = blob;
      ctx.fill();
      ctx.restore();

      /* 5 — outer diffuse glow */
      ctx.save();
      ctx.filter = 'blur(12px)';
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.12;
      buildPath();
      const glow = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      glow.addColorStop(0, 'rgba(150,180,255,0)');
      glow.addColorStop(1, 'rgba(180,210,255,0.6)');
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.restore();

      ctx.restore(); // globalAlpha wrapper

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
