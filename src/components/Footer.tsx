import { Link } from 'react-router-dom';
import { Tag } from './shared';

export default function Footer() {
  const links: [string, string][] = [
    ['/features', 'Features ✨'],
    ['/commands', 'Commands 🛠️'],
    ['/manifest', 'Manifest 📄'],
    ['/cpp', 'C++ 🔷'],
    ['/install', 'Install 🚀'],
    ['/docs', 'Docs 📚'],
  ];

  return (
    <footer style={{ borderTop: '1px solid hsl(var(--border-dim))', padding: '48px 80px', background: 'hsl(var(--bg-sunken))' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '20px', color: 'hsl(var(--ink))' }}>cpm</span>
            <span style={{ fontSize: '18px' }}>📦</span>
            <Tag>v0.1</Tag>
          </Link>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {links.map(([path, label]) => (
              <Link key={path} to={path} className="nav-link" style={{ fontSize: '12px' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid hsl(var(--border-dim))', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ color: 'hsl(var(--ink-4))', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            A design document. 🛠️ Closest real tools: Conan, vcpkg, clib.
          </span>
          <span style={{ color: 'hsl(var(--ink-4))', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            Made with ❤️ and too much C++ pain
          </span>
        </div>
      </div>
    </footer>
  );
}
