from datetime import datetime, timezone

from extensions import db


class SiteContent(db.Model):
    """Single-row-per-key content store: about_text, resume_url,
    education_degree, education_university, etc."""

    __tablename__ = "site_content"

    content_key = db.Column(db.String(100), primary_key=True)
    content_value = db.Column(db.Text)


class ContactSubmission(db.Model):
    __tablename__ = "contact_submissions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    email_sent = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "email_sent": self.email_sent,
        }


class ResumeDownload(db.Model):
    __tablename__ = "resume_downloads"

    id = db.Column(db.Integer, primary_key=True)
    downloaded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    ip_hash = db.Column(db.String(64))
