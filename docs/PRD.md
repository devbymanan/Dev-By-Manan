# Product Requirements Document
## Dev by Manan — Personal Portfolio Website

**Version:** 1.0
**Date:** July 15, 2026
**Owner:** Manan Ashraf
**Status:** Approved for Development

---

## 1. Executive Summary

"Dev by Manan" is a personal freelance portfolio website for Manan Ashraf, a Full-Stack Web Developer specializing in management systems and web automation. The site's primary objective is to demonstrate technical credibility to freelance/consulting clients and convert visitors into inquiries via a working contact form.

The product is a solo-maintained, self-updating platform: Manan will manage all content (projects, resume, About text) through a custom-built CMS without needing to redeploy code for routine updates. The architecture is built lean and free-tier-first, with clear upgrade paths (custom domain, paid hosting, AI chatbot, blog) reserved for future milestones rather than built prematurely.

---

## 2. Product Goals

| Goal Type | Description |
|---|---|
| Primary goal | Present Manan's skills and real project work convincingly enough that freelance clients initiate contact |
| Business goal | Build a client base as a full-time solo freelancer (3-year horizon); evolve into an agency (5-year horizon, not solved for in v1) |
| Trust goal | Every element on the site must be honest and verifiable — no inflated stats, no unearned claims (e.g., "AI" was deliberately removed from the title due to insufficient supporting project work) |
| Technical goal | Fully free-tier deployable, frequently updatable via CMS, built on current industry-standard tools (Next.js, Tailwind, Flask) |

### Non-Goals (explicitly out of scope for v1)
- Blog/articles system
- AI chatbot
- Multi-language support
- Newsletter subscriptions
- Team/agency content structure
- Custom in-CMS analytics dashboard
- Case study pages beyond project detail modals
- Achievement/certification tracker
- Site search (filtering by tech tag is sufficient)

---

## 3. Target Audience & Personas

Primary audience: **Freelance and consulting clients** evaluating Manan for project work (management systems, automation, web development).

See Section 12 (User Personas) for detailed persona breakdowns.

---

## 4. Branding

| Element | Specification |
|---|---|
| Brand name | Dev by Manan |
| Professional title | Full-Stack Web Developer |
| Tagline | "Turning ideas into reliable, well-built products." |
| Logo | Icon-based mark (to be designed — pre-launch task) |
| Tone/personality | Modern, bold, creative — but restrained. Trustworthy, genuine, skilled. Not flashy or overwhelming. |
| Core stack showcased | HTML, CSS, JavaScript, Tailwind CSS, Python, Flask, MSSQL, Git/GitHub |

**Note on "AI":** Manan's title deliberately excludes "AI" despite Python experience, because current project work (AMS) does not have a genuine AI/ML component. This is a trust-preserving decision. Revisit title once a real AI-driven project exists (see Roadmap, Section 19, Future Milestone).

---

## 5. Site Structure (Single-Page Application)

Layout: **Single-page scroll**, transparent **sticky navigation** (updated from an earlier non-sticky decision to solve in-page jump navigation).

### Section order:
1. **Hero** — Photo, name, title, tagline, soft CTA ("View My Work ↓")
2. **About** — Short, present-focused bio (no origin story)
3. **Skills** — Categorized (Frontend / Backend / Database / Tools), polished badge/icon presentation, no percentage bars
4. **Projects** — Filterable by tech stack; card grid + detail modal; Featured flag support
5. **Experience** — Internship entry (company, role, duration, description)
6. **Education** — Degree + university, no dates shown
7. **Contact** — Working contact form + WhatsApp Business link + email + social links (GitHub, LinkedIn)
8. **Footer** — Final CTA, social links, copyright

### Hidden/Admin
- `/admin` (or similar protected route) — Custom Flask-based CMS, authenticated, not linked from public nav

---

## 6. Projects Section — Detailed Requirements

| Requirement | Detail |
|---|---|
| Launch project count | 1 (Attendance Management System — AMS) |
| Expected growth | 5-6 projects within 1 year |
| Card view (grid) | Thumbnail image, title, tech stack tags, 1-line description, "View More" button |
| Detail view (modal) | Image gallery, full description, full tech stack, challenge → solution narrative, Live Demo / View Code buttons (conditionally shown) |
| Filtering | By tech stack tag, built in from launch (scales automatically as projects are added) |
| Featured flag | CMS toggle to pin top projects to the front of the grid |
| Empty state | Friendly placeholder message (low-risk; AMS will always be live) |
| Image failure handling | Gracefully degrade — show other projects, don't break layout |

