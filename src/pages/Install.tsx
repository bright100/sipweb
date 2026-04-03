import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { FadeIn, SectionLabel, CodeBlock, Pill } from '@/components/shared';

export default function InstallPage() {
  const [copied, setCopied] = useState<number | null>(null);
  const platforms = [
    { name: 'Linux 🐧', cmd: 'curl -fsSL https://cpm.dev/install.sh | sh' },
    { name: 'macOS 🍎', cmd: 'brew install cpm-pkg' },
    { name: 'Windows 🪟', cmd: 'winget install cpm' },
    { name: 'Source 🔧', cmd: 'git clone https://github.com/cpm-pkg/cpm && cd cpm && make install' },
  ];
  const copy = (cmd: string, i: number) => { try { navigator.clipboard.writeText(cmd); } catch (e) { /* */ } setCopied(i); setTimeout(() => setCopied(null), 1800); };

  useEffect(() => {
    gsap.fromTo('.install-row-item',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: .45, stagger: .07, ease: 'power2.out', delay: .2 }
    );
  }, []);

  return (
    <section style={{ padding: 'clamp(40px,6vw,100px) clamp(16px,5vw,80px)', background: 'hsl(var(--bg-sunken))', borderTop: '1px solid hsl(var(--border-dim))', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel emoji="🚀">Install</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 600, letterSpacing: '-.025em', color: 'hsl(var(--ink))', marginBottom: '18px', lineHeight: 1.1 }}>
              Get cpm<br />
              <em style={{ fontWeight: 300 }}>in seconds. ⚡</em>
            </h1>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '28px' }}>
              cpm is a single static binary with no runtime dependencies. Choose your platform and run. 🎉
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {['gcc ≥ 9', 'clang ≥ 11', 'Linux / macOS / Windows'].map(p => <Pill key={p}>{p}</Pill>)}
            </div>
            <div style={{ padding: '24px', background: 'hsl(var(--surface))', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>By the numbers</h3>
              {[['Binary size', '~2 MB 😮'], ['Install time', '< 5 seconds ⚡'], ['Dependencies', 'zero 🎯'], ['Platforms', 'Linux, macOS, Windows 🌍']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid hsl(var(--border-dim))', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  <span style={{ color: 'hsl(var(--ink-4))' }}>{k}</span>
                  <span style={{ color: 'hsl(var(--ink-2))', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {platforms.map((p, i) => (
              <div key={i} className="install-row install-row-item" style={{ opacity: 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-4))', width: '104px', flexShrink: 0 }}>{p.name}</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-2))', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.cmd}</code>
                <button className="copy-btn" onClick={() => copy(p.cmd, i)}
                  style={{ background: copied === i ? 'hsl(var(--accent-code))' : 'hsl(var(--bg-sunken))', color: copied === i ? 'hsl(var(--background))' : 'hsl(var(--ink-3))' }}>
                  {copied === i ? '✓ copied!' : 'copy'}
                </button>
              </div>
            ))}
            <FadeIn delay={300}>
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', marginBottom: '12px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  🔍 Verify installation
                </p>
                <CodeBlock title="verify">{'cpm --version\n# cpm 0.1.0 (2024-01-15) x86_64-linux\n\ncpm --help\n# Usage: cpm <command> [options]\n# Commands: init, add, install, run, update, publish'}</CodeBlock>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
