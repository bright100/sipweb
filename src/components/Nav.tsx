import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from './shared';
import { useTheme } from './ThemeProvider';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const isMobile = useIsMobile();

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
    ? scrolled ? 'rgba(14,16,22,.94)' : 'transparent'
    : scrolled ? 'rgba(228,226,220,.94)' : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 clamp(16px,4vw,48px)', height: '58px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(var(--border-dim))' : '1px solid transparent',
        transition: 'all .3s ease',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '20px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
          <Tag>v0.1</Tag>
          <span style={{ fontSize: '16px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
        </Link>

        {isMobile ? (
          /* ── Mobile: theme toggle + hamburger ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" data-testid="button-theme-toggle-mobile">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              data-testid="button-mobile-menu"
              style={{
                background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))',
                borderRadius: '6px', padding: '7px', cursor: 'pointer', color: 'hsl(var(--ink))',
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
        ) : (
          /* ── Desktop: full nav ── */
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {navItems.map(([path, label]) => (
              <Link key={path} to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" data-testid="button-theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/install" style={{
              fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              padding: '8px 18px', borderRadius: '3px', letterSpacing: '.02em',
              textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', display: 'inline-block',
            }}>
              Install 🚀
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: '58px', left: 0, right: 0, zIndex: 199,
          background: 'hsl(var(--surface))', borderBottom: '1px solid hsl(var(--border-dim))',
          padding: '12px 20px 20px',
          display: 'flex', flexDirection: 'column',
        }}>
          {navItems.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className={`nav-link${location.pathname === path ? ' active' : ''}`}
              style={{ padding: '13px 0', fontSize: '15px', borderBottom: '1px solid hsl(var(--border-dim))' }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/install"
            style={{
              marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '14px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              padding: '13px 20px', borderRadius: '4px', letterSpacing: '.02em',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Install 🚀
          </Link>
        </div>
      )}
    </>
  );
}
