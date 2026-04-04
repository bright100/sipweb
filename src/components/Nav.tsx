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

const NAV_ITEMS: [string, string][] = [
  ['/features',  'Features'],
  ['/packages',  'Packages'],
  ['/commands',  'Commands'],
  ['/cpp',       'C++'],
  ['/docs',      'Docs'],
];

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  const navBg = theme === 'dark'
    ? scrolled ? 'rgba(14,16,22,.97)' : 'hsl(var(--surface))'
    : scrolled ? 'rgba(228,226,220,.97)' : 'hsl(var(--surface))';

  /* ──────── DESKTOP TOP NAV ──────── */
  if (!isMobile) {
    return (
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '60px', display: 'flex', alignItems: 'center',
        padding: '0 clamp(20px,4vw,48px)',
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid hsl(var(--border-dim))',
        transition: 'background .3s',
        gap: '0',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '19px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
          <Tag>v0.1</Tag>
          <span style={{ fontSize: '14px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
        </Link>

        {/* Nav links — centered */}
        <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          {NAV_ITEMS.map(([path, label]) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '15px',
                  fontWeight: active ? 500 : 400,
                  color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--ink-3))',
                  background: active ? 'hsl(var(--bg-raised))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color .15s, background .15s',
                  letterSpacing: '.01em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'hsl(var(--ink))'; e.currentTarget.style.background = 'hsl(var(--bg-raised))'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'hsl(var(--ink-3))'; e.currentTarget.style.background = 'transparent'; } }}
                data-testid={`nav-link-${label.toLowerCase()}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={toggle}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
            style={{
              background: 'transparent', border: 'none',
              color: 'hsl(var(--ink-3))', fontSize: '16px',
              cursor: 'pointer', padding: '6px 8px', borderRadius: '6px',
              transition: 'background .15s',
              lineHeight: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'hsl(var(--bg-raised))'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link
            to="/install"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px',
              borderRadius: '6px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '.02em',
              textDecoration: 'none',
              transition: 'opacity .15s',
              whiteSpace: 'nowrap',
            }}
            data-testid="nav-link-install"
            onMouseEnter={e => { e.currentTarget.style.opacity = '.82'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Install 🚀
          </Link>
        </div>
      </header>
    );
  }

  /* ──────── MOBILE TOP BAR + DRAWER ──────── */
  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,28px)',
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid hsl(var(--border-dim))',
        transition: 'background .3s',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '19px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
          <Tag>v0.1</Tag>
          <span style={{ fontSize: '14px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={toggle} aria-label="Toggle theme" data-testid="button-theme-toggle-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px', borderRadius: '6px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => setDrawerOpen(o => !o)}
            data-testid="button-mobile-menu"
            style={{
              background: 'hsl(var(--bg-raised))', border: '1px solid hsl(var(--border-dim))',
              borderRadius: '6px', padding: '7px', cursor: 'pointer', color: 'hsl(var(--ink))',
              display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {drawerOpen
                ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0, zIndex: 199,
          background: 'hsl(var(--surface))',
          display: 'flex', flexDirection: 'column',
          padding: '16px 12px 24px',
          overflowY: 'auto',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {NAV_ITEMS.map(([path, label]) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '13px 14px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '17px', fontWeight: active ? 500 : 400,
                    color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--ink-2))',
                    background: active ? 'hsl(var(--bg-raised))' : 'transparent',
                    textDecoration: 'none',
                    letterSpacing: '.01em',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div style={{ marginTop: '20px', padding: '0 2px' }}>
            <Link
              to="/install"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 20px', borderRadius: '8px',
                background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
                fontFamily: 'var(--font-mono)', fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Install 🚀
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
