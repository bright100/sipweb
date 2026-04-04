import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Tag, FadeIn, InlineCode, SectionLabel, CodeBlock } from '@/components/shared';
import Terminal from '@/components/Terminal';
import ThreeScene from '@/components/ThreeScene';
import ErrorBoundary from '@/components/ErrorBoundary';

function StatBar() {
  const facts = [
    { code: 'cpm install fmt', result: '0.8s', note: 'cached' },
    { code: 'SHA-256', result: 'every artifact', note: 'verified' },
    { code: 'PubGrub', result: 'conflict-free', note: 'resolver' },
    { code: 'postinstall', result: 'disabled', note: 'by default' },
    { code: '~200 options', result: 'vs 6,000', note: 'in distros' },
    { code: 'open source', result: 'MIT', note: 'licensed' },
  ];
  return (
    <div style={{ borderTop: '1px solid hsl(var(--border-dim))', borderBottom: '1px solid hsl(var(--border-dim))', background: 'hsl(var(--bg-sunken))', overflow: 'hidden' }}>
      <div className="statbar-ticker">
        {facts.map((f, i) => (
          <div key={i} className="statbar-item">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-2))' }}>
              <span style={{ color: 'hsl(var(--ink-4))' }}>$ </span>{f.code}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>→</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--accent-coral))' }}>{f.result}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>({f.note})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Watch Mode 3D helpers ── */

function WavePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = new THREE.PlaneGeometry(18, 6, 128, 48);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const time = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4 + time * 1.2) * 0.3 + Math.cos(y * 0.6 + time * 0.8) * 0.2 + Math.sin((x + y) * 0.3 + time * 0.6) * 0.15);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1.5, -2]}>
      <meshStandardMaterial color="#8b5e3c" wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function PulsingOrb({ position, color, speed = 1, size = 0.4 }: { position: [number, number, number]; color: string; speed?: number; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(size + Math.sin(clock.getElapsedTime() * speed) * 0.08);
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial color={color} transparent opacity={0.7} distort={0.3} speed={2} />
      </mesh>
    </Float>
  );
}

function FileIcon({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.65, 0.06]} />
        <MeshWobbleMaterial color="#4d7a5a" factor={0.15} speed={1.5} transparent opacity={0.8} />
      </mesh>
    </Float>
  );
}

function WatchTerminalDemo() {
  const lines = [
    { text: '$ cpm run build --watch', color: '#e8e5df', bold: true },
    { text: '👀 Watching src/, include/...', color: '#5c9ccc', bold: false },
    { text: '✓ Initial build: bin/myapp in 0.8s', color: '#6b8f5e', bold: false },
    { text: '', color: '', bold: false },
    { text: '  [14:32:07] src/main.cpp modified', color: '#9c9790', bold: false },
    { text: '  🔄 Recompiling 1 unit...', color: '#b87d20', bold: false },
    { text: '  ✓ rebuilt in 0.12s', color: '#6b8f5e', bold: false },
    { text: '', color: '', bold: false },
    { text: '  [14:32:15] include/parser.h modified', color: '#9c9790', bold: false },
    { text: '  🔄 Recompiling 3 dependents...', color: '#b87d20', bold: false },
    { text: '  ✓ rebuilt in 0.31s', color: '#6b8f5e', bold: false },
  ];
  return (
    <div style={{ background: '#1c1b18', borderRadius: '12px', boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(0,0,0,.15)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '12px 16px', background: '#141412', borderBottom: '1px solid #2a2926' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block', opacity: .9 }} />
        ))}
        <span style={{ marginLeft: 'auto', color: '#4a4844', fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '.05em' }}>cpm --watch</span>
      </div>
      <div style={{ padding: '18px 20px', fontFamily: 'var(--font-mono)', fontSize: '12.5px', lineHeight: 1.8 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.color, fontWeight: line.bold ? 600 : 400, minHeight: '1.6em' }}>{line.text}</div>
        ))}
      </div>
    </div>
  );
}

