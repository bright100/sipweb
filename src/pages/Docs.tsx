import { useNavigate } from 'react-router-dom';
import { FadeIn, SectionLabel } from '@/components/shared';

export default function DocsPage() {
  const navigate = useNavigate();

  const sections = [
    { num: '01', emoji: '📋', title: 'Manifest File', desc: 'cpm.toml reference — all fields, C vs C++ modes, build config.', color: 'hsl(var(--accent-sage))', slug: 'manifest' },
    { num: '02', emoji: '🔒', title: 'Lock File', desc: 'How cpm.lock works and why it must be committed.', color: 'hsl(var(--accent-blue))', slug: 'lockfile' },
    { num: '03', emoji: '🌐', title: 'Registry Protocol', desc: 'Open spec for self-hosting a private registry.', color: 'hsl(var(--accent-amber))', slug: 'registry' },
    { num: '04', emoji: '🧩', title: 'Dependency Resolution', desc: 'PubGrub algorithm, conflict messages, version constraints.', color: 'hsl(var(--accent-coral))', slug: 'resolution' },
    { num: '05', emoji: '⚙️', title: 'Build System Integration', desc: 'compile_commands.json, flags.env, static vs dynamic linking.', color: 'hsl(var(--accent-warm))', slug: 'build' },
    { num: '06', emoji: '🔐', title: 'Security Model', desc: 'Checksums, Ed25519 signatures, lifecycle script policy.', color: 'hsl(var(--accent-sage))', slug: 'security' },
    { num: '07', emoji: '🔷', title: 'C++ ABI Guide', desc: 'Name mangling, stdlib choice, ABI tags, header-only packages.', color: 'hsl(var(--accent-blue))', slug: 'cppabi' },
    { num: '08', emoji: '📦', title: 'Package Structure', desc: 'Layout rules, public header convention, cpm publish checklist.', color: 'hsl(var(--accent-amber))', slug: 'packaging' },
    { num: '09', emoji: '👀', title: 'Watch Mode', desc: 'Live reload for C/C++ — nodemon-style file watching with incremental rebuilds.', color: 'hsl(var(--accent-coral))', slug: 'watchmode' },
  ];

  return (
    <div style={{ padding: '100px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      <SectionLabel emoji="📚">Documentation</SectionLabel>
      <FadeIn>
        <div style={{ marginBottom: '56px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: '16px' }}>
            Everything documented.<br />
            <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>Nothing left to guess. 📖</em>
          </h1>
          <p style={{ fontSize: '16px', color: 'hsl(var(--ink-3))', maxWidth: '480px', lineHeight: 1.75, fontWeight: 300 }}>
            Nine comprehensive guides covering every aspect of cpm. From basics to advanced ABI management.
          </p>
        </div>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'hsl(var(--border-dim))', border: '1px solid hsl(var(--border-dim))', borderRadius: '12px', overflow: 'hidden' }}>
        {sections.map((s, i) => (
          <FadeIn key={i} delay={i * 40}>
            <div className="doc-card" style={{ padding: '28px 22px' }} onClick={() => navigate(`/docs/${s.slug}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>{s.num}</span>
                <span style={{ fontSize: '22px' }}>{s.emoji}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'hsl(var(--ink))', marginBottom: '8px', lineHeight: 1.3 }}>{s.title}</div>
              <div style={{ fontSize: '13px', color: 'hsl(var(--ink-3))', lineHeight: 1.6, fontWeight: 300, marginBottom: '18px' }}>{s.desc}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: s.color, letterSpacing: '.04em' }}>Read → ↗</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={200}>
        <div style={{ marginTop: '72px', padding: '56px', background: 'hsl(var(--surface))', borderRadius: '12px', border: '1px solid hsl(var(--border-dim))', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 2s ease-in-out infinite' }}>👋</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, letterSpacing: '-.02em', marginBottom: '14px' }}>
            Join the community
          </h2>
          <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75, fontWeight: 300, marginBottom: '32px' }}>
            cpm is open source and built by developers who are tired of C dependency nightmares. Contributions welcome! 🤝
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['GitHub 🐙', '#'], ['Discussions 💬', '#'], ['Registry 📦', '#'], ['Changelog 📝', '#']].map(([label, href]) => (
              <a key={label} href={href} style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '10px 20px', border: '1px solid hsl(var(--border))', borderRadius: '3px', color: 'hsl(var(--ink-3))', transition: 'all .2s', display: 'inline-block' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
