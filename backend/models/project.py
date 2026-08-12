from datetime import datetime, timezone

from extensions import db

# Many-to-many association table: projects <-> tags
project_tags = db.Table(
    "project_tags",
    db.Column("project_id", db.Integer, db.ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class ProjectImage(db.Model):
    __tablename__ = "project_images"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "alt_text": self.alt_text,
            "display_order": self.display_order,
        }


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    short_description = db.Column(db.String(255))
    full_description = db.Column(db.Text)
    challenge_solution = db.Column(db.Text)
    thumbnail_url = db.Column(db.String(500))
    live_demo_url = db.Column(db.String(500))
    github_url = db.Column(db.String(500))
    is_featured = db.Column(db.Boolean, default=False)
    is_public_code = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    images = db.relationship(
        "ProjectImage", backref="project", cascade="all, delete-orphan",
        order_by="ProjectImage.display_order",
    )
    tags = db.relationship("Tag", secondary=project_tags, backref="projects")

    def to_dict(self, detail=False):
        data = {
            "id": self.id,
            "title": self.title,
            "short_description": self.short_description,
            "thumbnail_url": self.thumbnail_url,
            "is_featured": self.is_featured,
            "is_public_code": self.is_public_code,
            "live_demo_url": self.live_demo_url,
            "github_url": self.github_url if self.is_public_code else None,
            "tags": [t.name for t in self.tags],
            "display_order": self.display_order,
        }
        if detail:
            data.update(
                {
                    "full_description": self.full_description,
                    "challenge_solution": self.challenge_solution,
                    "images": [img.to_dict() for img in self.images],
                }
            )
        return data
