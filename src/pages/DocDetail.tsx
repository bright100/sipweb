import { useParams, Link } from 'react-router-dom';
import { FadeIn, SectionLabel, CodeBlock, InlineCode, Tag } from '@/components/shared';

const DOC_PAGES: Record<string, { emoji: string; title: string; color: string; sections: { heading: string; body: string; code?: string; codeTitle?: string }[] }> = {
  manifest: {
    emoji: '📋', title: 'Manifest File', color: 'hsl(var(--accent-sage))',
    sections: [
      { heading: 'Overview', body: 'The cpm.toml file is the heart of every cpm project. It declares your package metadata, dependencies, build configuration, and scripts — all in a single, human-readable TOML file.' },
      { heading: 'Package metadata', body: 'Every manifest starts with a [package] section declaring your project name, version, language (C or C++), and standard version.', code: `[package]\nname    = "myapp"\nversion = "1.0.0"\nlang    = "c++"        # "c" or "c++"\nstd     = "c++17"      # c89/c99/c11/c17 or c++11/14/17/20/23`, codeTitle: 'cpm.toml — [package]' },
      { heading: 'Dependencies', body: 'Dependencies use semantic versioning with caret (^) and tilde (~) operators. Caret allows minor updates, tilde allows patch updates. Exact pinning is also supported.', code: `[dependencies]\nlibcurl       = "^8.0"       # >=8.0.0, <9.0.0\nnlohmann-json = "~3.11"      # >=3.11.0, <3.12.0\nlibuv         = "2.0.0"      # exact match\n\n[dev-dependencies]\ngoogletest = "^1.14"         # test-only`, codeTitle: 'cpm.toml — dependencies' },
      { heading: 'System dependencies', body: 'System libraries (OpenSSL, pthreads, zlib) are declared separately. cpm resolves them via pkg-config and tells you the exact install command if they\'re missing.', code: `[system-dependencies]\nopenssl = ">=1.1"\npthread = "*"\nzlib    = ">=1.2"`, codeTitle: 'cpm.toml — system deps' },
      { heading: 'Build configuration', body: 'The [build] section controls compiler, flags, linker options, and standard library choice. All fields are optional — cpm infers sensible defaults from lang and std.', code: `[build]\ncc      = "g++"\ncflags  = ["-O2", "-Wall", "-Wextra"]\nldflags = ["-lpthread"]\nstdlib  = "libstdc++"     # or "libc++"`, codeTitle: 'cpm.toml — [build]' },
      { heading: 'Scripts', body: 'Define named scripts that run with cpm\'s environment pre-configured — include paths, library paths, and compiler flags are all injected automatically.', code: `[scripts]\nbuild = "cpm compile src/main.cpp -o bin/myapp"\ntest  = "cpm compile tests/*.cpp -o bin/tests && ./bin/tests"\nclean = "rm -rf bin/ .cpm/cache/"`, codeTitle: 'cpm.toml — [scripts]' },
    ]
  },
  lockfile: {
    emoji: '🔒', title: 'Lock File', color: 'hsl(var(--accent-blue))',
    sections: [
      { heading: 'What is cpm.lock?', body: 'The lock file records the exact resolved version, source, and cryptographic checksum of every direct and transitive dependency. It guarantees reproducible builds across machines and CI.' },
      { heading: 'Format', body: 'Each dependency gets a [[package]] entry with its name, exact version, registry source URL, SHA-256 checksum, and dependency list.', code: `[[package]]\nname     = "libcurl"\nversion  = "8.4.0"\nsource   = "registry+https://registry.cpm.dev"\nchecksum = "sha256:a4b3c2d1e5f6..."\ndeps     = ["zlib", "openssl"]\n\n[[package]]\nname     = "nlohmann-json"\nversion  = "3.11.3"\nsource   = "registry+https://registry.cpm.dev"\nchecksum = "sha256:deadbeef1234..."\ndeps     = []`, codeTitle: 'cpm.lock' },
      { heading: 'When it updates', body: 'The lock file updates when you run cpm add, cpm update, or cpm install (if no lock file exists). It never changes silently — every modification requires an explicit command.' },
      { heading: 'Commit it to version control', body: 'Always commit cpm.lock. It ensures that every developer, CI server, and deployment target uses identical dependency versions. Without it, builds are non-deterministic.' },
      { heading: 'Never edit by hand', body: 'The lock file is machine-generated. Manual edits will be overwritten on the next cpm install or will cause checksum verification failures.' },
    ]
  },
  registry: {
    emoji: '🌐', title: 'Registry Protocol', color: 'hsl(var(--accent-amber))',
    sections: [
      { heading: 'Overview', body: 'The cpm registry protocol is an open, documented HTTP API for publishing and fetching C/C++ packages. Unlike proprietary solutions, the spec is public and anyone can self-host a compatible registry.' },
      { heading: 'Package discovery', body: 'Clients query the registry with GET /packages/{name} to retrieve version metadata, dependency lists, and download URLs. Responses are JSON.', code: `GET /packages/libcurl\n\n{\n  "name": "libcurl",\n  "versions": [\n    {\n      "version": "8.4.0",\n      "deps": [{"name": "zlib", "req": "^1.2"}, {"name": "openssl", "req": ">=1.1"}],\n      "checksum": "sha256:a4b3c2d1...",\n      "download": "/packages/libcurl/8.4.0/download"\n    }\n  ]\n}`, codeTitle: 'API response' },
      { heading: 'Publishing', body: 'Authors publish with PUT /packages/{name}/{version}. The registry validates cpm.toml, checks extern "C" guards on C packages, verifies Ed25519 signatures, and indexes the package.' },
      { heading: 'Self-hosting', body: 'Run your own registry for internal/proprietary packages. The reference implementation is a single static binary. Configure cpm to use it with a [registry] section in cpm.toml.', code: `# cpm.toml — use a private registry\n[registry]\ndefault = "https://registry.cpm.dev"\nprivate = "https://cpm.internal.corp.com"`, codeTitle: 'Custom registry' },
      { heading: 'Mirroring', body: 'Registries support mirroring and caching. Point your private registry at the public one as an upstream, and it caches tarballs locally for offline builds and faster CI.' },
    ]
  },
  resolution: {
    emoji: '🧩', title: 'Dependency Resolution', color: 'hsl(var(--accent-coral))',
    sections: [
      { heading: 'The PubGrub algorithm', body: 'cpm uses PubGrub, the same algorithm used by Dart\'s pub. It finds a globally consistent set of package versions that satisfies all constraints, or produces a human-readable explanation of why no solution exists.' },
      { heading: 'Why not SAT solving?', body: 'SAT-based resolvers (like early npm) can produce confusing error messages. PubGrub generates root-cause conflict explanations: "libcurl ^8.0 requires openssl >=1.1, but your project pins openssl 1.0.2."' },
      { heading: 'No duplicate packages', body: 'Unlike npm\'s node_modules, C cannot have two copies of the same library. Two definitions of the same symbol break the linker. cpm enforces exactly one version per package, globally.', code: `# This is impossible in C:\n# node_modules/\n#   libcurl@8.4.0/\n#   some-dep/\n#     node_modules/\n#       libcurl@7.2.0/   ← linker error!\n\n# cpm resolves ONE version:\n# .cpm/deps/libcurl-8.4.0/`, codeTitle: 'No duplicates' },
      { heading: 'Version constraints', body: 'Supported operators: ^ (caret — compatible updates), ~ (tilde — patch updates), = (exact), >=, <=, >, <. Ranges can be combined with commas.' },
      { heading: 'Conflict messages', body: 'When resolution fails, cpm prints a derivation tree showing exactly which constraints conflict and which packages introduced them. No more guessing why your build broke.' },
    ]
  },
  build: {
    emoji: '⚙️', title: 'Build System Integration', color: 'hsl(var(--accent-warm))',
    sections: [
      { heading: 'compile_commands.json', body: 'After every cpm install, cpm writes .cpm/compile_commands.json. This file tells your editor\'s language server (clangd, ccls) where to find headers for all dependencies — autocomplete and jump-to-definition just work.' },
      { heading: 'flags.env', body: 'cpm also writes .cpm/flags.env, a sourceable shell file with CFLAGS, CXXFLAGS, and LDFLAGS pre-populated. Use it in Makefiles or shell scripts.', code: `# .cpm/flags.env (auto-generated)\nexport CFLAGS="-I.cpm/deps/libcurl-8.4.0/include -I.cpm/deps/zlib-1.3/include"\nexport LDFLAGS="-L.cpm/deps/libcurl-8.4.0/lib -lcurl -L.cpm/deps/zlib-1.3/lib -lz"\nexport CXXFLAGS="$CFLAGS -std=c++17"`, codeTitle: '.cpm/flags.env' },
      { heading: 'Static vs dynamic linking', body: 'By default, cpm links statically for maximum portability. Set link_type = "dynamic" in cpm.toml to use shared libraries. Per-dependency overrides are supported.' },
      { heading: 'CMake integration', body: 'cpm generates a .cpm/cpm.cmake toolchain file that can be included in CMakeLists.txt. find_package() calls resolve against cpm-managed dependencies automatically.', code: `# CMakeLists.txt\ncmake_minimum_required(VERSION 3.16)\ninclude(.cpm/cpm.cmake)\n\nproject(myapp)\nfind_package(CURL REQUIRED)   # found via cpm\ntarget_link_libraries(myapp CURL::libcurl)`, codeTitle: 'CMake integration' },
      { heading: 'Makefile integration', body: 'Source .cpm/flags.env in your Makefile to get all include and link flags. cpm stays out of your build system — it just provides the dependencies.' },
    ]
  },
  security: {
    emoji: '🔐', title: 'Security Model', color: 'hsl(var(--accent-sage))',
    sections: [
      { heading: 'Zero-trust by default', body: 'cpm assumes every package is potentially malicious. Every tarball is verified against its SHA-256 checksum from the lock file before extraction. Any mismatch aborts the install.' },
      { heading: 'No lifecycle scripts', body: 'npm\'s postinstall scripts are the #1 supply chain attack vector. cpm has no equivalent. The only code that runs during install is your compiler and ar. Period.' },
      { heading: 'Ed25519 signatures', body: 'Package authors sign releases with Ed25519 keys. The registry verifies signatures on upload. Optionally, cpm can verify signatures locally for full end-to-end trust.', code: `# Sign a release\ncpm publish --sign ~/.cpm/keys/ed25519.key\n\n# Verify signatures locally\n[security]\nrequire_signatures = true\ntrusted_keys = ["ed25519:abc123..."]`, codeTitle: 'Package signing' },
      { heading: 'Allowlisted build steps', body: 'Some packages need custom build steps (autoconf, cmake). These require explicit allowlisting in cpm.toml with interactive confirmation on first install.' },
      { heading: 'Audit command', body: 'cpm audit checks all dependencies against a vulnerability database and reports known CVEs with severity levels and fix recommendations.' },
    ]
  },
  cppabi: {
    emoji: '🔷', title: 'C++ ABI Guide', color: 'hsl(var(--accent-blue))',
    sections: [
      { heading: 'What is ABI compatibility?', body: 'ABI (Application Binary Interface) defines how compiled code interacts at the binary level — function calling conventions, name mangling, vtable layout, and struct padding. Two libraries compiled with incompatible ABIs will crash at runtime.' },
      { heading: 'Name mangling', body: 'C++ compilers encode parameter types into function names (mangling). A function void foo(int) becomes _Z3fooi in GCC. C doesn\'t mangle. Mixing requires extern "C" guards.', code: `// C++ mangled:   _Z3fooi\nvoid foo(int x);\n\n// C unmangled:   foo\nextern "C" void foo(int x);`, codeTitle: 'Name mangling' },
      { heading: 'Standard library choice', body: 'libstdc++ (GCC) and libc++ (Clang/LLVM) are ABI-incompatible. std::string has different internal layouts. cpm tracks stdlib in the build cache key and prevents mixing.' },
      { heading: 'Header-only packages', body: 'Header-only libraries (nlohmann/json, {fmt}, Catch2) have no ABI concerns — they\'re compiled as part of your project. cpm detects lib_type = "header-only" and skips the compilation step.' },
      { heading: 'ABI tags in the cache', body: 'The cpm build cache is keyed by: OS, architecture, compiler name + version, language standard, and stdlib. Switching any of these triggers a clean rebuild of affected dependencies.' },
      { heading: 'C/C++ mixing rules', body: 'C++ packages can depend on C packages (with extern "C" guards). C packages cannot depend on C++ packages. cpm enforces this at resolution time with clear error messages.' },
    ]
  },
  packaging: {
    emoji: '📦', title: 'Package Structure', color: 'hsl(var(--accent-amber))',
    sections: [
      { heading: 'Directory layout', body: 'cpm packages follow a standard layout. Public headers go in include/, source files in src/, and tests in tests/. The cpm.toml manifest sits at the root.', code: `mylib/\n├── cpm.toml\n├── include/\n│   └── mylib/\n│       ├── mylib.h        # public API\n│       └── helpers.h\n├── src/\n│   ├── mylib.c\n│   └── helpers.c\n└── tests/\n    └── test_mylib.c`, codeTitle: 'Package layout' },
      { heading: 'Public header convention', body: 'Headers in include/ are installed for consumers. Headers in src/ are private. This mirrors the convention used by CMake, Meson, and most modern C/C++ projects.' },
      { heading: 'Publish checklist', body: 'Before cpm publish, cpm validates: (1) cpm.toml is well-formed, (2) all declared files exist, (3) C packages have extern "C" guards, (4) the package builds cleanly, (5) version isn\'t already published.' },
      { heading: 'Package types', body: 'cpm supports three package types: static library (default), header-only (no compilation), and executable (binary distribution). Set lib_type in cpm.toml.', code: `[package]\nlib_type = "static"       # default — produces .a / .lib\n# lib_type = "header-only" # no compilation\n# lib_type = "dynamic"     # produces .so / .dylib / .dll`, codeTitle: 'lib_type options' },
      { heading: 'Versioning', body: 'cpm uses semantic versioning (semver). Breaking changes bump major, new features bump minor, bug fixes bump patch. Pre-release tags (1.0.0-beta.1) are supported.' },
    ]
  },
  watchmode: {
    emoji: '👀', title: 'Watch Mode', color: 'hsl(var(--accent-coral))',
    sections: [
      { heading: 'Overview', body: 'Watch mode (--watch) monitors your source tree and automatically recompiles when files change. It\'s like nodemon for C/C++, but with full dependency awareness and incremental builds.' },
      { heading: 'Usage', body: 'Add --watch to any cpm run command. cpm builds the include dependency graph, sets up OS-native file watchers, and enters a reactive loop.', code: `# Watch and rebuild\ncpm run build --watch\n\n# Watch and auto-restart binary\ncpm run build --watch --exec ./bin/myapp\n\n# Watch tests\ncpm run test --watch`, codeTitle: 'Watch mode commands' },
      { heading: 'Incremental rebuilds', body: 'cpm tracks the include graph. When you edit a .cpp file, only that translation unit recompiles. When you edit a .h file, cpm recompiles all .cpp files that include it — directly or transitively.' },
      { heading: 'OS-native watchers', body: 'cpm uses inotify on Linux, FSEvents on macOS, and ReadDirectoryChangesW on Windows. There is zero polling and zero CPU usage when idle.' },
      { heading: 'Custom watch paths', body: 'By default, cpm watches src/ and include/. Add extra paths or ignore patterns in cpm.toml.', code: `[watch]\npaths   = ["src/", "include/", "assets/"]\nignore  = ["*.tmp", "build/"]`, codeTitle: 'cpm.toml — [watch]' },
      { heading: 'Desktop notifications', body: 'Enable system notifications on build success or failure with --notify. Works with libnotify on Linux, osascript on macOS, and toast on Windows.' },
    ]
  },
};

