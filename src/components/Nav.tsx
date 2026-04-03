import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from './shared';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navItems: [string, string][] = [
    ['/features', 'Features ✨'],
    ['/commands', 'Commands 🛠️'],
    ['/cpp', 'C++ 🔷'],
    ['/docs', 'Docs 📚'],
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      padding: '0 48px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(228,226,220,.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid hsl(var(--border-dim))' : '1px solid transparent',
      transition: 'all .3s ease'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '20px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
        <Tag>v0.1</Tag>
        <span style={{ fontSize: '16px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
      </Link>
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {navItems.map(([path, label]) => (
          <Link key={path} to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}>
            {label}
          </Link>
        ))}
        <Link to="/install" style={{
          fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
          padding: '8px 18px', borderRadius: '3px', letterSpacing: '.02em',
          border: 'none', textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', display: 'inline-block'
        }}>
          Install 🚀
        </Link>
      </div>
    </nav>
  );
}
