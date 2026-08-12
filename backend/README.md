# Dev by Manan — Backend (Flask)

Phase 1 of the build (see root `CLAUDE.md` / `docs/PRD.md` Section 19).

## Local setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env
python seed.py                  # creates SQLite dev.db + launch content
python app.py                   # runs on http://localhost:5000
```

Local dev uses **SQLite** (`dev.db`, created automatically) — no ODBC driver
needed. Everything routes through SQLAlchemy models so switching to MSSQL in
production is a config change, not a code change.

Health check: `GET http://localhost:5000/api/health` → `{"status": "ok"}`

Default local admin login (change in `.env` before deploying):
- username: `manan`
- password: `change-me-before-launch`

## Switching to Azure SQL (production)

1. Provision an Azure SQL Database (free tier).
2. Run `migrations/001_initial_schema.sql` against it (Azure Data Studio, or
   `sqlcmd`).
3. Install the `msodbcsql18` driver on the host running Flask (Render's
   build step — add an `apt-get install` step or use a Docker image that
   includes it; pyodbc alone isn't enough).
4. Set `DATABASE_URL` on Render to:
   ```
   mssql+pyodbc://<user>:<password>@<server>.database.windows.net:1433/<db>?driver=ODBC+Driver+18+for+SQL+Server
   ```
5. Run `python seed.py` once against production to create the admin user
   and launch content (or insert rows manually via Azure Data Studio).

## Deploying to Render

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn wsgi:app`
- Set all vars from `.env.example` in Render's environment settings.
- Set up the keep-alive ping (cron-job.org hitting `/api/health` every
  ~10 min) per PRD Section 8 — mitigates Render free-tier cold starts.

## Project layout

```
backend/
├── app.py              # Flask app factory
├── wsgi.py              # production entrypoint (gunicorn)
├── config.py            # env-based config, SQLite (dev) / MSSQL (prod)
├── extensions.py        # shared db / bcrypt / limiter instances
├── seed.py               # launch content + admin user
├── models/               # SQLAlchemy models (mirror migrations/001_initial_schema.sql)
├── routes/
│   ├── public_routes.py   # GET-only, no auth
│   ├── contact_routes.py  # POST /api/contact (reCAPTCHA + email)
│   └── admin_routes.py    # JWT-protected CMS endpoints
├── services/
│   ├── auth_service.py       # JWT issue/verify, bcrypt, @admin_required
│   ├── email_service.py      # Gmail SMTP
│   └── recaptcha_service.py  # reCAPTCHA v3 server-side check
├── utils/validators.py
└── migrations/001_initial_schema.sql   # canonical MSSQL schema (PRD Section 15)
```

## Endpoints

See `docs/PRD.md` Section 16 for the full list. All admin routes require
`Authorization: Bearer <token>` from `POST /api/admin/login`.

## Notes / decisions carried over from CLAUDE.md

- Solo-only: one admin user, no roles/permissions system.
- AMS project seeded with `github_url=None` / `is_public_code=False` —
  code is private (institutional data), matches PRD Section 6.
- No fabricated stats anywhere in seed data.
- Phone number is never stored/exposed raw — `whatsapp_url` in site_content
  is the only contact-by-phone channel.
