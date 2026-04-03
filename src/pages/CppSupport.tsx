import { Tag, FadeIn, SectionLabel, InlineCode, CodeBlock } from '@/components/shared';

export default function CppPage() {
  const externC = `/* mylibrary.h — a C library used from C++ */
#ifdef __cplusplus
extern "C" {
#endif

int  mylibrary_init(void);
void mylibrary_free(void);

#ifdef __cplusplus
}
#endif`;

  const cards = [
    { emoji: '🔤', title: 'Name mangling', body: 'C++ encodes type info into symbol names. C libraries need extern "C" guards to link from C++. cpm publish validates this automatically.', badge: 'Enforced' },
    { emoji: '📎', title: 'Header-only libs', body: 'nlohmann/json, {fmt}, Catch2 — entire libraries in .hpp files. cpm detects lib_type = "header-only" and skips the compile step.', badge: 'Supported' },
    { emoji: '📚', title: 'libstdc++ vs libc++', body: 'Two packages compiled against different standard libraries have incompatible std::string. cpm tracks stdlib in the cache key and errors at resolution.', badge: 'Tracked' },
    { emoji: '🔗', title: 'C mixing', body: 'C++ projects can freely depend on C packages with proper extern "C" guards. C projects cannot consume C++ packages — enforced at resolution time.', badge: 'Enforced' },
  ];

  const rows = [
    { what: 'C/C++ standard library', how: 'Ships with compiler', ex: 'stdio.h, <vector>', highlight: false },
    { what: 'POSIX library', how: 'Ships with OS', ex: '<unistd.h>', highlight: false },
    { what: 'System library', how: 'apt / brew / pacman', ex: 'libssl-dev', highlight: false },
    { what: 'Third-party library', how: 'cpm add', ex: 'libcurl, fmt', highlight: true },
  ];

  return (
    <div>
      <section style={{ padding: 'clamp(40px,6vw,100px) clamp(16px,5vw,80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel emoji="🔷">C++ Support</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          <div>
            <FadeIn>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: '18px' }}>
                C++ is a<br />
                <em style={{ fontWeight: 300 }}>first-class citizen. 🥇</em>
              </h1>
              <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '36px' }}>
                C++ introduces ABI fragility, name mangling, header-only packages, and two competing standard libraries. cpm handles all of it — transparently. ✨
              </p>
            </FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cards.map((c, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div className="cpp-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{c.emoji}</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: 'hsl(var(--ink))' }}>{c.title}</span>
                      <Tag color="hsl(var(--accent-code))">{c.badge}</Tag>
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'hsl(var(--ink-3))', lineHeight: 1.65, fontWeight: 300 }}>{c.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          <FadeIn delay={100}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', marginBottom: '10px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  🔍 extern "C" guard — validated on publish
                </p>
                <CodeBlock title="mylibrary.h">{externC}</CodeBlock>
              </div>
              <div style={{ background: '#1c1b18', borderRadius: 'var(--radius)', border: '1px solid #2e2c28', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7 }}>
                <div style={{ padding: '8px 14px', borderBottom: '1px solid #2e2c28', background: '#141412', fontSize: '11px', color: '#5a5750', letterSpacing: '.06em', textTransform: 'uppercase' }}>terminal — dependency conflict</div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ color: '#e05c5c', marginBottom: '8px' }}>❌ error: dependency conflict</div>
                  <div style={{ color: '#9c9790' }}>  C project 'myapp' cannot depend on</div>
                  <div style={{ color: '#9c9790' }}>  C++ package 'folly'</div>
                  <div style={{ color: '#9c9790', marginTop: '10px' }}>💡 hint: change lang to "c++"</div>
                  <div style={{ color: '#9c9790' }}>  or choose a C-compatible library</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section style={{ padding: 'clamp(40px,6vw,100px) clamp(16px,5vw,80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel emoji="🚫">What cpm does NOT manage</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeIn>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.15, color: 'hsl(var(--ink))', marginBottom: '18px' }}>
              You can't{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.88em' }}>cpm install stdio</code>
              <span style={{ marginLeft: '8px' }}>🙅</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '32px' }}>
              <InlineCode>stdio.h</InlineCode> is part of the C standard library, which ships with your compiler and is already on your system. It is not a package. This is the most common confusion coming from JavaScript. 😅
            </p>
            <div style={{ border: '1px solid hsl(var(--border-dim))', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'hsl(var(--bg-sunken))', padding: '10px 16px', borderBottom: '1px solid hsl(var(--border-dim))' }}>
                {['What', 'How you get it', 'Example'].map(h => (
                  <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              {rows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 16px', borderBottom: i < rows.length - 1 ? '1px solid hsl(var(--border-dim))' : 'none', background: r.highlight ? 'rgba(61,90,62,.07)' : 'hsl(var(--surface))' }}>
                  <span style={{ fontSize: '13px', color: 'hsl(var(--ink-2))', fontWeight: r.highlight ? 500 : 300 }}>{r.what}</span>
                  <span style={{ fontSize: '13px', color: 'hsl(var(--ink-3))', fontFamily: r.highlight ? 'var(--font-mono)' : undefined }}>{r.how}</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-3))' }}>{r.ex}</code>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: '#1c1b18', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2e2c28' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #2e2c28', background: '#141412', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5750', letterSpacing: '.05em' }}>bash — common mistake 🤦</div>
              <div style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7 }}>
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: '#5c9ccc' }}>$ </span>
                  <span style={{ color: '#e8e5df' }}>cpm install stdio</span>
                </div>
                <div style={{ color: '#e05c5c', marginBottom: '4px' }}>❌ error: 'stdio' is not a package</div>
                <div style={{ color: '#9c9790', marginBottom: '16px' }}>'stdio.h' is part of the C standard library</div>
                <div style={{ color: '#6b8f5e' }}>✅ Standard headers (no install needed):</div>
                {['<stdio.h>   — printf, fopen, FILE*', '<stdlib.h>  — malloc, free, exit', '<string.h>  — memcpy, strlen', '<stdint.h>  — uint8_t, int32_t', '<iostream>  — std::cout (C++)'].map((line, i) => (
                  <div key={i} style={{ color: '#6a6660', paddingLeft: '2px' }}>  {line}</div>
                ))}
                <div style={{ marginTop: '14px' }}>
                  <span style={{ color: '#6b8f5e' }}>💡 hint: </span>
                  <span style={{ color: '#9c9790' }}>try cpm add libuv or cpm add fmt</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
