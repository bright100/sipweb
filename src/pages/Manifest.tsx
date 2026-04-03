import { FadeIn, SectionLabel, InlineCode, CodeBlock } from '@/components/shared';

export default function ManifestPage() {
  const toml = `[package]
name    = "myapp"
version = "1.0.0"
lang    = "c++"        # "c" or "c++"
std     = "c++17"      # c89/c99/c11/c17 or c++11/14/17/20/23

[dependencies]
libcurl       = "^8.0"
nlohmann-json = "~3.11"   # header-only C++ package
libuv         = "2.0.0"

[dev-dependencies]
googletest = "^1.14"      # test-only, never linked in release

[system-dependencies]
openssl = ">=1.1"         # resolved via pkg-config
pthread = "*"

[build]
cc      = "g++"
cflags  = ["-O2", "-Wall", "-Wextra"]
ldflags = ["-lpthread"]
stdlib  = "libstdc++"     # or "libc++"

[scripts]
build = "cpm compile src/main.cpp -o bin/myapp"
test  = "cpm compile tests/*.cpp -o bin/tests && ./bin/tests"`;

  const lockSnippet = `[[package]]
name     = "libcurl"
version  = "8.4.0"
source   = "registry+https://registry.cpm.dev"
checksum = "sha256:a4b3c2d1e5f6..."
deps     = ["zlib", "openssl"]

[[package]]
name     = "nlohmann-json"
version  = "3.11.3"
source   = "registry+https://registry.cpm.dev"
checksum = "sha256:deadbeef1234..."
deps     = []`;

  return (
    <div style={{ padding: '100px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      <SectionLabel emoji="📄">Manifest & Lock</SectionLabel>
      <FadeIn>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 600, letterSpacing: '-.03em', marginBottom: '18px', lineHeight: 1.05 }}>
          Declare it once.<br />
          <em style={{ fontWeight: 300, color: 'hsl(var(--ink-2))' }}>Build everywhere. 🌍</em>
        </h1>
        <p style={{ fontSize: '16px', color: 'hsl(var(--ink-3))', maxWidth: '520px', lineHeight: 1.75, marginBottom: '64px', fontWeight: 300 }}>
          Two files to rule them all: <InlineCode>cpm.toml</InlineCode> for your intentions, <InlineCode>cpm.lock</InlineCode> for reproducibility. Commit both. Always. 🤝
        </p>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '44px', alignItems: 'start' }}>
        <FadeIn>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '28px' }}>📝</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 600, letterSpacing: '-.02em', color: 'hsl(var(--ink))' }}>cpm.toml</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
              The project manifest. Declare your language standard, dependencies, build flags, and scripts. Works for both C and C++ in the same format.
            </p>
            <CodeBlock title="cpm.toml">{toml}</CodeBlock>
          </div>
        </FadeIn>
        <FadeIn delay={120}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '28px' }}>🔒</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 600, letterSpacing: '-.02em', color: 'hsl(var(--ink))' }}>cpm.lock</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
              Auto-generated and committed to version control. Pins every transitive dependency to an exact version and checksum for reproducible builds.
            </p>
            <CodeBlock title="cpm.lock">{lockSnippet}</CodeBlock>
            <div style={{ marginTop: '20px', padding: '20px 24px', background: 'hsl(var(--surface))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border-dim))', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'hsl(var(--ink-3))', lineHeight: 1.7 }}>
                <strong style={{ color: 'hsl(var(--ink))' }}>Never edit by hand.</strong>{' '}
                Run <InlineCode>cpm install</InlineCode> to use the lock file, or <InlineCode>cpm update</InlineCode> to regenerate it.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
