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
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  /* ──────── DESKTOP VERTICAL PILL NAV ──────── */
  if (!isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        pointerEvents: 'none',
      }}>
        <nav style={{
          pointerEvents: 'all',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '2px',
          padding: '20px 10px',
        }}>
          {/* Brand */}
          <Link
            to="/"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', textDecoration: 'none',
              padding: '8px 12px 12px',
              borderRadius: '999px',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '16px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
            <span style={{ fontSize: '16px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
          </Link>

          {/* Divider */}
          <div style={{ width: '32px', height: '1px', background: theme === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)', margin: '4px auto' }} />

          {/* Nav links — vertical */}
          {NAV_ITEMS.map(([path, label]) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                title={label}
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  padding: '14px 9px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--ink-3))',
                  textDecoration: 'none',
                  transition: 'color .15s',
                  letterSpacing: '.04em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'hsl(var(--ink))'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'hsl(var(--ink-3))'; }}
                data-testid={`nav-link-${label.toLowerCase()}`}
              >
                {label}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={e => toggle(e.clientX, e.clientY)}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
            style={{
              background: 'transparent', border: 'none',
              color: 'hsl(var(--ink-3))', fontSize: '16px',
              cursor: 'pointer', padding: '10px', borderRadius: '999px',
              transition: 'opacity .15s', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '.6'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Install */}
          <Link
            to="/install"
            title="Install"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              padding: '14px 8px',
              borderRadius: '999px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.06em',
              textDecoration: 'none',
              transition: 'opacity .15s',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
            data-testid="nav-link-install"
            onMouseEnter={e => { e.currentTarget.style.opacity = '.82'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Install 🚀
          </Link>
        </nav>
      </div>
    );
  }

  /* ──────── MOBILE TOP BAR + DRAWER ──────── */
  const mobileBg = theme === 'dark'
    ? scrolled ? 'rgba(14,16,22,.95)' : 'hsl(var(--surface))'
    : scrolled ? 'rgba(228,226,220,.95)' : 'hsl(var(--surface))';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,28px)',
        background: mobileBg,
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
          <button onClick={e => toggle(e.clientX, e.clientY)} aria-label="Toggle theme" data-testid="button-theme-toggle-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px', borderRadius: '6px' }}>
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
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '13px 14px', borderRadius: '8px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px', fontWeight: active ? 500 : 400,
                  color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--ink-2))',
                  background: active ? 'hsl(var(--bg-raised))' : 'transparent',
                  textDecoration: 'none',
                }}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div style={{ marginTop: '20px', padding: '0 2px' }}>
            <Link to="/install" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px 20px', borderRadius: '8px',
              background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
              fontFamily: 'var(--font-mono)', fontSize: '14px', textDecoration: 'none',
            }}>
              Install 🚀
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
