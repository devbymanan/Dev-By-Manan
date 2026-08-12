from extensions import db

SKILL_CATEGORIES = ("frontend", "backend", "database", "tools")


class Skill(db.Model):
    __tablename__ = "skills"
    __table_args__ = (
        db.CheckConstraint(
            f"category IN {SKILL_CATEGORIES}", name="ck_skills_category"
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    icon_name = db.Column(db.String(100))
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "icon_name": self.icon_name,
        }
