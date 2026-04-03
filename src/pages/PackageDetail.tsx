import { useParams, Link } from 'react-router-dom';

const PACKAGES = [
  { name: 'cJSON', description: 'Ultralightweight JSON parser in ANSI C', lang: 'c', libType: 'source', latestVersion: '1.7.17', updatedAt: '2025-01-01T00:00:00Z', stars: 11200, downloads: 284000, likes: 342, author: 'DaveGamble', license: 'MIT', homepage: 'https://github.com/DaveGamble/cJSON', versions: ['1.7.17', '1.7.16', '1.7.15', '1.7.14'], deps: [], readme: 'cJSON is an ultra-lightweight JSON parser in ANSI C. It aims to be the dumbest possible parser that you can get your job done with. In terms of lines of code it is under 600 lines. It is a single file that you can drop into your project and start using immediately.\n\nSupports parsing, printing, and manipulating JSON without dynamic memory bloat. Battle-tested in embedded systems, IoT devices, and constrained environments.' },
  { name: 'zlib', description: 'A massively spiffy yet delicately unobtrusive compression library', lang: 'c', libType: 'source', latestVersion: '1.3.1', updatedAt: '2024-11-03T00:00:00Z', stars: 4800, downloads: 920000, likes: 589, author: 'madler', license: 'Zlib', homepage: 'https://zlib.net', versions: ['1.3.1', '1.3', '1.2.13', '1.2.12'], deps: [], readme: 'zlib is designed to be a free, general-purpose, legally unencumbered — that is, not covered by any patents — lossless data-compression library for use on virtually any computer hardware and operating system. The zlib data format is itself portable across platforms.\n\nUnlike the LZW compression method used in Unix compress(1) and in the GIF image format, the compression method currently used in zlib essentially never expands the data. (LZW can double or triple the file size in worst cases.)' },
  { name: 'libcurl', description: 'The multiprotocol file transfer library', lang: 'c', libType: 'source', latestVersion: '8.7.1', updatedAt: '2025-02-14T00:00:00Z', stars: 34000, downloads: 1400000, likes: 2100, author: 'bagder', license: 'curl', homepage: 'https://curl.se/libcurl', versions: ['8.7.1', '8.6.0', '8.5.0', '8.4.0'], deps: ['openssl', 'zlib'], readme: 'libcurl is a free and easy-to-use client-side URL transfer library, supporting DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP, WS and WSS. libcurl supports SSL certificates, HTTP POST, HTTP PUT, FTP uploading, HTTP form based upload, proxies, HTTP/2, HTTP/3, cookies, user+password authentication (Basic, Digest, NTLM, Negotiate, Kerberos), file transfer resume, http proxy tunneling and more.' },
  { name: 'openssl', description: 'TLS/SSL and crypto library', lang: 'c', libType: 'source', latestVersion: '3.3.0', updatedAt: '2025-03-10T00:00:00Z', stars: 25100, downloads: 2100000, likes: 1840, author: 'openssl', license: 'Apache-2.0', homepage: 'https://openssl.org', versions: ['3.3.0', '3.2.1', '3.1.5', '1.1.1w'], deps: [], readme: 'OpenSSL is a robust, commercial-grade, full-featured Open Source Toolkit for the Transport Layer Security (TLS) protocol formerly known as the Secure Sockets Layer (SSL) protocol. The protocol implementation is based on a full-strength general purpose cryptographic library, which can also be used stand-alone.\n\nOpenSSL is descended from the SSLeay library developed by Eric A. Young and Tim J. Hudson. The OpenSSL toolkit is licensed under a dual-license (the OpenSSL license plus the SSLeay license), which means that you are free to get and use it for commercial and non-commercial purposes as long as you fulfill both licenses.' },
  { name: 'sqlite3', description: 'Self-contained, serverless, zero-configuration SQL database engine', lang: 'c', libType: 'source', latestVersion: '3.45.3', updatedAt: '2025-01-28T00:00:00Z', stars: 7600, downloads: 680000, likes: 912, author: 'sqlite', license: 'Public Domain', homepage: 'https://sqlite.org', versions: ['3.45.3', '3.45.2', '3.44.2', '3.43.0'], deps: [], readme: 'SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inside countless other applications that people use every day.\n\nThe SQLite file format is stable, cross-platform, and backwards compatible and the developers pledge to keep it that way through the year 2050. SQLite database files are commonly used as containers to transfer rich content between systems and as a long-term archival format for data.' },
  { name: 'libuv', description: 'Cross-platform asynchronous I/O library', lang: 'c', libType: 'source', latestVersion: '1.48.0', updatedAt: '2024-12-20T00:00:00Z', stars: 24300, downloads: 540000, likes: 740, author: 'libuv', license: 'MIT', homepage: 'https://libuv.org', versions: ['1.48.0', '1.47.0', '1.46.0', '1.45.0'], deps: [], readme: 'libuv is a multi-platform support library with a focus on asynchronous I/O. It was primarily developed for use by Node.js, but it\'s also used by Luvit, Julia, uvloop, and others.\n\nFeatures include: a full-featured event loop backed by epoll, kqueue, IOCP, event ports; asynchronous TCP and UDP sockets; asynchronous DNS resolution; asynchronous file and file system operations; file system events; ANSI escape code controlled TTY; IPC with socket sharing, using Unix domain sockets or named pipes (Windows); child processes; thread pool; signal handling; high resolution clock; threading and synchronization primitives.' },
  { name: 'nlohmann/json', description: 'JSON for modern C++ — header-only with zero dependencies', lang: 'cpp', libType: 'header-only', latestVersion: '3.11.3', updatedAt: '2024-12-02T00:00:00Z', stars: 42300, downloads: 1100000, likes: 3400, author: 'nlohmann', license: 'MIT', homepage: 'https://json.nlohmann.me', versions: ['3.11.3', '3.11.2', '3.11.1', '3.10.5'], deps: [], readme: 'JSON for Modern C++ is a header-only library that provides JSON support with an intuitive API. It is well-tested with 100% branch coverage and is one of the most downloaded C++ libraries ever.\n\nIntuitively use JSON like a first class data type. Parse and serialize effortlessly. Integrate into any C++11 project by just dropping in a single header file.' },
  { name: 'fmt', description: 'A modern formatting library for C++ — fast, safe, and expressive', lang: 'cpp', libType: 'header-only', latestVersion: '10.2.1', updatedAt: '2024-11-18T00:00:00Z', stars: 21500, downloads: 890000, likes: 2100, author: 'fmtlib', license: 'MIT', homepage: 'https://fmt.dev', versions: ['10.2.1', '10.1.1', '10.0.0', '9.1.0'], deps: [], readme: '{fmt} is an open-source formatting library providing a fast and safe alternative to C stdio and C++ iostreams. It was standardized as C++20 std::format and C++23 std::print.\n\nKey features: safe alternative to printf with comparable or better performance; extensible; wide Unicode support; no header-only mode performance loss.' },
  { name: 'spdlog', description: 'Fast C++ logging library', lang: 'cpp', libType: 'header-only', latestVersion: '1.14.1', updatedAt: '2025-01-08T00:00:00Z', stars: 24700, downloads: 760000, likes: 1800, author: 'gabime', license: 'MIT', homepage: 'https://github.com/gabime/spdlog', versions: ['1.14.1', '1.13.0', '1.12.0', '1.11.0'], deps: ['fmt'], readme: 'Very fast, header-only/compiled, C++ logging library. Supports multiple sinks including rotating files, daily files, console output with colors, syslog, Windows debug output, and more.\n\nOffers both synchronous and asynchronous logging modes.' },
  { name: 'Catch2', description: 'A modern, C++-native test framework', lang: 'cpp', libType: 'header-only', latestVersion: '3.6.0', updatedAt: '2025-02-22T00:00:00Z', stars: 18200, downloads: 430000, likes: 1200, author: 'catchorg', license: 'BSL-1.0', homepage: 'https://github.com/catchorg/Catch2', versions: ['3.6.0', '3.5.4', '3.4.0', '2.13.10'], deps: [], readme: 'Catch2 is mainly a unit testing framework for C++, but it also provides basic micro-benchmarking features, and simple BDD macros.\n\nCatch2\'s main advantages are that it is easy to use, has natural expression decomposition, and provides comprehensive test output.' },
  { name: 'Eigen', description: 'C++ template library for linear algebra', lang: 'cpp', libType: 'header-only', latestVersion: '3.4.0', updatedAt: '2024-07-14T00:00:00Z', stars: 11400, downloads: 320000, likes: 890, author: 'eigen', license: 'MPL2', homepage: 'https://eigen.tuxfamily.org', versions: ['3.4.0', '3.3.9', '3.3.8', '3.3.7'], deps: [], readme: 'Eigen is a C++ template library for linear algebra: matrices, vectors, numerical solvers, and related algorithms.' },
  { name: 'abseil-cpp', description: "Abseil — C++ Common Libraries from Google", lang: 'cpp', libType: 'source', latestVersion: '20240722.0', updatedAt: '2024-07-22T00:00:00Z', stars: 15600, downloads: 290000, likes: 680, author: 'abseil', license: 'Apache-2.0', homepage: 'https://abseil.io', versions: ['20240722.0', '20240116.2', '20230802.1'], deps: [], readme: 'Abseil is an open-source collection of C++ library code designed to augment the C++ standard library. The Abseil library code is collected from Google\'s own C++ code base, has been extensively tested and used in production, and is the same code we depend on in our daily coding lives.' },
  { name: 'Boost.Asio', description: 'Cross-platform C++ library for network and low-level I/O programming', lang: 'cpp', libType: 'header-only', latestVersion: '1.85.0', updatedAt: '2024-10-04T00:00:00Z', stars: 8900, downloads: 410000, likes: 960, author: 'boostorg', license: 'BSL-1.0', homepage: 'https://think-async.com/Asio', versions: ['1.85.0', '1.84.0', '1.83.0'], deps: [], readme: 'Boost.Asio is a cross-platform C++ library for network and low-level I/O programming that provides developers with a consistent asynchronous model using a modern C++ approach.' },
  { name: 'glm', description: 'OpenGL Mathematics library for C++ based on GLSL specs', lang: 'cpp', libType: 'header-only', latestVersion: '1.0.1', updatedAt: '2024-06-12T00:00:00Z', stars: 9800, downloads: 380000, likes: 740, author: 'g-truc', license: 'MIT', homepage: 'https://glm.g-truc.net', versions: ['1.0.1', '0.9.9.8', '0.9.9.7'], deps: [], readme: 'OpenGL Mathematics (GLM) is a header-only C++ mathematics library for graphics software based on the OpenGL Shading Language (GLSL) specifications.' },
  { name: 'protobuf', description: "Google's data interchange format", lang: 'cpp', libType: 'source', latestVersion: '27.0', updatedAt: '2025-01-30T00:00:00Z', stars: 64800, downloads: 1800000, likes: 4200, author: 'protocolbuffers', license: 'BSD-3-Clause', homepage: 'https://protobuf.dev', versions: ['27.0', '26.1', '25.3', '24.4'], deps: ['abseil-cpp'], readme: 'Protocol Buffers are Google\'s language-neutral, platform-neutral, extensible mechanism for serializing structured data – think XML, but smaller, faster, and simpler.' },
  { name: 'mbedtls', description: 'An open source, portable, easy to use, readable and flexible TLS library', lang: 'c', libType: 'source', latestVersion: '3.6.0', updatedAt: '2024-10-15T00:00:00Z', stars: 5200, downloads: 210000, likes: 380, author: 'Mbed-TLS', license: 'Apache-2.0', homepage: 'https://tls.mbed.org', versions: ['3.6.0', '3.5.2', '3.4.1', '2.28.8'], deps: [], readme: 'Mbed TLS is a C library that implements cryptographic primitives, X.509 certificate manipulation and the SSL/TLS and DTLS protocols. Its small code footprint makes it suitable for embedded systems.' },
  { name: 'mongoose', description: 'Embedded web server and networking library', lang: 'c', libType: 'source', latestVersion: '7.14', updatedAt: '2025-02-01T00:00:00Z', stars: 10400, downloads: 190000, likes: 520, author: 'cesanta', license: 'GPL-2.0', homepage: 'https://mongoose.ws', versions: ['7.14', '7.13', '7.12', '7.11'], deps: [], readme: 'Mongoose is a networking library for C/C++. It implements event-driven non-blocking APIs for TCP, UDP, HTTP, WebSocket, MQTT. It is designed for connecting devices and presenting services to the Web.' },
  { name: 'xxHash', description: 'Extremely fast non-cryptographic hash algorithm', lang: 'c', libType: 'header-only', latestVersion: '0.8.2', updatedAt: '2024-03-18T00:00:00Z', stars: 8900, downloads: 310000, likes: 620, author: 'Cyan4973', license: 'BSD-2-Clause', homepage: 'https://xxhash.com', versions: ['0.8.2', '0.8.1', '0.8.0'], deps: [], readme: 'xxHash is an extremely fast non-cryptographic hash algorithm, working at RAM speed limits. It successfully completes the SMHasher test suite which evaluates collision, dispersion and randomness qualities of hash functions.' },
  { name: 're2', description: 'Fast, safe, thread-friendly regular expression library', lang: 'cpp', libType: 'source', latestVersion: '2024-07-02', updatedAt: '2024-07-02T00:00:00Z', stars: 9100, downloads: 260000, likes: 490, author: 'google', license: 'BSD-3-Clause', homepage: 'https://github.com/google/re2', versions: ['2024-07-02', '2024-06-01', '2024-05-01'], deps: ['abseil-cpp'], readme: 'RE2 is a fast, safe, thread-friendly alternative to backtracking regular expression engines like those used in PCRE, Perl, and Python. It is a C++ library.' },
  { name: 'SFML', description: 'Simple and Fast Multimedia Library — graphics, audio, networking', lang: 'cpp', libType: 'source', latestVersion: '2.6.1', updatedAt: '2024-04-05T00:00:00Z', stars: 11000, downloads: 240000, likes: 870, author: 'SFML', license: 'Zlib', homepage: 'https://sfml-dev.org', versions: ['2.6.1', '2.6.0', '2.5.1', '2.5.0'], deps: [], readme: 'SFML provides a simple interface to the various components of your PC, to ease the development of games and multimedia applications. It is composed of five modules: system, window, graphics, audio and network.' },
  { name: 'cereal', description: 'A C++11 library for serialization', lang: 'cpp', libType: 'header-only', latestVersion: '1.3.2', updatedAt: '2024-02-20T00:00:00Z', stars: 4300, downloads: 140000, likes: 310, author: 'USCiLab', license: 'BSD-3-Clause', homepage: 'https://uscilab.github.io/cereal', versions: ['1.3.2', '1.3.1', '1.3.0'], deps: [], readme: 'cereal is a header-only C++11 serialization library. cereal takes arbitrary data types and reversibly turns them into different representations, such as compact binary encodings, XML, or JSON.' },
  { name: 'libpng', description: 'Official PNG reference library', lang: 'c', libType: 'source', latestVersion: '1.6.43', updatedAt: '2024-09-10T00:00:00Z', stars: 1900, downloads: 490000, likes: 280, author: 'glennrp', license: 'Libpng', homepage: 'http://www.libpng.org', versions: ['1.6.43', '1.6.42', '1.6.41', '1.6.40'], deps: ['zlib'], readme: 'libpng is the official PNG reference library. It supports almost all PNG features, is extensible, and has been extensively tested for over 28 years.' },
  { name: 'libjpeg-turbo', description: 'JPEG image codec that uses SIMD instructions', lang: 'c', libType: 'source', latestVersion: '3.0.3', updatedAt: '2024-08-22T00:00:00Z', stars: 3700, downloads: 560000, likes: 420, author: 'libjpeg-turbo', license: 'IJG/BSD', homepage: 'https://libjpeg-turbo.org', versions: ['3.0.3', '3.0.2', '3.0.1', '2.1.91'], deps: [], readme: 'libjpeg-turbo is a JPEG image codec that uses SIMD instructions to accelerate baseline JPEG compression and decompression on x86, x86-64, Arm, PowerPC, and MIPS systems.' },
  { name: 'miniz', description: 'Single C source file zlib-compatible compression library', lang: 'c', libType: 'source', latestVersion: '3.0.2', updatedAt: '2024-01-10T00:00:00Z', stars: 2100, downloads: 120000, likes: 210, author: 'richgel999', license: 'MIT', homepage: 'https://github.com/richgel999/miniz', versions: ['3.0.2', '3.0.1', '3.0.0', '2.2.0'], deps: [], readme: 'miniz is a lossless, high performance data compression library in a single source file that implements the zlib (RFC 1950) and Deflate (RFC 1951) compressed data format specification standards. It supports the DEFLATE_COMPRESS and INFLATE_DECOMPRESS functions.' },
];

