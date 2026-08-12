# Dev by Manan — Frontend (Next.js)

Phase 2 of the build (see root `README.md` / `CLAUDE.md` / `docs/PRD.md`
Section 19).

## Local setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Requires the backend running (see `../backend/README.md`) — sections fetch
live data from the Flask API and degrade gracefully (empty states, not
crashes) if it's unreachable.

## What's built (Phase 2)

- **Design tokens** (`tailwind.config.ts` + `app/globals.css`): dark
  charcoal/black base with one electric-blue accent ("signal"), per
  CLAUDE.md. Colors are CSS variables so dark/light mode is a variable
  swap, not a duplicated palette.
- **Typography**: Space Grotesk (headings), Manrope (body), JetBrains Mono
  (labels/tags/data) — loaded via `next/font/google`, self-hosted at build
  time (no runtime Google Fonts request, no layout shift).
- **Signature motif**: a recurring "signal line" divider (thin line + a
  pulsing dot) between sections, and a converging-nodes illustration in
  About — both a direct, honest nod to what the AMS project actually does
  (multiple devices syncing into one database), not generic dev-portfolio
  clipart.
- **Nav**: sticky, transparent at the top, gains a blurred background past
  a scroll threshold. Mobile menu included.
- **Dark/light toggle**: `next-themes`, defaults to dark, no flash on load.
- **Custom cursor**: a small dot + trailing ring that expands on hover
  over interactive elements. Automatically disabled on touch devices and
  when `prefers-reduced-motion` is set — see `components/CustomCursor.tsx`.
- **Scroll reveals**: `components/Reveal.tsx`, a thin `framer-motion`
  wrapper that also respects `prefers-reduced-motion` (renders with no
  animation at all rather than a faster version of it).
- **Sections wired to the API**: Hero (tagline), About (bio), Skills
  (grouped by category, icon-mapped), Experience + Education (combined,
  Experience given more visual weight per the PRD wireframe notes).
- Projects and Contact sections are placeholder anchors for now — real
  implementations land in Phases 3 and 4.

## Known accepted risks

- **Next.js pinned to 14.2.35, not 15/16.** `npm audit` flags several
  advisories only patched in Next 15+, but that upgrade changes core APIs
  (async `searchParams`/`cookies`) and would add real friction given
  Manan's "some exposure to React/Next.js" starting point (per CLAUDE.md).
  Revisit before launch or if traffic/exposure grows — most of the flagged
  issues are self-hosted-server-focused and lower-risk on Vercel.

## Folder structure

```
frontend/
├── app/
│   ├── layout.tsx        # fonts, theme provider, custom cursor, metadata
│   ├── page.tsx           # assembles all sections
│   └── globals.css        # theme CSS variables, reduced-motion handling
├── components/
│   ├── ui/                 # Container, Button, Badge, Eyebrow, SectionHeading, Logo
│   ├── Nav.tsx, Hero.tsx, About.tsx, Skills.tsx, ExperienceEducation.tsx, Footer.tsx
│   ├── CustomCursor.tsx, ThemeProvider.tsx, ThemeToggle.tsx
│   ├── Reveal.tsx, SignalDivider.tsx
│   ├── Projects/           # Phase 3
│   └── Contact/            # Phase 4
└── lib/
    ├── api.ts               # typed fetch wrappers for every backend endpoint
    └── constants.ts
```