### AMS Project Record (launch content)
- **Tech stack:** HTML, Tailwind CSS, JavaScript, Python, Flask, MSSQL
- **Problem solved:** Aggregates attendance records from multiple physical devices into a centralized database, supporting multi-device management
- **Challenge/Solution:** Reliably syncing attendance data from multiple devices on a scheduled basis, handling conflicting/duplicate records to maintain database accuracy
- **Live demo:** Not yet deployed (planned)
- **Code:** Private (institutional data) — no public repo link shown
- **Screenshots:** To be added by Manan post-launch via CMS

---

## 7. Design System

| Element | Specification |
|---|---|
| Color palette | Dark charcoal/black base + electric blue accent |
| Theme | Bold/creative with personality — custom illustrations, unique layouts (not template-generic) |
| Typography | Distinctive sans-serif — headings: Space Grotesk or Clash Display; body: Inter or Manrope |
| Cursor | Custom-designed cursor (subtle dot/ring with hover states) — refined, not gimmicky |
| Animations | Scroll-triggered reveals, project card hover effects, page transitions — all respecting `prefers-reduced-motion` |
| Dark/Light mode | Toggle-enabled |
| Responsiveness | Fully responsive, mobile-first build |
| Accessibility | WCAG-conscious: proper contrast ratios, alt text on all images, full keyboard navigation, screen-reader-friendly markup |

---

## 8. Technical Architecture

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | Deployed on Vercel (free tier) |
| Backend/API | Flask (Python), custom-built | Deployed on Render (free tier) |
| Database | MSSQL | Hosted via Azure SQL Database (free tier) |
| Authentication | Flask session/JWT-based, hashed passwords (bcrypt) | Protects `/admin` CMS routes only |
| Email (contact form) | Flask + Gmail SMTP | Free; upgradeable to Resend/SendGrid later |
| Spam protection | Google reCAPTCHA v3 | Invisible, non-intrusive |
| Analytics | Plausible or Google Analytics | External dashboard, not built into CMS |
| Domain | Free subdomain at launch (e.g., `devbymanan.vercel.app`) | Custom domain (~$12/yr) planned once budget allows |
| Hosting cost | $0 at launch | Cold-start mitigation: keep-alive ping (cron-job.org) on Render backend |

### Known accepted risk: Backend cold-start
Render's free tier sleeps after inactivity, causing a 30-60 second delay on the first request after idle time. **Mitigation:** free keep-alive ping service pinging the backend every ~10 minutes. Documented as a launch-week setup task.

---

## 9. Content Inventory

| Field | Value |
|---|---|
| Name | Manan Ashraf |
| Title | Full-Stack Web Developer |
| Tagline | "Turning ideas into reliable, well-built products." |
| About (raw) | Software Engineer specializing in automation and web development. Takes on projects like management systems and website automation. |
| Skills — Frontend | HTML, CSS, JavaScript, Tailwind CSS |
| Skills — Backend | Python, Flask |
| Skills — Database | MSSQL |
| Skills — Tools | Git, GitHub |
| Experience | Intern, local software house — contributed to AMS and OCR systems (device communication focus) |
| Education | Software Engineering, University of the Punjab (no dates shown) |
| GitHub | github.com/devbymanan |
| LinkedIn | linkedin.com/in/dev-by-manan |
| Email | devbymanan@gmail.com |
| Contact (phone) | WhatsApp Business link (raw number not publicly displayed) |
| Photo | To be added by Manan |
| Logo | Icon-based — to be designed (pre-launch task) |

---

## 10. Constraints

