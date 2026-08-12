from datetime import datetime, timezone

from extensions import db


class AdminUser(db.Model):
    """
    Single admin user for the CMS. Deliberately solo-only per CLAUDE.md —
    do not add a role/permissions system here.
    """

    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {"id": self.id, "username": self.username}
