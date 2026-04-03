import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from './shared';
import { useTheme } from './ThemeProvider';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

const NAV_ITEMS: [string, string, string][] = [
  ['/features',  'Features',  '✨'],
  ['/packages',  'Packages',  '📦'],
  ['/commands',  'Commands',  '🛠️'],
  ['/cpp',       'C++',       '🔷'],
  ['/docs',      'Docs',      '📚'],
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

  /* ──────── DESKTOP SIDEBAR ──────── */
  if (!isMobile) {
    return (
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', zIndex: 200,
        display: 'flex', flexDirection: 'column',
        background: 'hsl(var(--surface))',
        borderRight: '1px solid hsl(var(--border-dim))',
        padding: '0',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', padding: '24px 20px 20px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '20px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
          <Tag>v0.1</Tag>
          <span style={{ fontSize: '15px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
        </Link>

        <div style={{ height: '1px', background: 'hsl(var(--border-dim))', margin: '0 20px 16px' }} />

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
          {NAV_ITEMS.map(([path, label, emoji]) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: active ? 500 : 400,
                  color: active ? 'hsl(var(--ink))' : 'hsl(var(--ink-3))',
                  background: active ? 'hsl(var(--bg-raised))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all .15s',
                  borderLeft: active ? '2px solid hsl(var(--ink))' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'hsl(var(--ink))'; e.currentTarget.style.background = 'hsl(var(--bg-raised))'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'hsl(var(--ink-3))'; e.currentTarget.style.background = 'transparent'; } }}
                data-testid={`nav-link-${label.toLowerCase()}`}
              >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{emoji}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ height: '1px', background: 'hsl(var(--border-dim))', margin: '16px 20px 16px' }} />

        {/* Bottom controls */}
        <div style={{ padding: '0 10px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={toggle}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px',
              borderRadius: '6px',
              background: 'transparent', border: 'none',
              color: 'hsl(var(--ink-3))', fontSize: '14px',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'hsl(var(--ink))'; e.currentTarget.style.background = 'hsl(var(--bg-raised))'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'hsl(var(--ink-3))'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '15px' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <Link
            to="/install"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '10px 12px',
              borderRadius: '6px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '.02em',
              textDecoration: 'none',
              transition: 'opacity .15s',
            }}
            data-testid="nav-link-install"
            onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Install 🚀
          </Link>
        </div>
      </aside>
    );
  }

  /* ──────── MOBILE TOP BAR + DRAWER ──────── */
  const mobileNavBg = theme === 'dark'
    ? scrolled ? 'rgba(14,16,22,.95)' : 'hsl(var(--surface))'
    : scrolled ? 'rgba(228,226,220,.95)' : 'hsl(var(--surface))';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,28px)',
        background: mobileNavBg,
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
          <button onClick={toggle} aria-label="Toggle theme" data-testid="button-theme-toggle-mobile" className="theme-toggle">
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

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0, zIndex: 199,
          background: 'hsl(var(--surface))',
          display: 'flex', flexDirection: 'column',
          padding: '16px 12px 24px',
          overflowY: 'auto',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {NAV_ITEMS.map(([path, label, emoji]) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '13px 14px',
                    borderRadius: '8px',
                    fontSize: '15px', fontWeight: active ? 500 : 400,
                    color: active ? 'hsl(var(--ink))' : 'hsl(var(--ink-2))',
                    background: active ? 'hsl(var(--bg-raised))' : 'transparent',
                    borderLeft: active ? '2px solid hsl(var(--ink))' : '2px solid transparent',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{emoji}</span>
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