function WatchModeSection({ navigate }: { navigate: (path: string) => void }) {
  const watchFeatures = [
    { emoji: '⚡', title: 'Incremental rebuilds', desc: 'Only recompiles translation units whose dependencies changed.' },
    { emoji: '🧠', title: 'Dependency-aware', desc: 'Watches the include graph — edit a header and only affected .cpp files rebuild.' },
    { emoji: '🖥️', title: 'OS-native watchers', desc: 'inotify, FSEvents, ReadDirectoryChanges — zero polling, zero CPU when idle.' },
    { emoji: '🚀', title: 'Auto-restart', desc: 'With --exec, cpm restarts your binary after each successful build.' },
  ];

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#d9603a" />
            <pointLight position={[-5, 3, 3]} intensity={0.5} color="#3d6ea8" />
            <WavePlane />
            <PulsingOrb position={[-3, 1.5, 0]} color="#d9603a" speed={1.2} size={0.3} />
            <PulsingOrb position={[3.2, 1, -1]} color="#3d6ea8" speed={0.8} size={0.22} />
            <PulsingOrb position={[0.5, 2, 0.5]} color="#b87d20" speed={1.5} size={0.18} />
            <FileIcon position={[-3.5, -0.5, 0.5]} />
            <FileIcon position={[3.2, 0.3, 0]} />
            <FileIcon position={[1.8, -0.8, 0.8]} />
          </Canvas>
        </ErrorBoundary>
      </div>
      <div className="watch-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(40px,6vw,100px) clamp(16px,5vw,80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel emoji="👀">Watch Mode — like nodemon for C/C++</SectionLabel>

        <div className="two-col-grid" style={{ marginBottom: '64px' }}>
          <FadeIn>
            <div>
              <Tag emoji="🔥" color="hsl(var(--accent-coral))">New in v0.1</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.1, marginTop: '20px', marginBottom: '20px' }}>
                Edit. Save.<br />
                <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>It's already built. ⚡</em>
              </h2>
              <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '28px', maxWidth: '440px' }}>
                Add <InlineCode>--watch</InlineCode> to any <InlineCode>cpm run</InlineCode> command.
                cpm watches your source tree and incrementally recompiles on every change — with full dependency awareness. 🧠
              </p>
              <CodeBlock title="usage">{`# Watch and rebuild on changes
cpm run build --watch

# Watch and auto-restart binary
cpm run build --watch --exec ./bin/myapp`}</CodeBlock>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <WatchTerminalDemo />
          </FadeIn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
          {watchFeatures.map((f, i) => (
            <FadeIn key={i} delay={i * 70}>
              <div className="feat-card" style={{ padding: '28px 24px', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))', height: '100%' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'hsl(var(--ink-3))', lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-tags', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 })
      .fromTo('.hero-h1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, '-=.3')
      .fromTo('.hero-p', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, '-=.4')
      .fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5 }, '-=.3')
      .fromTo('.hero-terminal', { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .8 }, '-=.6');
  }, []);

  return (
    <div>
      <section ref={heroRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: 'clamp(80px,10vh,120px) clamp(16px,5vw,80px) clamp(40px,5vw,80px)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><ErrorBoundary><ThreeScene /></ErrorBoundary></div>
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        <span className="floating-emoji" style={{ top: '18%', right: '24%', fontSize: '28px', animationDelay: '0s', zIndex: 2 }}>📦</span>
        <span className="floating-emoji" style={{ top: '62%', right: '18%', fontSize: '20px', animationDelay: '1.2s', zIndex: 2 }}>⚡</span>
        <span className="floating-emoji" style={{ top: '30%', right: '10%', fontSize: '22px', animationDelay: '0.6s', zIndex: 2 }}>🔒</span>
        <span className="floating-emoji" style={{ top: '78%', right: '30%', fontSize: '18px', animationDelay: '2s', zIndex: 2 }}>🔧</span>
        <span className="floating-emoji" style={{ top: '45%', right: '40%', fontSize: '16px', animationDelay: '1.7s', zIndex: 2 }}>💡</span>

        <div style={{ position: 'relative', zIndex: 3, maxWidth: '580px' }}>
          <div className="hero-tags" style={{ marginBottom: '28px', display: 'flex', gap: '10px', flexWrap: 'wrap', opacity: 0 }}>
            <Tag emoji="⚙️">C · C++</Tag>
            <Tag emoji="💚">Open Source</Tag>
            <Tag color="hsl(var(--accent-warm))" emoji="🔥">Beta</Tag>
          </div>
          <h1 className="hero-h1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px,5.5vw,74px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-.03em', color: 'hsl(var(--ink))', marginBottom: '28px', opacity: 0 }}>
            The package<br />manager<br />
            <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>C deserves.</em>
            <span style={{ display: 'inline-block', marginLeft: '8px', animation: 'wiggle 2.5s ease-in-out infinite', fontSize: '0.7em' }}>🎯</span>
          </h1>
          <p className="hero-p" style={{ fontSize: '17px', color: 'hsl(var(--ink-3))', maxWidth: '440px', lineHeight: 1.75, marginBottom: '44px', fontWeight: 300, opacity: 0 }}>
            npm-style dependency management for C and C++ — with a resolver that <em>actually</em> understands ABI, linking, and name mangling. 🧠
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px', opacity: 0 }}>
            <button className="get-started-btn" onClick={() => navigate('/install')}>Get started →&nbsp;🚀</button>
            <button onClick={() => navigate('/docs')} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-3))', background: 'none', border: 'none', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '2px', cursor: 'pointer', transition: 'color .2s' }}>
              Read the docs 📖
            </button>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'hsl(var(--bg-sunken))', border: '1px solid hsl(var(--border-dim))', borderRadius: 'var(--radius)', padding: '10px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', textTransform: 'uppercase' }}>quick&nbsp;start</span>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'hsl(var(--ink-2))' }}>curl -fsSL https://cpm.dev/install.sh | sh</code>
          </div>
        </div>

        <div className="hero-terminal" style={{ position: 'absolute', bottom: '72px', right: '80px', width: '420px', zIndex: 3, opacity: 0 }}>
          <div style={{ position: 'absolute', inset: '-20px', backgroundImage: 'radial-gradient(circle, hsl(var(--border-dim)) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: .4, borderRadius: '12px', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}><Terminal /></div>
        </div>
      </section>

      <StatBar />

      <section style={{ padding: 'clamp(40px,6vw,100px) clamp(16px,5vw,80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 2s ease-in-out infinite' }}>🤔</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, letterSpacing: '-.025em', marginBottom: '16px' }}>Why cpm?</h2>
            <p style={{ fontSize: '16px', color: 'hsl(var(--ink-3))', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75, fontWeight: 300 }}>
              C has had package management chaos for decades. <InlineCode>make install</InlineCode>, copypasting source, fighting with autoconf… cpm finally fixes it. ✨
            </p>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,320px))', gap: '20px', marginBottom: '48px', justifyContent: 'center' }}>
          {[
            { emoji: '🧩', title: 'No more linker hell', desc: 'PubGrub ensures globally consistent resolution. No "symbol already defined". No duplicate libraries. Ever.' },
            { emoji: '🏗️', title: 'ABI-aware by design', desc: 'Knows about compiler versions, stdlib choices, and C++ name mangling. Your build cache is smarter than you think.' },
            { emoji: '🔐', title: 'Security without compromise', desc: 'No lifecycle scripts = no postinstall attacks. SHA-256 checksums on everything. Ed25519 signatures on the registry.' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="feat-card" style={{ padding: '32px', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))', height: '100%' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, marginBottom: '10px', letterSpacing: '-.01em' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'hsl(var(--ink-3))', lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/features')} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-3))', background: 'none', border: '1px solid hsl(var(--border))', borderRadius: '3px', padding: '11px 28px', cursor: 'pointer', transition: 'all .25s' }}>
              View all 7 features ✨ →
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Watch Mode Section */}
      <WatchModeSection navigate={navigate} />
    </div>
  );
}
