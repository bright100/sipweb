import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Tag, FadeIn, SectionLabel } from '@/components/shared';

const FEATURES = [
  { num: '01', emoji: '🧩', title: 'Conflict-free resolution', body: "Uses the PubGrub algorithm to find a globally-consistent version set. Unlike npm, C cannot install duplicate packages — two copies of a library means two definitions of the same symbols, which breaks the linker.", tag: 'Resolver', tagColor: 'hsl(var(--accent-sage))' },
  { num: '02', emoji: '🏗️', title: 'ABI-aware caching', body: "The build cache is keyed by OS, architecture, compiler version, and language standard. Switch from gcc to clang or c++17 to c++20 and affected packages recompile automatically.", tag: 'Cache', tagColor: 'hsl(var(--accent-blue))' },
  { num: '03', emoji: '📎', title: 'Header-only support', body: 'Many modern C++ libraries like nlohmann/json and {fmt} are header-only. cpm detects lib_type = "header-only" and skips compilation entirely, placing headers directly into .cpm/deps/.', tag: 'C++', tagColor: 'hsl(var(--accent-warm))' },
  { num: '04', emoji: '🔐', title: 'No lifecycle scripts', body: "npm's postinstall attack surface doesn't exist here. The only code that runs during install is your compiler and ar. Custom build steps require explicit allowlisting with interactive confirmation.", tag: 'Security', tagColor: 'hsl(var(--accent-coral))' },
  { num: '05', emoji: '🔗', title: 'System library interop', body: 'Declares system dependencies separately and resolves them via pkg-config. When a system dep is missing, cpm prints the exact apt/brew/pacman command to fix it.', tag: 'Integration', tagColor: 'hsl(var(--accent-amber))' },
  { num: '06', emoji: '💡', title: 'compile_commands.json', body: 'After every install, cpm writes .cpm/compile_commands.json. Your editor (VS Code, Neovim via clangd, CLion) gets autocomplete and jump-to-definition for all dependencies automatically.', tag: 'DX', tagColor: 'hsl(var(--accent-sage))' },
  { num: '07', emoji: '👀', title: 'Live reload (watch mode)', body: 'cpm run --watch monitors your source files and automatically recompiles on changes — like nodemon for C/C++. Detects file additions, edits, and deletions with minimal latency using OS-native file watchers.', tag: 'Dev', tagColor: 'hsl(var(--accent-coral))' },
];

export default function FeaturesPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current.querySelectorAll('.feat-item'),
      { opacity: 0, y: 32, scale: .96 },
      { opacity: 1, y: 0, scale: 1, duration: .55, stagger: .07, ease: 'power2.out', delay: .15 }
    );
  }, []);

  return (
    <div style={{ padding: '100px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      <SectionLabel emoji="✨">Core features</SectionLabel>
      <FadeIn>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: '64px' }}>
          Everything you need<br />
          <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>to wrangle C packages. 📦</em>
        </h1>
      </FadeIn>
      <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'hsl(var(--border-dim))', border: '1px solid hsl(var(--border-dim))', borderRadius: '12px', overflow: 'hidden' }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="feat-card feat-item" style={{ padding: '36px 32px', height: '100%', opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px' }}>{f.emoji}</span>
              <Tag color={f.tagColor}>{f.tag}</Tag>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', marginBottom: '8px' }}>{f.num}</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'hsl(var(--ink))', marginBottom: '12px', letterSpacing: '-.01em', lineHeight: 1.3 }}>{f.title}</h3>
            <p style={{ fontSize: '14.5px', color: 'hsl(var(--ink-3))', lineHeight: 1.7, fontWeight: 300 }}>{f.body}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <FadeIn>
          <div style={{ padding: '40px', background: 'hsl(var(--surface))', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))', height: '100%' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>😤 → 😌</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Built by a C developer</h2>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300 }}>
              cpm was designed by someone who has been burned by Makefile dependency chaos, accidental symbol collisions, and the horror of mixing C and C++ libraries. Every decision reflects real pain. 🩹
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ padding: '40px', background: 'hsl(var(--surface))', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))', height: '100%' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌍</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Open registry protocol</h2>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300 }}>
              The registry protocol is open and self-hostable. Run a private registry for your organization. The spec is documented, not locked behind a corporate API. 🔓
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
