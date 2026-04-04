import { useEffect, useRef } from 'react';

const MAX_PTS = 80;
const RIBBON_WIDTH = 52;

function catmullRom(pts: { x: number; y: number }[]) {
  const curve: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t, t3 = t2 * t;
      curve.push({
        x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
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

    const draw = (ts: number) => {
      timeRef.current = ts * 0.001;

      if (raw.current.x > -9000) {
        smooth.current.x += (raw.current.x - smooth.current.x) * 0.14;
        smooth.current.y += (raw.current.y - smooth.current.y) * 0.14;
        history.current.push({ x: smooth.current.x, y: smooth.current.y });
        if (history.current.length > MAX_PTS) history.current.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = history.current;
      if (pts.length < 4) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const curve = catmullRom(pts);
      const n = curve.length;
      if (n < 2) { animRef.current = requestAnimationFrame(draw); return; }

      /* ── Build ribbon: left + right edge points ── */
      const left: { x: number; y: number }[] = [];
      const right: { x: number; y: number }[] = [];

      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);               // 0=tail, 1=head
        const halfW = RIBBON_WIDTH * (t * t * t) * 0.5;

        // tangent via neighbouring points
        const prev = curve[Math.max(0, i - 1)];
        const next = curve[Math.min(n - 1, i + 1)];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny =  dx / len;

        const p = curve[i];
        left.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
        right.push({ x: p.x - nx * halfW, y: p.y - ny * halfW });
      }

      /* ── Build ribbon path (outline) ── */
      const buildPath = () => {
        ctx.beginPath();
        ctx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
        for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
        ctx.closePath();
      };

      const time = timeRef.current;

      /* ── LAYER 1: glass base (very light translucent white) ── */
      ctx.save();
      buildPath();
      const baseGrad = ctx.createLinearGradient(
        curve[0].x, curve[0].y,
        curve[n - 1].x, curve[n - 1].y
      );
      baseGrad.addColorStop(0, 'rgba(220,230,255,0)');
      baseGrad.addColorStop(0.4, 'rgba(230,235,255,0.12)');
      baseGrad.addColorStop(1, 'rgba(240,245,255,0.25)');
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.restore();

      /* ── LAYER 2–5: iridescent color washes (screen blend) ── */
      const washes = [
        { hue: 210 + Math.sin(time * 0.4) * 20, offsetX:  0.3, alpha: 0.55 },
        { hue: 270 + Math.sin(time * 0.3) * 25, offsetX: -0.2, alpha: 0.45 },
        { hue:  20 + Math.sin(time * 0.5) * 15, offsetX:  0.5, alpha: 0.35 },
        { hue: 320 + Math.sin(time * 0.6) * 20, offsetX: -0.4, alpha: 0.30 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const w of washes) {
        buildPath();
        // gradient perpendicular to ribbon using offset
        const headPt = curve[n - 1];
        const dx = w.offsetX * RIBBON_WIDTH;
        const iriGrad = ctx.createRadialGradient(
          headPt.x + dx, headPt.y, 0,
          headPt.x, headPt.y, n * 0.8
        );
        iriGrad.addColorStop(0, `hsla(${w.hue}, 90%, 75%, ${w.alpha})`);
        iriGrad.addColorStop(0.4, `hsla(${(w.hue + 40) % 360}, 80%, 60%, ${w.alpha * 0.6})`);
        iriGrad.addColorStop(1, `hsla(${(w.hue + 100) % 360}, 70%, 45%, 0)`);
        ctx.fillStyle = iriGrad;
        ctx.fill();
      }
      ctx.restore();

      /* ── LAYER 6: specular highlight (bright strip along left edge) ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < n; i++) {
        const t = i / (n - 1);
        const mx = (left[i].x * 3 + curve[i].x) / 4;
        const my = (left[i].y * 3 + curve[i].y) / 4;
        ctx.lineTo(mx, my);
      }
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(left[i].x, left[i].y);
      ctx.closePath();
      const specGrad = ctx.createLinearGradient(curve[0].x, curve[0].y, curve[n-1].x, curve[n-1].y);
      specGrad.addColorStop(0, 'rgba(255,255,255,0)');
      specGrad.addColorStop(0.7, 'rgba(255,255,255,0.18)');
      specGrad.addColorStop(1, 'rgba(255,255,255,0.60)');
      ctx.fillStyle = specGrad;
      ctx.fill();
      ctx.restore();

      /* ── LAYER 7: thin bright edge line ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
      const edgeGrad = ctx.createLinearGradient(curve[0].x, curve[0].y, curve[n-1].x, curve[n-1].y);
      edgeGrad.addColorStop(0, 'rgba(200,220,255,0)');
      edgeGrad.addColorStop(0.5, 'rgba(220,235,255,0.4)');
      edgeGrad.addColorStop(1, 'rgba(255,255,255,0.95)');
      ctx.strokeStyle = edgeGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      /* ── HEAD: caustic blob ── */
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const head = curve[n - 1];
      const blobR = 36;
      const blobH = (210 + time * 30) % 360;
      const blob = ctx.createRadialGradient(head.x - 8, head.y - 8, 0, head.x, head.y, blobR);
      blob.addColorStop(0,   `hsla(0, 0%, 100%, 0.90)`);
      blob.addColorStop(0.25,`hsla(${blobH}, 90%, 80%, 0.55)`);
      blob.addColorStop(0.6, `hsla(${(blobH + 60) % 360}, 80%, 65%, 0.25)`);
      blob.addColorStop(1,   `hsla(${(blobH + 120) % 360}, 70%, 55%, 0)`);
      ctx.beginPath();
      ctx.arc(head.x, head.y, blobR, 0, Math.PI * 2);
      ctx.fillStyle = blob;
      ctx.fill();
      ctx.restore();

      /* ── FINAL: outer soft glow behind everything ── */
      ctx.save();
      ctx.filter = 'blur(14px)';
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.35;
      buildPath();
      const glowGrad = ctx.createLinearGradient(curve[0].x, curve[0].y, curve[n-1].x, curve[n-1].y);
      glowGrad.addColorStop(0, 'rgba(160,190,255,0)');
      glowGrad.addColorStop(0.5, 'rgba(180,160,255,0.5)');
      glowGrad.addColorStop(1, 'rgba(200,220,255,0.8)');
      ctx.fillStyle = glowGrad;
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
