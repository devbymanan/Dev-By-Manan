"""
Config — Dev by Manan backend

Local development defaults to SQLite (zero setup, no ODBC driver required).
Production (Render) points DATABASE_URL at Azure SQL via pyodbc — see
README.md "Switching to Azure SQL" for the exact connection string format
and the msodbcsql18 driver install step.

Why SQLite for dev: Manan is comfortable with MSSQL, but requiring the
ODBC driver just to run the app locally slows down day-to-day development.
The schema in migrations/schema.sql is written for MSSQL syntax (used for
the real Azure SQL deploy); models.py uses SQLAlchemy so it runs on either
backend without code changes.
"""

import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    # --- Core ---
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    ENV = os.environ.get("FLASK_ENV", "development")

    # --- Database ---
    # Set DATABASE_URL in production to something like:
    # mssql+pyodbc://<user>:<password>@<server>.database.windows.net:1433/<db>?driver=ODBC+Driver+18+for+SQL+Server
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or (
        f"sqlite:///{os.path.join(BASE_DIR, 'dev.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- Auth (admin CMS only — single user) ---
    JWT_SECRET = os.environ.get("JWT_SECRET", SECRET_KEY)
    JWT_EXPIRES = timedelta(hours=int(os.environ.get("JWT_EXPIRES_HOURS", 12)))

    # --- CORS ---
    # Comma-separated list, e.g. "https://devbymanan.vercel.app,http://localhost:3000"
    ALLOWED_ORIGINS = os.environ.get(
        "ALLOWED_ORIGINS", "http://localhost:3000"
    ).split(",")

    # --- Email (Gmail SMTP) ---
    SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
    SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
    # Gmail App Password, NOT the account password (requires 2FA enabled on the Gmail account)
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
    CONTACT_RECEIVING_EMAIL = os.environ.get(
        "CONTACT_RECEIVING_EMAIL", "devbymanan@gmail.com"
    )

    # --- reCAPTCHA v3 ---
    RECAPTCHA_SECRET_KEY = os.environ.get("RECAPTCHA_SECRET_KEY", "")
    RECAPTCHA_MIN_SCORE = float(os.environ.get("RECAPTCHA_MIN_SCORE", 0.5))
    # Skip verification locally when no key is configured, so contact form
    # dev/testing doesn't require live Google credentials.
    RECAPTCHA_ENABLED = bool(RECAPTCHA_SECRET_KEY)

    # --- File uploads (project images, resume) ---
    UPLOAD_FOLDER = os.environ.get(
        "UPLOAD_FOLDER", os.path.join(BASE_DIR, "uploads")
    )
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}
    ALLOWED_DOC_EXTENSIONS = {"pdf"}


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