| Constraint | Detail |
|---|---|
| Budget | $0 at launch; willing to invest later (domain, paid hosting tier) once earning from freelance work |
| Timeline | Open — self-built with step-by-step guidance |
| Developer experience | Comfortable with Flask/MSSQL/JS/Tailwind; some exposure to React/Next.js (not expert) |
| Maintenance | CMS-driven content updates; code changes only as needed |
| Third-party services | Flask/Gmail SMTP (email), Google reCAPTCHA v3 (spam protection), Plausible/GA (analytics) |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Free-tier backend cold starts | Poor first impression for time-sensitive client visits | Keep-alive ping service (free, ~10 min interval) |
| Free subdomain reads as less professional | Minor trust/credibility impact | Clearly budgeted upgrade path to custom domain once revenue starts |
| Only 1 project at launch, no screenshots yet | Limits trust-building/proof of work | Action item: Manan adds 3-5 AMS screenshots via CMS before/shortly after launch |
| React/Next.js is a newer skill for Manan | Slower initial development, possible early bugs | Guided, step-by-step build process; start with simpler static components before CMS-driven dynamic ones |
| No testimonials at launch | Reduced social proof | Acceptable for v1; revisit once first freelance clients are secured — plan a testimonials section for v1.1 |
| Public exposure of contact info | Spam risk | WhatsApp Business link instead of raw phone number; reCAPTCHA on contact form |
| CMS is custom-built (not a proven headless CMS) | More development time, potential security gaps if done hastily | Follow standard Flask security practices (hashed auth, rate-limited login, parameterized SQL queries, HTTPS-only) |
| "Agency" future goal will eventually require a rebuild | Current architecture is solo-only by design | Documented explicitly as an accepted, deliberate v1 limitation — not an oversight |

### Suggested Future Improvements (post-launch)
- Add testimonials section once 2-3 real client results exist
- Add blog once content bandwidth allows (architecture already accommodates this)
- Build AI chatbot as a v2 differentiator (also re-legitimizes "AI" positioning)
- Upgrade to custom domain and paid backend tier once revenue allows
- Add case studies for larger/more complex future projects
- Consider testimonials/case studies as SEO content once traffic strategy shifts

---

## 12. User Personas

### Persona 1: "Sara" — Startup Founder / Small Business Owner (Primary)
- **Age:** 28-40
- **Goal:** Needs a custom internal tool (e.g., inventory or attendance system) built quickly and reliably, doesn't have an in-house dev team
- **Behavior:** Searches for freelancers via LinkedIn/referrals, skims portfolios quickly, cares about "has this person built something like what I need before?"
- **Key concern:** Trust — will this developer actually deliver, or disappear mid-project?
- **What convinces her:** Seeing a real, working project (AMS) that resembles her own need; clear contact method; professional (not amateur) design
- **Primary path:** Hero → Projects → Contact form

### Persona 2: "Ahmed" — Referral-Based Client
- **Age:** 30-50
- **Goal:** Was referred to Manan by a mutual contact, already has some trust — visiting the site mainly to confirm legitimacy and see visual proof of skill
- **Behavior:** Quick scan, checks About + Projects, may skip straight to Contact
- **Key concern:** "Is this a real, professional operation, or a hobby project?"
- **What convinces him:** Polished design, working demo/screenshots, quick access to WhatsApp/contact
- **Primary path:** Hero (skims) → Contact (fast conversion)

### Persona 3: "Fatima" — Comparison Shopper
- **Age:** 25-45
- **Goal:** Comparing 3-5 freelance developers before choosing one for a project
- **Behavior:** Reads more thoroughly — About, Skills, full project details, checks GitHub/LinkedIn for validation
- **Key concern:** Differentiation — why this developer over others with similar listed skills?
- **What convinces her:** Specificity (real challenge/solution narrative, not generic buzzwords), consistent professional branding across LinkedIn/GitHub/site
- **Primary path:** Full linear scroll, cross-checks LinkedIn/GitHub, then Contact

---

## 13. User Stories

**As a freelance client (Sara/Ahmed/Fatima persona), I want to:**
- See Manan's name, title, and specialty immediately on landing, so I know if he's relevant to my need
- View real project work with enough detail to judge technical capability, so I can assess fit
- Filter projects by technology, so I can quickly find relevant past work
- Download a resume/CV, so I can share it internally with my team
- Contact Manan through a simple form without leaving the site, so I don't lose momentum
- See a confirmation or error message after submitting the contact form, so I know whether it worked
- Browse the site comfortably on my phone, so I'm not restricted to desktop
- Toggle dark/light mode, so I can view comfortably in different environments

