import { useEffect, useRef, useState } from 'react';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const EMOJIS = ['📦','🎉','✨','🚀','⭐','💎','🔥','🌈','🎊','💥','🪄','🐉'];
const COLORS  = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff6bd6','#ff9e3d','#00e5ff'];
const N       = 80;
const DURATION = 3800;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  emoji: string;
  size: number;
  rot: number;
  rotV: number;
  alpha: number;
  trail: { x: number; y: number }[];
}

export default function KonamiEgg() {
  const [active, setActive]       = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particles   = useRef<Particle[]>([]);
  const animRef     = useRef<number>(0);
  const startTime   = useRef(0);
  const seq         = useRef<string[]>([]);

  /* ── listen for Konami ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length);
      if (seq.current.join(',') === KONAMI.join(',')) {
        seq.current = [];
        fire();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function fire() {
    setActive(true);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), DURATION - 800);
    setTimeout(() => setActive(false), DURATION + 200);
  }

  /* ── run particle sim when active ── */
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    particles.current = Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 14;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 18 + Math.random() * 32,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.25,
        alpha: 1,
        trail: [],
      };
    });

    startTime.current = performance.now();

    const draw = (ts: number) => {
      const elapsed = ts - startTime.current;
      const t = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* rainbow flash at start */
      if (t < 0.08) {
        const flashAlpha = (1 - t / 0.08) * 0.35;
        const hue = (ts * 0.5) % 360;
        ctx.fillStyle = `hsla(${hue},100%,60%,${flashAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const p of particles.current) {
        /* physics */
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.38;                          // gravity
        p.vx *= 0.995;                         // slight air resistance
        p.rot += p.rotV;
        p.alpha = Math.max(0, 1 - Math.pow(t, 1.4));

        /* faint trail */
        for (let j = 0; j < p.trail.length; j++) {
          const tj = j / p.trail.length;
          ctx.save();
          ctx.globalAlpha = p.alpha * tj * 0.25;
          ctx.translate(p.trail[j].x, p.trail[j].y);
          ctx.rotate(p.rot);
          ctx.font = `${p.size * 0.6}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
          ctx.restore();
        }

        /* main emoji */
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9997,
          pointerEvents: 'none',
          display: active ? 'block' : 'none',
        }}
      />

      {showBanner && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9996,
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(22px, 4vw, 46px)',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 0 40px rgba(255,200,0,.9), 0 2px 20px rgba(0,0,0,.7)',
            animation: 'konamiBoom .5s cubic-bezier(.16,1.6,.3,1) both',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            📦 you found the egg! 📦
            <div style={{
              fontSize: '0.42em',
              opacity: 0.75,
              marginTop: '10px',
              fontWeight: 400,
              letterSpacing: '.12em',
              animation: 'konamiFade 1s .3s both',
            }}>
              ↑↑↓↓←→←→BA
            </div>
          </div>
        </div>
      )}
    </>
  );
}
