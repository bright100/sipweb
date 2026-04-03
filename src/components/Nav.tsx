import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from './shared';
import { useTheme } from './ThemeProvider';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems: [string, string][] = [
    ['/features', 'Features ✨'],
    ['/packages', 'Packages 📦'],
    ['/commands', 'Commands 🛠️'],
    ['/cpp', 'C++ 🔷'],
    ['/docs', 'Docs 📚'],
  ];

  const navBg = theme === 'dark'
    ? scrolled ? 'rgba(14,16,22,.92)' : 'transparent'
    : scrolled ? 'rgba(228,226,220,.92)' : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 clamp(16px,4vw,48px)', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(var(--border-dim))' : '1px solid transparent',
        transition: 'all .3s ease',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '20px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
          <Tag>v0.1</Tag>
          <span style={{ fontSize: '16px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(([path, label]) => (
            <Link key={path} to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}>
              {label}
            </Link>
          ))}
          <button
            className="theme-toggle"
            onClick={toggle}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/install" style={{
            fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
            padding: '8px 18px', borderRadius: '3px', letterSpacing: '.02em',
            border: 'none', textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', display: 'inline-block',
          }}>
            Install 🚀
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="mobile-nav">
          <button
            className="theme-toggle"
            onClick={toggle}
            data-testid="button-theme-toggle-mobile"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            data-testid="button-mobile-menu"
            style={{
              background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))',
              borderRadius: '6px', padding: '8px', cursor: 'pointer', color: 'hsl(var(--ink))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '58px', left: 0, right: 0, zIndex: 199,
          background: 'hsl(var(--surface))', borderBottom: '1px solid hsl(var(--border-dim))',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {navItems.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className={`nav-link${location.pathname === path ? ' active' : ''}`}
              style={{ padding: '12px 0', fontSize: '15px', borderBottom: '1px solid hsl(var(--border-dim))' }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/install"
            style={{
              marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '14px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              padding: '12px 20px', borderRadius: '4px', letterSpacing: '.02em',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Install 🚀
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
