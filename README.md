# Claude Token Tracker

Real-time countdown dashboard for Claude API usage windows — tracks 5-hour token refresh cycles and weekly resets, with persistent state, dark mode, and motivational quotes.

Live at: [billy-arredondo.github.io/my-claude-countdown](https://billy-arredondo.github.io/my-claude-countdown)

## Stack

| Layer | Tech                                 |
| ----- | ------------------------------------ |
| UI    | React 19 + TypeScript                |
| Build | Vite 8 + Tailwind CSS v4             |
| State | Zustand 5 (persist middleware)       |
| Icons | Material Symbols (Google Fonts)      |
| Fonts | Inter, Source Serif 4, Courier Prime |

## Features

- **Hero countdown** — circular progress ring with color-coded urgency (terracotta → amber → red)
- **5-hour window card** — set by duration or end-time; auto-resets when the window expires
- **Weekly reset card** — configurable day-of-week + time; shows days/hours remaining
- **Quote block** — fetches motivational quotes (ZenQuotes API); configurable refresh interval
- **Dark / light / system theme** — persisted across sessions via Zustand
- **Responsive layout** — collapsible desktop sidebar, scroll-hiding mobile header
- **Animated logo** — configurable idle delay and spin behavior via env vars

## Dev

```bash
pnpm install
pnpm dev
```

## Feature Flags

Set these in a `.env.local` file (all default to `true`/enabled):

```env
VITE_SHOW_APPEARANCE=true
VITE_SHOW_INSPIRATION=true
VITE_SHOW_NOTIFICATIONS=true
VITE_SHOW_SUPPORT_LEGAL=true
```

Logo animation tuning (optional):

```env
VITE_LOGO_IDLE_MS=3000
VITE_LOGO_SPIN_DURATION_MS=2000
VITE_LOGO_SPIN_ROTATIONS=3
```

## Deploy

Automatically deployed to GitHub Pages on push to `main` via GitHub Actions.  
Build secrets map to the feature flag env vars above.
