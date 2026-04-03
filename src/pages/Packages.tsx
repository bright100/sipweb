import { useState, useMemo } from 'react';
import { FadeIn, SectionLabel } from '@/components/shared';

const PACKAGES = [
  { name: 'cJSON', description: 'Ultralightweight JSON parser in ANSI C', lang: 'c', libType: 'source', latestVersion: '1.7.17', updatedAt: '2025-01-01T00:00:00Z', stars: 11200 },
  { name: 'zlib', description: 'A massively spiffy yet delicately unobtrusive compression library', lang: 'c', libType: 'source', latestVersion: '1.3.1', updatedAt: '2024-11-03T00:00:00Z', stars: 4800 },
  { name: 'libcurl', description: 'The multiprotocol file transfer library', lang: 'c', libType: 'source', latestVersion: '8.7.1', updatedAt: '2025-02-14T00:00:00Z', stars: 34000 },
  { name: 'openssl', description: 'TLS/SSL and crypto library', lang: 'c', libType: 'source', latestVersion: '3.3.0', updatedAt: '2025-03-10T00:00:00Z', stars: 25100 },
  { name: 'sqlite3', description: 'Self-contained, serverless, zero-configuration SQL database engine', lang: 'c', libType: 'source', latestVersion: '3.45.3', updatedAt: '2025-01-28T00:00:00Z', stars: 7600 },
  { name: 'libuv', description: 'Cross-platform asynchronous I/O library', lang: 'c', libType: 'source', latestVersion: '1.48.0', updatedAt: '2024-12-20T00:00:00Z', stars: 24300 },
  { name: 'mbedtls', description: 'An open source, portable, easy to use, readable and flexible TLS library', lang: 'c', libType: 'source', latestVersion: '3.6.0', updatedAt: '2024-10-15T00:00:00Z', stars: 5200 },
  { name: 'libpng', description: 'Official PNG reference library', lang: 'c', libType: 'source', latestVersion: '1.6.43', updatedAt: '2024-09-10T00:00:00Z', stars: 1900 },
  { name: 'libjpeg-turbo', description: 'JPEG image codec that uses SIMD instructions', lang: 'c', libType: 'source', latestVersion: '3.0.3', updatedAt: '2024-08-22T00:00:00Z', stars: 3700 },
  { name: 'mongoose', description: 'Embedded web server and networking library', lang: 'c', libType: 'source', latestVersion: '7.14', updatedAt: '2025-02-01T00:00:00Z', stars: 10400 },
  { name: 'nlohmann/json', description: 'JSON for modern C++ — header-only with zero dependencies', lang: 'cpp', libType: 'header-only', latestVersion: '3.11.3', updatedAt: '2024-12-02T00:00:00Z', stars: 42300 },
  { name: 'fmt', description: 'A modern formatting library for C++ — fast, safe, and expressive', lang: 'cpp', libType: 'header-only', latestVersion: '10.2.1', updatedAt: '2024-11-18T00:00:00Z', stars: 21500 },
  { name: 'spdlog', description: 'Fast C++ logging library', lang: 'cpp', libType: 'header-only', latestVersion: '1.14.1', updatedAt: '2025-01-08T00:00:00Z', stars: 24700 },
  { name: 'Catch2', description: 'A modern, C++-native test framework', lang: 'cpp', libType: 'header-only', latestVersion: '3.6.0', updatedAt: '2025-02-22T00:00:00Z', stars: 18200 },
  { name: 'Eigen', description: 'C++ template library for linear algebra', lang: 'cpp', libType: 'header-only', latestVersion: '3.4.0', updatedAt: '2024-07-14T00:00:00Z', stars: 11400 },
  { name: 'abseil-cpp', description: "Abseil — C++ Common Libraries from Google", lang: 'cpp', libType: 'source', latestVersion: '20240722.0', updatedAt: '2024-07-22T00:00:00Z', stars: 15600 },
  { name: 'Boost.Asio', description: 'Cross-platform C++ library for network and low-level I/O programming', lang: 'cpp', libType: 'header-only', latestVersion: '1.85.0', updatedAt: '2024-10-04T00:00:00Z', stars: 8900 },
  { name: 'glm', description: 'OpenGL Mathematics library for C++ based on GLSL specs', lang: 'cpp', libType: 'header-only', latestVersion: '1.0.1', updatedAt: '2024-06-12T00:00:00Z', stars: 9800 },
  { name: 'cereal', description: 'A C++11 library for serialization', lang: 'cpp', libType: 'header-only', latestVersion: '1.3.2', updatedAt: '2024-02-20T00:00:00Z', stars: 4300 },
  { name: 're2', description: 'Fast, safe, thread-friendly regular expression library', lang: 'cpp', libType: 'source', latestVersion: '2024-07-02', updatedAt: '2024-07-02T00:00:00Z', stars: 9100 },
  { name: 'protobuf', description: "Google's data interchange format", lang: 'cpp', libType: 'source', latestVersion: '27.0', updatedAt: '2025-01-30T00:00:00Z', stars: 64800 },
  { name: 'SFML', description: 'Simple and Fast Multimedia Library — graphics, audio, networking', lang: 'cpp', libType: 'source', latestVersion: '2.6.1', updatedAt: '2024-04-05T00:00:00Z', stars: 11000 },
  { name: 'xxHash', description: 'Extremely fast non-cryptographic hash algorithm', lang: 'c', libType: 'header-only', latestVersion: '0.8.2', updatedAt: '2024-03-18T00:00:00Z', stars: 8900 },
  { name: 'miniz', description: 'Single C source file zlib-compatible compression library', lang: 'c', libType: 'source', latestVersion: '3.0.2', updatedAt: '2024-01-10T00:00:00Z', stars: 2100 },
];