export default function DocDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? DOC_PAGES[slug] : null;

  if (!doc) {
    return (
      <div style={{ padding: '120px 80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📄</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>Page not found</h1>
        <p style={{ color: 'hsl(var(--ink-3))', marginBottom: '32px' }}>This doc page doesn't exist yet.</p>
        <Link to="/docs" className="get-started-btn">← Back to docs</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 80px', maxWidth: '900px', margin: '0 auto' }}>
      <FadeIn>
        <Link to="/docs" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'hsl(var(--ink-4))', letterSpacing: '.04em', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '40px', transition: 'color .2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--ink))')}
          onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--ink-4))')}>
          ← Back to docs
        </Link>
      </FadeIn>

      <FadeIn>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '40px' }}>{doc.emoji}</span>
          <Tag color={doc.color}>{doc.title}</Tag>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: '56px' }}>
          {doc.title}
        </h1>
      </FadeIn>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {doc.sections.map((section, i) => (
          <FadeIn key={i} delay={i * 50}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'hsl(var(--ink))', marginBottom: '12px', letterSpacing: '-.01em' }}>
                {section.heading}
              </h2>
              <p style={{ fontSize: '15px', color: 'hsl(var(--ink-3))', lineHeight: 1.8, fontWeight: 300, marginBottom: section.code ? '20px' : '0' }}>
                {section.body}
              </p>
              {section.code && (
                <CodeBlock title={section.codeTitle || 'code'}>{section.code}</CodeBlock>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={300}>
        <div style={{ marginTop: '72px', paddingTop: '32px', borderTop: '1px solid hsl(var(--border-dim))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/docs" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'hsl(var(--ink-3))', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--ink))')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--ink-3))')}>
            ← All documentation
          </Link>
          <Link to="/install" className="get-started-btn" style={{ textDecoration: 'none' }}>
            Get started →&nbsp;🚀
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
