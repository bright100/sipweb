import { useState, useRef } from 'react';
import gsap from 'gsap';
import { FadeIn, SectionLabel, CodeBlock } from '@/components/shared';

const COMMANDS = [
  { cmd: 'cpm init', flag: '--cpp', emoji: '🏁', desc: 'Scaffold a new project. Pass --cpp to initialize a C++ project with lang = "c++" and std = "c++17".', code: `mkdir myapp && cd myapp\ncpm init --cpp\n# → cpm.toml created\n# → src/main.cpp, include/, tests/` },
  { cmd: 'cpm add', flag: '<package>', emoji: '➕', desc: 'Query the registry, resolve dependencies, update cpm.toml and cpm.lock, and download/build the package.', code: `cpm add libcurl          # latest compatible\ncpm add libcurl@8.0.0   # exact version\ncpm add --dev googletest # dev dependency` },
  { cmd: 'cpm install', flag: '', emoji: '📥', desc: 'Read cpm.lock, fetch all packages not in cache, compile them, and set up include/link paths.', code: `cpm install\n# .cpm/deps/libcurl-8.4.0/\n#   include/curl/curl.h\n#   lib/libcurl.a` },
  { cmd: 'cpm run', flag: '<script>', emoji: '▶️', desc: 'Execute a script from cpm.toml with the environment pre-configured — compiler flags injected automatically.', code: `cpm run build\n# g++ -std=c++17 -O2\n#   -I.cpm/deps/.../include\n#   -L.cpm/deps/.../lib\n#   src/main.cpp -o bin/myapp` },
  { cmd: 'cpm update', flag: '[package]', emoji: '🔄', desc: 'Re-run resolution ignoring the lock file, picking the newest satisfying versions. Omit package name to update all.', code: `cpm update              # update everything\ncpm update libcurl      # update one package` },
  { cmd: 'cpm publish', flag: '', emoji: '📤', desc: 'Validate, package, and upload to the registry. Checks extern "C" guards on C packages and verifies clean builds.', code: `cpm publish\n# Validating cpm.toml...\n# Checking extern "C" guards...\n# ✓ Published libfoo 1.2.0` },
  { cmd: 'cpm run', flag: '--watch', emoji: '👀', desc: 'Watch mode — monitors source files for changes and automatically recompiles. Like nodemon for C/C++, using OS-native file watchers (inotify/FSEvents/ReadDirectoryChanges).', code: `cpm run build --watch\n# 👀 Watching src/, include/...\n# ✓ bin/myapp rebuilt in 0.4s\n# [edit src/main.cpp]\n# 🔄 Change detected → recompiling...\n# ✓ bin/myapp rebuilt in 0.12s` },
];

export default function CommandsPage() {
  const [active, setActive] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const cmd = COMMANDS[active];

  const selectCmd = (i: number) => {
    if (detailRef.current) {
      gsap.fromTo(detailRef.current, { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: .3, ease: 'power2.out' });
    }
    setActive(i);
  };

  return (
    <div style={{ padding: '100px 80px', background: 'hsl(var(--bg-sunken))', borderTop: '1px solid hsl(var(--border-dim))', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionLabel emoji="🛠️">CLI Reference</SectionLabel>
        <FadeIn>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 600, letterSpacing: '-.03em', marginBottom: '64px', lineHeight: 1.05 }}>
            Seven commands.<br />
            <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>That's literally all. 🎯</em>
          </h1>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '52px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {COMMANDS.map((c, i) => (
              <button key={i} className={`cmd-btn${active === i ? ' active' : ''}`} onClick={() => selectCmd(i)}>
                <span style={{ fontSize: '16px' }}>{c.emoji}</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: active === i ? 600 : 400, color: active === i ? 'hsl(var(--ink))' : 'hsl(var(--ink-3))', flex: 1 }}>{c.cmd}</code>
                {c.flag && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>{c.flag}</span>}
              </button>
            ))}
            <div style={{ marginTop: '20px', padding: '16px', background: 'hsl(var(--surface))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border-dim))', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', lineHeight: 1.7 }}>
              💡 All commands support <code style={{ color: 'hsl(var(--ink-3))' }}>--help</code> for detailed usage.
            </div>
          </div>
          <div ref={detailRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '30px' }}>{cmd.emoji}</span>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, color: 'hsl(var(--ink))', letterSpacing: '-.01em' }}>
                  {cmd.cmd}{cmd.flag && <span style={{ color: 'hsl(var(--ink-3))' }}> {cmd.flag}</span>}
                </h2>
              </div>
              <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, maxWidth: '540px' }}>{cmd.desc}</p>
            </div>
            <CodeBlock title={`${cmd.cmd}${cmd.flag ? ' ' + cmd.flag : ''}`}>{cmd.code}</CodeBlock>
          </div>
        </div>
      </div>
    </div>
  );
}