**As Manan (site owner), I want to:**
- Add, edit, and delete projects without touching code, so I can keep the portfolio current
- Update my resume file without redeploying the site
- Toggle which projects are "Featured," so my best work is always visible first
- Receive contact form submissions via email, so I don't need to check a separate dashboard
- Know the CMS is secure (authentication, protected routes), so unauthorized users can't alter my content

---

## 14. Wireframe Descriptions

### Hero Section
- Full-viewport height, dark background
- Left/center-aligned: Name (large), Title, Tagline (smaller, muted)
- Photo: right-aligned or centered below text on mobile, circular or soft-cropped
- Soft CTA button below tagline: "View My Work ↓" (scrolls to Projects)
- Sticky nav bar overlays top, transparent background, becomes semi-opaque on scroll

### About Section
- Two-column on desktop (text left, optional illustration/graphic right), single column stacked on mobile
- 2-4 sentence bio, present-focused
- Small CTA or resume download link may live here or in nav

### Skills Section
- Grid or grouped-card layout, 4 categories (Frontend / Backend / Database / Tools)
- Icon + label per skill, no progress bars
- Subtle hover animation on each skill chip

### Projects Section
- Grid layout (1 column mobile, 2-3 columns desktop)
- Filter bar above grid (tech tags, "All" default)
- Each card: thumbnail image (16:9), title, tag pills, 1-line description, "View More" button
- Clicking "View More" opens modal: image gallery/carousel, full description, tech list, challenge/solution block, action buttons (Live Demo / Code / Close)

### Experience & Education
- Compact, minimal-space section — likely combined into one row or side-by-side block
- Experience: company, role, duration, 1-line description
- Education: degree + university only, no dates, smaller visual weight than Experience

### Contact Section
- Contact form: Name, Email, Message fields, Submit button, reCAPTCHA badge
- Adjacent: WhatsApp Business button, email (clickable mailto), GitHub/LinkedIn icons
- Form states: idle → loading (spinner on button) → success (confirmation message) → error (inline message + retry option)

### Footer
- Final CTA line + button
- Social icons repeated
- Copyright, small "Built by Manan" note (optional)

### Admin/CMS (not public-facing)
- Login screen (email/username + password)
- Dashboard: list of projects (edit/delete/add new), resume file upload, About text editor, contact info editor, skills list editor, Featured toggle per project

---

## 15. Database Schema (MSSQL)

```sql
-- Admin authentication
CREATE TABLE admin_users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Projects
CREATE TABLE projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    short_description VARCHAR(255),
    full_description NVARCHAR(MAX),
    challenge_solution NVARCHAR(MAX),
    thumbnail_url VARCHAR(500),
    live_demo_url VARCHAR(500),
    github_url VARCHAR(500),
    is_featured BIT DEFAULT 0,
    is_public_code BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO
-- MSSQL has no "ON UPDATE CURRENT_TIMESTAMP" clause — updated_at needs a trigger:
CREATE TRIGGER trg_projects_updated_at ON projects
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE projects
    SET updated_at = SYSUTCDATETIME()
    FROM projects p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Project images (gallery, supports multiple screenshots per project)
CREATE TABLE project_images (
    id INT IDENTITY(1,1) PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tech stack tags (normalized, reusable across projects for filtering)
CREATE TABLE tags (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Many-to-many: projects <-> tags
CREATE TABLE project_tags (
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Skills (categorized)
-- MSSQL has no ENUM type — use a CHECK constraint instead
CREATE TABLE skills (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
    icon_name VARCHAR(100),
    display_order INT DEFAULT 0
);

-- Experience entries
CREATE TABLE experience (
    id INT IDENTITY(1,1) PRIMARY KEY,
    company VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    duration VARCHAR(100),
    description NVARCHAR(MAX),
    display_order INT DEFAULT 0
);

-- Site content (single-row key-value style table for About text, resume URL, etc.)
CREATE TABLE site_content (
    content_key VARCHAR(100) PRIMARY KEY,
    content_value NVARCHAR(MAX)
);
-- Example rows: ('about_text', '...'), ('resume_url', '...'), ('education_degree', '...'), ('education_university', '...')

-- Contact form submissions (for record-keeping, even though emailed directly)
CREATE TABLE contact_submissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    submitted_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    email_sent BIT DEFAULT 0
);

-- Resume download tracking (lightweight analytics)
CREATE TABLE resume_downloads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    downloaded_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    ip_hash VARCHAR(64)
);
```