const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

function generateDownloadHistory(base: number) {
  return MONTHS.map((month, i) => {
    const variance = 0.7 + Math.sin(i * 0.9 + base * 0.01) * 0.3 + (i / MONTHS.length) * 0.4;
    return { month, count: Math.round((base / 12) * variance) };
  });
}

const LANG_COLORS: Record<string, string> = {
  c: 'hsl(var(--accent-blue))',
  cpp: 'hsl(var(--accent-coral))',
};
const LANG_LABELS: Record<string, string> = { c: 'C', cpp: 'C++' };
const LIB_COLORS: Record<string, string> = {
  source: 'hsl(var(--accent-sage))',
  'header-only': 'hsl(var(--accent-amber))',
};

function Badge({ children, color }: { children: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
      padding: '4px 10px', borderRadius: '5px', letterSpacing: '.03em',
      background: `${color}18`, color, border: `1px solid ${color}28`,
    }}>
      {children}
    </span>
  );
}

function DownloadChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
            <div
              style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                height: `${(d.count / max) * 100}%`,
                background: i === data.length - 1 ? 'hsl(var(--accent-coral))' : 'hsl(var(--border))',
                transition: 'height .4s ease',
                minHeight: '4px',
              }}
              title={`${d.month}: ${d.count.toLocaleString()}`}
            />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'hsl(var(--ink-4))', whiteSpace: 'nowrap' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); };
  return (
    <button onClick={copy} className="copy-btn" data-testid="button-copy-install" style={{ background: 'hsl(var(--bg-sunken))', color: 'hsl(var(--ink-3))', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
      copy
    </button>
  );
}

export default function PackageDetail() {
  const { name } = useParams<{ name: string }>();
  const pkg = PACKAGES.find(p => p.name === decodeURIComponent(name ?? ''));

  if (!pkg) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'hsl(var(--ink-3))' }}>Package not found.</p>
        <Link to="/packages" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--accent-coral))', display: 'inline-block', marginTop: '16px' }}>← Back to registry</Link>
      </div>
    );
  }

  const history = generateDownloadHistory(pkg.downloads);
  const installCmd = `cpm install ${pkg.name}`;
  const monthlyDownloads = history[history.length - 1].count;

  return (
    <div className="page-wrap" style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,48px)' }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-4))' }}>
        <Link to="/packages" style={{ color: 'hsl(var(--ink-3))', transition: 'color .15s' }} data-testid="link-back-registry">
          registry
        </Link>
        <span>/</span>
        <span style={{ color: 'hsl(var(--ink))' }}>{pkg.name}</span>
      </div>

      <div className="pkg-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '40px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 600, color: 'hsl(var(--ink))', letterSpacing: '-.02em', margin: 0 }}>
                {pkg.name}
              </h1>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-3))', background: 'hsl(var(--bg-sunken))', border: '1px solid hsl(var(--border-dim))', padding: '5px 12px', borderRadius: '5px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                v{pkg.latestVersion}
              </span>
            </div>
            <p style={{ fontSize: '16px', color: 'hsl(var(--ink-2))', lineHeight: 1.6, fontFamily: 'var(--font-mono)', fontWeight: 300, marginBottom: '16px' }}>
              {pkg.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge color={LANG_COLORS[pkg.lang]}>{LANG_LABELS[pkg.lang]}</Badge>
              <Badge color={LIB_COLORS[pkg.libType]}>{pkg.libType}</Badge>
              <Badge color="hsl(var(--ink-3))">{pkg.license}</Badge>
            </div>
          </div>

          {/* Install */}
          <div style={{ background: 'hsl(var(--bg-sunken))', border: '1px solid hsl(var(--border-dim))', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid hsl(var(--border-dim))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.05em' }}>INSTALL</span>
              <CopyButton text={installCmd} />
            </div>
            <div style={{ padding: '16px 20px' }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'hsl(var(--ink-2))' }}>
                <span style={{ color: 'hsl(var(--ink-4))' }}>$ </span>{installCmd}
              </code>
            </div>
          </div>

          {/* Downloads chart */}
          <div style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border-dim))', borderRadius: '10px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-3))', letterSpacing: '.04em' }}>DOWNLOADS / MONTH</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 600, color: 'hsl(var(--ink))' }}>
                {monthlyDownloads.toLocaleString()}
              </span>
            </div>
            <DownloadChart data={history} />
          </div>

          {/* Readme */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', marginBottom: '16px', textTransform: 'uppercase' }}>README</h2>
            <div style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border-dim))', borderRadius: '10px', padding: '28px' }}>
              {pkg.readme.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '14px', color: 'hsl(var(--ink-2))', lineHeight: 1.8, fontWeight: 300, marginBottom: i < pkg.readme.split('\n\n').length - 1 ? '16px' : 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          {pkg.deps.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', marginBottom: '12px', textTransform: 'uppercase' }}>
                DEPENDENCIES ({pkg.deps.length})
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pkg.deps.map(dep => (
                  <Link
                    key={dep}
                    to={`/packages/${encodeURIComponent(dep)}`}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '13px',
                      color: 'hsl(var(--accent-blue))', background: 'hsl(var(--bg-sunken))',
                      border: '1px solid hsl(var(--border-dim))', borderRadius: '5px',
                      padding: '6px 12px', transition: 'border-color .15s, color .15s',
                    }}
                    data-testid={`link-dep-${dep}`}
                  >
                    {dep}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px' }}>

          {/* Stats */}
          <div style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border-dim))', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', marginBottom: '16px' }}>STATS</h3>
            {[
              { label: 'total downloads', val: pkg.downloads.toLocaleString(), icon: '⬇️' },
              { label: 'stars', val: pkg.stars.toLocaleString(), icon: '⭐' },
              { label: 'likes', val: pkg.likes.toLocaleString(), icon: '❤️' },
              { label: 'author', val: pkg.author, icon: '👤' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid hsl(var(--border-dim))' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))' }}>{stat.icon} {stat.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color: 'hsl(var(--ink-2))' }}>{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Versions */}
          <div style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border-dim))', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', marginBottom: '14px' }}>VERSIONS</h3>
            {pkg.versions.map((v, i) => (
              <div key={v} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < pkg.versions.length - 1 ? '1px solid hsl(var(--border-dim))' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: i === 0 ? 'hsl(var(--ink))' : 'hsl(var(--ink-3))' }}>v{v}</span>
                {i === 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'hsl(var(--accent-sage))', background: 'hsl(var(--accent-sage) / .12)', border: '1px solid hsl(var(--accent-sage) / .25)', padding: '2px 7px', borderRadius: '3px' }}>latest</span>
                )}
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border-dim))', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'hsl(var(--ink-4))', letterSpacing: '.06em', marginBottom: '14px' }}>LINKS</h3>
            <a href={pkg.homepage} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--accent-blue))', padding: '6px 0', transition: 'opacity .15s' }}>
              🏠 Homepage ↗
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: responsive sidebar stacks below */}
      <style>{`
        @media (max-width: 720px) {
          .pkg-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