type Lang = 'all' | 'c' | 'cpp';
type LibType = 'all' | 'source' | 'header-only';
type Sort = 'stars' | 'updated' | 'name';

const LANG_COLORS: Record<string, string> = {
  c: 'hsl(var(--accent-blue))',
  cpp: 'hsl(var(--accent-coral))',
};

const LANG_LABELS: Record<string, string> = {
  c: 'C',
  cpp: 'C++',
};

const LIB_COLORS: Record<string, string> = {
  source: 'hsl(var(--accent-sage))',
  'header-only': 'hsl(var(--accent-amber))',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function Badge({ children, color }: { children: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '4px', letterSpacing: '.03em',
      background: `${color}18`, color, border: `1px solid ${color}28`,
    }}>
      {children}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: typeof PACKAGES[0] }) {
  return (
    <div className="pkg-card" data-testid={`card-package-${pkg.name}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 500,
          color: 'hsl(var(--ink))', letterSpacing: '-.01em', wordBreak: 'break-word',
        }}>
          {pkg.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'hsl(var(--ink-3))', background: 'hsl(var(--bg-sunken))',
          padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          v{pkg.latestVersion}
        </span>
      </div>

      <p style={{
        fontSize: '13px', color: 'hsl(var(--ink-3))', lineHeight: 1.55,
        fontFamily: 'var(--font-mono)', fontWeight: 300, flexGrow: 1,
      }}>
        {pkg.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
        <Badge color={LANG_COLORS[pkg.lang]}>{LANG_LABELS[pkg.lang]}</Badge>
        <Badge color={LIB_COLORS[pkg.libType]}>{pkg.libType}</Badge>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>
          <StarIcon />
          {(pkg.stars / 1000).toFixed(1)}k
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>
          · {timeAgo(pkg.updatedAt)}
        </span>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<Lang>('all');
  const [libType, setLibType] = useState<LibType>('all');
  const [sort, setSort] = useState<Sort>('stars');

  const filtered = useMemo(() => {
    let list = PACKAGES.filter(p => {
      if (lang !== 'all' && p.lang !== lang) return false;
      if (libType !== 'all' && p.libType !== libType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'stars') return b.stars - a.stars;
      if (sort === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [search, lang, libType, sort]);

  return (
    <div className="page-wrap" style={{ minHeight: '80vh' }}>
      {/* Hero */}
      <div style={{ background: 'hsl(var(--bg-sunken))', borderBottom: '1px solid hsl(var(--border-dim))', padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,80px) clamp(32px,4vw,56px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeIn>
            <SectionLabel emoji="📦">Registry</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, margin: '16px 0 12px' }}>
              Package Registry
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'hsl(var(--ink-3))', marginBottom: '28px', fontWeight: 300 }}>
              {PACKAGES.length} packages · curated for C &amp; C++ developers
            </p>
          </FadeIn>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '560px' }}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--ink-4))', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="pkg-search"
              type="text"
              placeholder="Search packages…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              data-testid="input-search-packages"
            />
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,5vw,80px)' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', marginRight: '4px', letterSpacing: '.04em' }}>LANG</span>
          {(['all', 'c', 'cpp'] as Lang[]).map(l => (
            <button
              key={l}
              className={`filter-chip${lang === l ? ' active' : ''}`}
              onClick={() => setLang(l)}
              data-testid={`filter-lang-${l}`}
            >
              {l === 'all' ? 'All' : l === 'cpp' ? 'C++' : 'C'}
            </button>
          ))}

          <div style={{ width: '1px', height: '18px', background: 'hsl(var(--border))', margin: '0 4px' }} />

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', marginRight: '4px', letterSpacing: '.04em' }}>TYPE</span>
          {(['all', 'source', 'header-only'] as LibType[]).map(t => (
            <button
              key={t}
              className={`filter-chip${libType === t ? ' active' : ''}`}
              onClick={() => setLibType(t)}
              data-testid={`filter-type-${t}`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.04em' }}>SORT</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as Sort)}
              data-testid="select-sort"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px',
                background: 'hsl(var(--surface))', color: 'hsl(var(--ink))',
                border: '1px solid hsl(var(--border))', borderRadius: '6px',
                padding: '6px 10px', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="stars">Stars</option>
              <option value="updated">Recently updated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-4))', marginBottom: '20px' }}>
          {filtered.length} {filtered.length === 1 ? 'package' : 'packages'} found
        </p>

        {/* Package grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '14px',
          }}>
            {filtered.map(pkg => (
              <PackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'hsl(var(--ink-3))' }}>
              No packages match your search.
            </p>
            <button
              onClick={() => { setSearch(''); setLang('all'); setLibType('all'); }}
              style={{
                marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px',
                color: 'hsl(var(--accent-coral))', background: 'none', border: 'none', cursor: 'pointer',
              }}
              data-testid="button-clear-filters"
            >
              Clear filters →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