---

## 16. API Design (Flask REST Endpoints)

### Public endpoints (no auth)
```
GET  /api/projects                  -> list all projects (with tags, thumbnail, featured flag)
GET  /api/projects/<id>             -> full project detail (gallery, description, challenge/solution)
GET  /api/skills                    -> list all skills grouped by category
GET  /api/experience                -> list experience entries
GET  /api/site-content              -> About text, education info, resume URL
GET  /api/tags                      -> list of all tags (for filter UI)
POST /api/contact                   -> submit contact form (name, email, message + reCAPTCHA token)
POST /api/resume-download           -> log a resume download event, returns file/redirect
```

### Admin endpoints (JWT/session-protected)
```
POST   /api/admin/login             -> authenticate, returns session token
POST   /api/admin/logout            -> invalidate session

POST   /api/admin/projects          -> create new project
PUT    /api/admin/projects/<id>     -> update project
DELETE /api/admin/projects/<id>     -> delete project
POST   /api/admin/projects/<id>/images  -> upload project image(s)
DELETE /api/admin/projects/<id>/images/<image_id> -> remove an image

PUT    /api/admin/site-content      -> update About text, education, resume URL etc.
POST   /api/admin/skills            -> add skill
PUT    /api/admin/skills/<id>       -> edit skill
DELETE /api/admin/skills/<id>       -> remove skill

POST   /api/admin/experience        -> add experience entry
PUT    /api/admin/experience/<id>   -> edit entry
DELETE /api/admin/experience/<id>   -> remove entry

GET    /api/admin/contact-submissions -> view contact form submissions (basic inbox view)
```

### Security notes
- All admin routes require valid session/JWT, checked via Flask middleware/decorator
- Passwords hashed with bcrypt, never stored in plaintext
- Contact form protected by reCAPTCHA v3 token verification server-side
- All SQL queries parameterized (no raw string interpolation) to prevent SQL injection
- File uploads (project images, resume) validated by type/size, stored via a service (or local disk with strict path handling) — sanitize filenames
- Rate limiting on `/api/admin/login` to prevent brute-force attempts
- CORS configured to only allow requests from the deployed frontend domain

---

## 17. Folder Structure

```
dev-by-manan/
├── frontend/                      # Next.js app
│   ├── app/
│   │   ├── page.tsx                # Main single-page portfolio
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects/
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   └── FilterBar.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Contact/
│   │   │   ├── ContactForm.tsx
│   │   │   └── ContactLinks.tsx
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── CustomCursor.tsx
│   │   └── ui/                     # shared buttons, badges, spinners, error states
│   ├── lib/
│   │   ├── api.ts                  # fetch wrappers for Flask API
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                        # Flask app
│   ├── app.py
│   ├── config.py
│   ├── models/
│   │   ├── project.py
│   │   ├── skill.py
│   │   ├── experience.py
│   │   ├── site_content.py
│   │   └── admin_user.py
│   ├── routes/
│   │   ├── public_routes.py
│   │   ├── admin_routes.py
│   │   └── contact_routes.py
│   ├── services/
│   │   ├── email_service.py        # Gmail SMTP integration
│   │   ├── recaptcha_service.py
│   │   └── auth_service.py         # JWT/session + bcrypt handling
│   ├── utils/
│   │   └── validators.py
│   ├── migrations/                 # SQL migration files
│   ├── requirements.txt
│   └── wsgi.py
│
├── docs/
│   └── PRD.md                      # this document
│
└── README.md
```

---

## 18. Technical Architecture Overview

```
┌─────────────────┐         HTTPS          ┌──────────────────┐
│   Next.js App    │ ─────────────────────> │   Flask API       │
│  (Vercel, free)  │ <───────────────────── │  (Render, free)   │
└─────────────────┘        JSON/REST         └──────────────────┘
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    ▼                  ▼                  ▼
                            ┌──────────────┐  ┌────────────────┐  ┌──────────────┐
                            │  MSSQL DB    │  │  Gmail SMTP     │  │  reCAPTCHA   │
                            │ (Azure SQL   │  │  (contact form  │  │  v3 API      │
                            │  free tier)  │  │  emails)        │  │              │
                            └──────────────┘  └────────────────┘  └──────────────┘

External: Plausible/GA (analytics, client-side script)
External: cron-job.org (keep-alive ping to prevent Render cold starts)
```

