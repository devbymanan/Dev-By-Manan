"""
WSGI entrypoint for production (Render). Gunicorn is pointed at this file:

    gunicorn wsgi:app

Note: this does NOT call db.create_all() automatically — run migrations
explicitly (see migrations/schema.sql and README "Deploying to Render").
"""

from app import create_app
from extensions import db

app = create_app("production")

with app.app_context():
    db.create_all()
