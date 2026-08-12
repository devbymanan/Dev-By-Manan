"""
Seed script — populates the database with the real launch content from
PRD Section 6 (AMS project) and Section 9 (content inventory).

Usage:
    python seed.py                 # seeds content, skips if already present
    python seed.py --reset-admin   # also resets the admin password

Admin credentials are read from env vars ADMIN_USERNAME / ADMIN_PASSWORD,
falling back to safe local-dev defaults (change these before deploying).
"""

import os
import sys

from app import create_app
from extensions import db
from models import AdminUser, Project, Tag, Skill, Experience, SiteContent
from services.auth_service import hash_password


def seed_admin(reset=False):
    username = os.environ.get("ADMIN_USERNAME", "manan")
    password = os.environ.get("ADMIN_PASSWORD", "change-me-before-launch")

    admin = AdminUser.query.filter_by(username=username).first()
    if admin and not reset:
        print(f"Admin user '{username}' already exists — skipping.")
        return
    if admin and reset:
        admin.password_hash = hash_password(password)
        print(f"Admin user '{username}' password reset.")
    else:
        admin = AdminUser(username=username, password_hash=hash_password(password))
        db.session.add(admin)
        print(f"Admin user '{username}' created.")
    db.session.commit()


def seed_ams_project():
    if Project.query.filter_by(title="Attendance Management System (AMS)").first():
        print("AMS project already seeded — skipping.")
        return

    tag_names = ["HTML", "Tailwind CSS", "JavaScript", "Python", "Flask", "MSSQL"]
    tags = []
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first() or Tag(name=name)
        db.session.add(tag)
        tags.append(tag)

    project = Project(
        title="Attendance Management System (AMS)",
        short_description=(
            "Aggregates attendance records from multiple physical devices "
            "into a centralized database."
        ),
        full_description=(
            "A centralized attendance system that pulls records from multiple "
            "physical attendance devices and consolidates them into a single "
            "database, supporting multi-device management for institutions "
            "running more than one attendance point."
        ),
        challenge_solution=(
            "Challenge: reliably syncing attendance data from multiple devices "
            "on a scheduled basis while handling conflicting or duplicate "
            "records.\n\n"
            "Solution: a scheduled sync process with de-duplication logic to "
            "keep the central database accurate across all connected devices."
        ),
        thumbnail_url=None,  # Manan adds screenshots via CMS post-launch, per PRD 6/11
        live_demo_url=None,  # not yet deployed, per PRD 6
        github_url=None,     # private — institutional data, per PRD 6
        is_featured=True,
        is_public_code=False,
        display_order=0,
    )
    project.tags = tags
    db.session.add(project)
    db.session.commit()
    print("AMS project seeded.")


def seed_skills():
    if Skill.query.first():
        print("Skills already seeded — skipping.")
        return

    skill_map = {
        "frontend": ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
        "backend": ["Python", "Flask"],
        "database": ["MSSQL"],
        "tools": ["Git", "GitHub"],
    }
    order = 0
    for category, names in skill_map.items():
        for name in names:
            db.session.add(Skill(name=name, category=category, display_order=order))
            order += 1
    db.session.commit()
    print("Skills seeded.")


def seed_experience():
    if Experience.query.first():
        print("Experience already seeded — skipping.")
        return

    db.session.add(
        Experience(
            company="Local software house",
            role="Intern",
            duration=None,
            description=(
                "Contributed to the Attendance Management System (AMS) and an "
                "OCR system, with a focus on device communication."
            ),
            display_order=0,
        )
    )
    db.session.commit()
    print("Experience seeded.")


def seed_site_content():
    content = {
        "about_text": (
            "Software Engineer specializing in automation and web development. "
            "Takes on projects like management systems and website automation."
        ),
        "tagline": "Turning ideas into reliable, well-built products.",
        "education_degree": "Software Engineering",
        "education_university": "University of the Punjab",
        "email": "devbymanan@gmail.com",
        "github_url": "https://github.com/devbymanan",
        "linkedin_url": "https://linkedin.com/in/dev-by-manan",
        "resume_url": "",  # uploaded by Manan via CMS
        "whatsapp_url": "",  # WhatsApp Business link — added by Manan, phone never shown raw
    }

    for key, value in content.items():
        if not SiteContent.query.get(key):
            db.session.add(SiteContent(content_key=key, content_value=value))
    db.session.commit()
    print("Site content seeded.")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_admin(reset="--reset-admin" in sys.argv)
        seed_ams_project()
        seed_skills()
        seed_experience()
        seed_site_content()
    print("\nDone.")
