# CLAUDE.md — Project Context for "Dev by Manan" Portfolio

This file gives Claude Code quick working context for this repo. Full requirements live in `docs/PRD.md` — refer to it for anything not covered here.

## What this is
A single-page freelance portfolio for Manan Ashraf (Full-Stack Web Developer). Goal: convince freelance/consulting clients to make contact via a working form. Self-managed via a custom CMS (no headless CMS service — built by hand in Flask).

## Stack
- **Frontend:** Next.js (React) + Tailwind CSS → deployed on Vercel (free tier)
- **Backend:** Flask (Python) → deployed on Render (free tier)
- **Database:** MSSQL → hosted on Azure SQL Database (free tier)
- **Auth:** Flask session/JWT + bcrypt password hashing (admin CMS only)
- **Email:** Flask + Gmail SMTP (contact form)
- **Spam protection:** Google reCAPTCHA v3
- **Analytics:** Plausible or GA (external dashboard, not built into CMS)

## Non-negotiable constraints
- **Free-tier only.** Don't suggest or default to paid services unless explicitly asked.
- **Solo-only architecture.** No team/multi-user data model — single admin user.
- **No AI chatbot, no blog, no i18n, no newsletter, no search, no case studies, no achievement tracker** in v1. These are documented future features — don't build them unprompted.
- **Title is "Full-Stack Web Developer," not "AI Developer."** Don't add AI-branding copy anywhere unless Manan explicitly asks — this was a deliberate trust decision.
- **Phone number is never displayed raw.** Use WhatsApp Business link only.
- **No fabricated stats.** Never add placeholder "X clients served" / "X projects completed" counters with fake numbers.

## Design tokens
- **Colors:** dark charcoal/black base + electric blue accent
- **Typography:** distinctive sans-serif — headings: Space Grotesk or Clash Display; body: Inter or Manrope
- **Theme:** bold/creative, custom illustrations, not template-generic
- **Motion:** scroll reveals, card hover effects, page transitions, custom cursor — all must respect `prefers-reduced-motion`
- **Nav:** transparent, sticky
- **Dark/light mode:** toggle required

## Site sections (in order)
Hero → About → Skills → Projects → Experience → Education → Contact → Footer
Plus a protected `/admin` CMS (not in public nav).

## Build approach
Follow the phased roadmap in `docs/PRD.md` Section 19. Don't try to build the whole app in one pass — work phase by phase:
1. Backend foundation (schema + public API + admin auth)
2. Frontend static sections (Hero, About, Skills, Experience, Education)
3. Projects section (grid, filter, modal) wired to API
4. Contact form + email + reCAPTCHA
5. Admin CMS dashboard
6. Polish (responsiveness, accessibility, performance) + launch prep

## Key reference sections in docs/PRD.md
- Section 15: full MSSQL schema
- Section 16: full API endpoint list
- Section 17: folder structure
- Section 18: architecture diagram
- Section 19: phased roadmap
- Section 20: decision log (why certain choices were made — check before "improving" something that looks odd)

## Developer note
Manan has solid Flask/MSSQL/JS/Tailwind experience but only some exposure to React/Next.js. Prefer clear, well-commented code over clever abstractions, especially in frontend components.
