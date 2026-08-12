# Dev by Manan

Personal freelance portfolio for Manan Ashraf — see `CLAUDE.md` for quick
project context and `docs/PRD.md` for the full requirements.

## Status

- ✅ **Phase 1 — Backend Foundation**: Flask API, MSSQL-compatible schema
  (SQLite locally), public endpoints, contact form (reCAPTCHA + Gmail SMTP),
  admin auth (JWT/bcrypt), admin CRUD, seeded with real launch content.
- ✅ **Phase 2 — Frontend Foundation**: Next.js 14 + Tailwind, full design
  token system (dark charcoal/electric blue, Space Grotesk + Manrope +
  JetBrains Mono), sticky/transparent nav, dark/light toggle, custom
  cursor, scroll reveals — all wired to the live API (Hero, About, Skills,
  Experience/Education).
- ✅ **Phase 3 — Projects section**: grid with tag filtering, card hover
  states, and a detail modal (image gallery, overview, challenge/solution,
  live demo + conditional GitHub link) that fetches full project detail
  on open. Custom cursor redesigned to a precise, snap-tracking reticle
  (no spring/trailing lag) per feedback.
- ✅ **Phase 4 — Contact form**: full form with client-side validation
  states, reCAPTCHA v3 token generation (badge hidden per Google's terms,
  disclosure text shown instead), success/error handling wired to the real
  API, and a resume download button that logs the anonymized event before
  opening the file.
- ✅ **Phase 5 — Admin CMS dashboard**: JWT-authenticated admin (`/admin/login`,
  `/admin/dashboard`), tab-based shell (Projects, Skills, Experience, Site
  content, Messages). Full CRUD for projects (with image upload/delete),
  skills, and experience; site-content editor for about/tagline/education/
  contact links; read-only contact-submissions inbox. GitHub link exposure
  stays server-gated by `is_public_code`, same as the public site.
- ✅ **Phase 6 — Polish**: Accessibility audit (skip-to-content link, focus
  trap + focus restoration in the project modal, `aria-invalid`/
  `aria-describedby` wiring on contact form errors, live-region
  announcements for form success/error states, `aria-pressed` on project
  tag filters, contrast fixes so all white-on-signal button/badge fills
  meet WCAG AA 4.5:1 in both themes). Performance: favicon (`app/icon.svg`)
  and `robots.txt` added, project images already served through
  `next/image` with responsive `sizes`. Theme-aware mobile browser chrome
  color. Responsiveness re-checked across all public sections and the
  admin dashboard — no changes needed, the Phase 2–5 builds already used
  mobile-first Tailwind breakpoints throughout. Content review: no
  placeholder/TODO text found outside the documented pre-launch headshot
  placeholder. Render keep-alive ping stays a launch-week task (needs the
  real Render URL from Phase 7) — `/api/health` and the setup steps are
  already in place in `backend/README.md`.
- ⬜ Phase 7 — Launch

## Getting started (backend)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
python app.py
```

See `backend/README.md` for full details, and `docs/PRD.md` Section 19 for
the phased roadmap this build follows.

## Getting started (frontend)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Requires the backend running on `http://localhost:5000` (see above) — the
frontend fetches Hero/About/Skills/Experience content live from the Flask
API, with graceful fallbacks if the backend is unreachable.

See `frontend/README.md` for design-token rationale and known accepted
risks (Next.js version pinning).
