import { useState, useEffect, useRef, ReactNode } from 'react';

export function Tag({ children, color, emoji }: { children: ReactNode; color?: string; emoji?: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.07em', textTransform: 'uppercase',
      color: color || 'hsl(var(--ink-3))', border: `1px solid ${color || 'hsl(var(--ink-3))'}`, borderRadius: '3px', padding: '2px 8px',
      display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: .9, whiteSpace: 'nowrap'
    }}>
      {emoji && <span>{emoji}</span>}
      {children}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span style={{
      display: 'inline-block', background: 'hsl(var(--bg-sunken))', color: 'hsl(var(--ink-2))',
      fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '3px 10px',
      borderRadius: '999px', border: '1px solid hsl(var(--border))'
    }}>
      {children}
    </span>
  );
}

export function SectionLabel({ children, emoji }: { children: ReactNode; emoji?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
      {emoji && <span style={{ fontSize: '18px' }}>{emoji}</span>}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'hsl(var(--ink-4))', whiteSpace: 'nowrap' }}>{children}</span>
      <span style={{ flex: 1, height: '1px', background: 'hsl(var(--border-dim))' }} />
    </div>
  );
}

export function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function FadeIn({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return <code style={{ fontFamily: 'var(--font-mono)', background: 'hsl(var(--bg-sunken))', padding: '1px 6px', borderRadius: '3px', fontSize: '13px' }}>{children}</code>;
}

export function CodeBlock({ children, title = '' }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { try { navigator.clipboard.writeText(children); } catch (e) { /* */ } setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div style={{ background: '#1c1b18', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #2e2c28' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #2e2c28', background: '#171614' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5750', letterSpacing: '.06em', textTransform: 'uppercase' }}>{title || 'code'}</span>
        <button onClick={copy} style={{ background: 'transparent', border: '1px solid #3a3835', borderRadius: '3px', color: copied ? '#6b8f5e' : '#5a5750', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', cursor: 'pointer', transition: 'all .2s', letterSpacing: '.05em' }}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre style={{ padding: '16px 18px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.7', color: '#c8c4bc', margin: 0 }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
