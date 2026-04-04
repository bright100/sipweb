export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid hsl(var(--border-dim))', padding: 'clamp(20px,3vw,32px) clamp(16px,5vw,80px)', background: 'hsl(var(--bg-sunken))' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ color: 'hsl(var(--ink-4))', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          A design document. 🛠️ Closest real tools: Conan, vcpkg, clib.
        </span>
        <span style={{ color: 'hsl(var(--ink-4))', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          Made with ❤️ and too much C++ pain
        </span>
      </div>
    </footer>
  );
}
