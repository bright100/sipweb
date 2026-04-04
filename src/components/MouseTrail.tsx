import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);

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
    };
    window.addEventListener('mousemove', onMove);

    const spawnParticle = (now: number) => {
      if (now - lastSpawn.current < 20) return;
      lastSpawn.current = now;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2 + 0.2;
      const life = Math.random() * 40 + 30;

      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        vx: Math.cos(angle) * speed * 0.4,
        vy: Math.sin(angle) * speed * 0.4 - 0.5,
        life,
        maxLife: life,
        size: Math.random() * 3.5 + 1.5,
        hue: Math.random() * 40 + 10,
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouse.current.x > -900) spawnParticle(now);

      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        const t = p.life / p.maxLife;
        const alpha = t * t * 0.75;
        const r = p.size * t;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 62%, ${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue + 20}, 70%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;
        p.life -= 1;
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