- **Public site**: static-ish Next.js pages fetch dynamic content (projects, skills, etc.) from Flask API at build/request time
- **Admin CMS**: protected Next.js routes, authenticated calls to Flask admin endpoints
- **Data flow**: MSSQL is the single source of truth; Flask mediates all reads/writes; Next.js never talks to MSSQL directly

---

## 19. Development Roadmap

### Phase 0: Pre-Development Setup (Week 1)
- Register free accounts: Vercel, Render, Azure SQL Database, Plausible/GA, reCAPTCHA
- Set up GitHub repo, folder structure
- Design/create icon-based logo for "Dev by Manan"
- Take AMS screenshots (3-5 images)
- Prepare professional headshot photo

### Phase 1: Backend Foundation (Weeks 2-3)
- Set up Flask app structure, MSSQL schema (run migrations from Section 15)
- Build public API endpoints (projects, skills, experience, site-content)
- Build contact form endpoint with Gmail SMTP + reCAPTCHA integration
- Build admin authentication (login, JWT/session, bcrypt password hashing)
- Build admin CRUD endpoints for projects, skills, experience, site content

### Phase 2: Frontend Foundation (Weeks 3-5)
- Set up Next.js + Tailwind project, design tokens (colors, fonts from Section 7)
- Build static layout components: Nav (sticky/transparent), Hero, Footer
- Build About, Skills, Experience, Education sections (static-ish, content from API)
- Implement dark/light mode toggle
- Implement custom cursor + scroll animations (respecting reduced-motion)

### Phase 3: Projects Section (Weeks 5-6)
- Build project grid, filter bar (tech tag filtering)
- Build project card + detail modal
- Connect to backend API, test with real AMS project data
- Handle empty/error states (image load failures, empty project list)

### Phase 4: Contact & Forms (Week 6-7)
- Build contact form UI with loading/success/error states
- Integrate reCAPTCHA v3 client-side
- Test end-to-end email delivery
- Add WhatsApp Business link, resume download (with tracking)

### Phase 5: Admin CMS (Weeks 7-8)
- Build admin login page
- Build dashboard: project management (add/edit/delete/reorder/feature toggle)
- Build content editors: About text, resume upload, skills, experience
- Test full CMS workflow end-to-end

### Phase 6: Polish & Launch Prep (Week 9)
- Mobile responsiveness pass across all sections
- Accessibility audit (contrast, alt text, keyboard nav, screen reader test)
- Performance pass (image optimization, Lighthouse audit)
- Set up keep-alive ping for Render backend
- Final content review (no placeholder text remaining)

### Phase 7: Launch (Week 10)
- Deploy frontend to Vercel, backend to Render, DB to Azure SQL Database
- Smoke-test all flows in production (contact form, CMS login, project display)
- Share subdomain link, begin outreach

### Future Milestones (Post-Launch, Not Scheduled)
- Add 2nd–6th projects via CMS as they're completed
- Purchase custom domain once budget allows
- Add testimonials section after first client feedback
- Consider blog once content bandwidth exists
- Build AI chatbot as a v2 differentiator (also re-legitimizes "AI" positioning in title)
- Revisit agency/team architecture if freelance business scales

---

## 20. Summary of Key Decisions Log

For traceability, key pivots made during requirements gathering:

- Navigation changed from **non-sticky → transparent sticky** (Section 6) to solve in-page jump navigation without a separate back-to-top button
- Title changed from **"Full-Stack AI Web Developer" → "Full-Stack Web Developer"** (Section 1) due to lack of genuine AI project work — trust-preserving decision
- Landing page stats counter (clients/projects served) **removed entirely** (Section 2) due to insufficient real numbers to display honestly
- OCR software **excluded from Projects** (Section 7) — it was work contributed to, not owned/controlled by Manan; correctly repositioned as Experience instead
- Phone number **replaced with WhatsApp Business link** (Section 7) to avoid spam exposure from public scraping
- Cursor effects **scoped down** from playful/animated to a single refined custom cursor design (Section 4) for better alignment with "professional, not overwhelming"

---

*End of PRD.*
