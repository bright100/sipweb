# CPM - The C/C++ Package Manager

## Project Overview
A marketing/documentation website for **cpm**, a C/C++ package manager. Built with React, Vite, TypeScript, and Tailwind CSS. Migrated from Lovable to Replit.

## Architecture
- **Frontend only** — pure React SPA (no backend)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **3D Graphics**: Three.js + @react-three/fiber (gracefully degraded when WebGL unavailable)
- **Animations**: GSAP

## Key Pages
- `/` — Homepage with hero, stats, features overview
- `/features` — Features detail page
- `/commands` — CLI commands reference
- `/manifest` — Project manifest/philosophy
- `/cpp` — C++ support page
- `/install` — Installation instructions
- `/docs` — Documentation index
- `/docs/:slug` — Individual doc pages

## Dev Server
- Runs on port 5000 via `npm run dev`
- Configured for Replit with `host: "0.0.0.0"` and `allowedHosts: true`

## Notes
- The `lovable-tagger` devDependency was removed from the Vite config (Replit-incompatible)
- `ThreeScene` and `Canvas` (react-three/fiber) components are wrapped in `ErrorBoundary` to gracefully handle WebGL unavailability in preview environments
- 3D scenes work fully in production/real browsers
