import { useEffect, useRef } from 'react';

const HISTORY = 48;

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number }[]>([]);
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
      points.current.push({ x: e.clientX, y: e.clientY });
      if (points.current.length > HISTORY) points.current.shift();
    };
    window.addEventListener('mousemove', onMove);

    const draw = (ts: number) => {
      timeRef.current = ts * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = points.current;
      if (pts.length < 4) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      /* ── Draw multiple ribbon passes for glass / light effect ── */
      const passes = [
        { width: 28, alpha: 0.07, hueShift: 0,   blur: true  },  // wide outer glow
        { width: 14, alpha: 0.13, hueShift: 40,  blur: false },  // mid glow
        { width:  7, alpha: 0.30, hueShift: 80,  blur: false },  // inner ribbon
        { width:  2, alpha: 0.90, hueShift: 160, blur: false },  // bright core
      ];

      for (const pass of passes) {
        ctx.save();
        if (pass.blur) {
          ctx.filter = 'blur(6px)';
        }

        for (let i = 1; i < pts.length; i++) {
          const t = i / pts.length;                 // 0 = tail, 1 = head
          const alpha = pass.alpha * (t * t);
          const width = pass.width * (0.2 + t * 0.8);

          /* hue cycles along the ribbon + slow time drift for shimmer */
          const hue = (t * 200 + pass.hueShift + timeRef.current * 40) % 360;
          const sat = 70 + t * 30;
          const lig = 70 + t * 25;

          const p0 = pts[i - 1];
          const p1 = pts[i];

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);

          /* gradient along each segment */
          const seg = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          const hPrev = ((t - 1 / pts.length) * 200 + pass.hueShift + timeRef.current * 40) % 360;
          seg.addColorStop(0, `hsla(${hPrev}, ${sat}%, ${lig}%, ${alpha * 0.7})`);
          seg.addColorStop(1, `hsla(${hue}, ${sat}%, ${lig}%, ${alpha})`);

          ctx.strokeStyle = seg;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalCompositeOperation = 'lighter';
          ctx.stroke();
        }

        ctx.restore();
      }

      /* ── Sparkle at cursor head ── */
      if (pts.length > 0) {
        const head = pts[pts.length - 1];
        const sparkHue = (timeRef.current * 80) % 360;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 18);
        glow.addColorStop(0,   `hsla(${sparkHue}, 100%, 95%, 0.9)`);
        glow.addColorStop(0.3, `hsla(${sparkHue + 60}, 90%, 75%, 0.4)`);
        glow.addColorStop(1,   `hsla(${sparkHue + 120}, 80%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        /* tiny bright dot */
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, 0.95)`;
        ctx.fill();

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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  );
}
