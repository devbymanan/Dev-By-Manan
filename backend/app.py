import os

from flask import Flask
from flask_cors import CORS

from config import config_by_name
from extensions import db, bcrypt, limiter


def create_app(config_name=None):
    config_name = config_name or os.environ.get("FLASK_ENV", "development")
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # --- Extensions ---
    db.init_app(app)
    bcrypt.init_app(app)
    limiter.init_app(app)

    # CORS: only the deployed frontend (and localhost in dev) can call the API.
    CORS(app, origins=app.config["ALLOWED_ORIGINS"], supports_credentials=True)

    # --- Models (imported for db.create_all() / migrations to see them) ---
    from models import (  # noqa: F401
        AdminUser, Project, ProjectImage, Tag, Skill, Experience,
        SiteContent, ContactSubmission, ResumeDownload,
    )

    # --- Blueprints ---
    from routes.public_routes import public_bp
    from routes.contact_routes import contact_bp
    from routes.admin_routes import admin_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(admin_bp)

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, use_reloader=False)
