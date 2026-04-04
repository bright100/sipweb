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

  /* ──────── DESKTOP FLOATING PILL NAV ──────── */
  if (!isMobile) {
    const pillBg = theme === 'dark'
      ? scrolled ? 'rgba(20,19,16,.88)' : 'rgba(20,19,16,.72)'
      : scrolled ? 'rgba(236,233,226,.92)' : 'rgba(236,233,226,.78)';

    return (
      <div style={{
        position: 'fixed', top: '14px', left: 0, right: 0, zIndex: 200,
        display: 'flex', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <header style={{
          pointerEvents: 'all',
          display: 'flex', alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          background: pillBg,
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.09)'}`,
          borderRadius: '999px',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.12)'
            : '0 4px 16px rgba(0,0,0,.1)',
          transition: 'background .3s, box-shadow .3s',
          maxWidth: '800px',
          width: 'calc(100vw - 48px)',
        }}>

          {/* Brand */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            textDecoration: 'none', padding: '4px 10px',
            borderRadius: '999px', flexShrink: 0,
            transition: 'background .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '17px', color: 'hsl(var(--ink))', letterSpacing: '-.03em' }}>cpm</span>
            <Tag>v0.1</Tag>
            <span style={{ fontSize: '13px', animation: 'wiggle 3s ease-in-out infinite' }}>📦</span>
          </Link>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: theme === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)', flexShrink: 0 }} />

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {NAV_ITEMS.map(([path, label]) => {
              const active = location.pathname === path || location.pathname.startsWith(path + '/');
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    padding: '5px 13px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '14px',
                    fontWeight: active ? 500 : 400,
                    color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--ink-2))',
                    background: active
                      ? (theme === 'dark' ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.06)')
                      : 'transparent',
                    textDecoration: 'none',
                    transition: 'color .15s, background .15s',
                    whiteSpace: 'nowrap',
                    letterSpacing: '.01em',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = 'hsl(var(--ink))';
                      e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = 'hsl(var(--ink-2))';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  data-testid={`nav-link-${label.toLowerCase()}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: theme === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)', flexShrink: 0 }} />

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <button
              onClick={toggle}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
              style={{
                background: 'transparent', border: 'none',
                color: 'hsl(var(--ink-3))', fontSize: '15px',
                cursor: 'pointer', padding: '5px 9px', borderRadius: '999px',
                transition: 'background .15s', lineHeight: 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link
              to="/install"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'hsl(var(--ink))', color: 'hsl(var(--background))',
                fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.02em',
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
          <button onClick={toggle} aria-label="Toggle theme" data-testid="button-theme-toggle-mobile"
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
