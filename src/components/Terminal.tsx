import { useState, useEffect, useRef } from 'react';

const SEQUENCES = [
  { cmd: 'cpm init --cpp', out: '✓ Created myapp/cpm.toml\n✓ Scaffolded src/, include/, tests/' },
  { cmd: 'cpm add nlohmann-json', out: '  Resolving nlohmann-json ^3.11...\n✓ nlohmann-json 3.11.3 (header-only)\n  Lock file updated.' },
  { cmd: 'cpm install', out: '  Reading cpm.lock...\n  libcurl 8.4.0      ████████ cached\n  nlohmann-json 3.11 ████████ cached\n✓ 2 packages ready in 0.03s' },
  { cmd: 'cpm run build', out: '  g++ -std=c++17 -O2 src/main.cpp\n  → -I.cpm/deps/libcurl/include\n  → -L.cpm/deps/libcurl/lib -lcurl\n✓ bin/myapp  (1.2 MB)' },
];

export default function Terminal() {
  const [seqIdx, setSeqIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'output' | 'pause'>('typing');
  const [typed, setTyped] = useState('');
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const seq = SEQUENCES[seqIdx];
    if (phase === 'typing') {
      if (typed.length < seq.cmd.length) {
        timerRef.current = setTimeout(() => setTyped(seq.cmd.slice(0, typed.length + 1)), 50 + Math.random() * 28);
      } else { timerRef.current = setTimeout(() => setPhase('output'), 320); }
    }
    if (phase === 'output') {
      const lines = seq.out.split('\n');
      if (outputLines.length < lines.length) {
        timerRef.current = setTimeout(() => setOutputLines(lines.slice(0, outputLines.length + 1)), 110);
      } else { timerRef.current = setTimeout(() => setPhase('pause'), 1400); }
    }
    if (phase === 'pause') {
      timerRef.current = setTimeout(() => { setTyped(''); setOutputLines([]); setPhase('typing'); setSeqIdx((seqIdx + 1) % SEQUENCES.length); }, 800);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, typed, outputLines, seqIdx]);

  return (
    <div style={{ background: '#1c1b18', borderRadius: '12px', boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(0,0,0,.15)', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.65' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '12px 16px', background: '#141412', borderBottom: '1px solid #2a2926' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block', opacity: .9 }} />
        ))}
        <span style={{ marginLeft: 'auto', color: '#4a4844', fontSize: '11px', letterSpacing: '.05em' }}>cpm — bash</span>
      </div>
      <div style={{ padding: '20px 20px 24px', minHeight: '172px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ color: '#6b8f5e', fontWeight: 500 }}>~/myapp</span>
          <span style={{ color: '#5c9ccc' }}>$</span>
          <span style={{ color: '#e8e5df' }}>{typed}</span>
          <span style={{ display: 'inline-block', width: '8px', height: '15px', background: '#e8e5df', animation: phase !== 'pause' ? 'blink 1s step-end infinite' : 'none', opacity: phase === 'pause' ? 0 : 1 }} />
        </div>
        {outputLines.map((line, i) => (
          <div key={i} style={{ color: line.startsWith('✓') ? '#6b8f5e' : line.startsWith('  →') ? '#5c7a9c' : '#9c9790', paddingLeft: '4px', animation: 'fadeSlide .15s ease', fontSize: '12.5px' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
