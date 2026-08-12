import os
import uuid

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from extensions import db, limiter
from models import (
    AdminUser,
    Project,
    ProjectImage,
    Tag,
    Skill,
    Experience,
    SiteContent,
    ContactSubmission,
)
from services.auth_service import (
    hash_password,
    verify_password,
    issue_token,
    admin_required,
)
from utils.validators import allowed_file

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@admin_bp.post("/login")
@limiter.limit("10 per minute")  # brute-force mitigation, per PRD Section 16 security notes
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    admin = AdminUser.query.filter_by(username=username).first()
    if not admin or not verify_password(password, admin.password_hash):
        return jsonify({"error": "Invalid username or password"}), 401

    token = issue_token(admin.id)
    return jsonify({"token": token, "admin": admin.to_dict()})


@admin_bp.post("/logout")
@admin_required
def logout():
    # Stateless JWT — logout is handled client-side by discarding the token.
    # Documented here as a no-op endpoint so the frontend has a consistent
    # call to make (and a hook point later if a token-blocklist is added).
    return jsonify({"message": "Logged out"})


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------

@admin_bp.post("/projects")
@admin_required
def create_project():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    project = Project(
        title=title,
        short_description=data.get("short_description"),
        full_description=data.get("full_description"),
        challenge_solution=data.get("challenge_solution"),
        thumbnail_url=data.get("thumbnail_url"),
        live_demo_url=data.get("live_demo_url"),
        github_url=data.get("github_url"),
        is_featured=bool(data.get("is_featured", False)),
        is_public_code=bool(data.get("is_public_code", False)),
        display_order=data.get("display_order", 0),
    )

    for tag_name in data.get("tags", []):
        tag = _get_or_create_tag(tag_name)
        project.tags.append(tag)

    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict(detail=True)), 201


@admin_bp.put("/projects/<int:project_id>")
@admin_required
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in [
        "title", "short_description", "full_description", "challenge_solution",
        "thumbnail_url", "live_demo_url", "github_url", "is_featured",
        "is_public_code", "display_order",
    ]:
        if field in data:
            setattr(project, field, data[field])

    if "tags" in data:
        project.tags = [_get_or_create_tag(name) for name in data["tags"]]

    db.session.commit()
    return jsonify(project.to_dict(detail=True))


@admin_bp.delete("/projects/<int:project_id>")
@admin_required
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted"})


@admin_bp.post("/projects/<int:project_id>/images")
@admin_required
def upload_project_image(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(
        file.filename, current_app.config["ALLOWED_IMAGE_EXTENSIONS"]
    ):
        return jsonify({"error": "Invalid or missing image file"}), 400

    # Random filename prevents path traversal / collisions; original name discarded.
    ext = secure_filename(file.filename).rsplit(".", 1)[1].lower()
    stored_name = f"{uuid.uuid4().hex}.{ext}"
    os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
    file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], stored_name))

    image = ProjectImage(
        project_id=project.id,
        image_url=f"/api/uploads/{stored_name}",
        alt_text=request.form.get("alt_text", project.title),
        display_order=request.form.get("display_order", 0, type=int),
    )
    db.session.add(image)
    db.session.commit()
    return jsonify(image.to_dict()), 201


@admin_bp.delete("/projects/<int:project_id>/images/<int:image_id>")
@admin_required
def delete_project_image(project_id, image_id):
    image = ProjectImage.query.filter_by(id=image_id, project_id=project_id).first()
    if not image:
        return jsonify({"error": "Image not found"}), 404

    file_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"], os.path.basename(image.image_url)
    )
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image removed"})


def _get_or_create_tag(name: str) -> Tag:
    name = name.strip()
    tag = Tag.query.filter_by(name=name).first()
    if not tag:
        tag = Tag(name=name)
        db.session.add(tag)
        db.session.flush()
    return tag


# ---------------------------------------------------------------------------
# Site content (About, resume, education)
# ---------------------------------------------------------------------------

@admin_bp.put("/site-content")
@admin_required
def update_site_content():
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Expected an object of content_key: content_value"}), 400

    for key, value in data.items():
        row = SiteContent.query.get(key)
        if row:
            row.content_value = value
        else:
            db.session.add(SiteContent(content_key=key, content_value=value))

    db.session.commit()
    rows = SiteContent.query.all()
    return jsonify({row.content_key: row.content_value for row in rows})


# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------

@admin_bp.post("/skills")
@admin_required
def create_skill():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    category = data.get("category")
    if not name or category not in ("frontend", "backend", "database", "tools"):
        return jsonify({"error": "name and a valid category are required"}), 400

    skill = Skill(
        name=name,
        category=category,
        icon_name=data.get("icon_name"),
        display_order=data.get("display_order", 0),
    )
    db.session.add(skill)
    db.session.commit()
    return jsonify(skill.to_dict()), 201


@admin_bp.put("/skills/<int:skill_id>")
@admin_required
def update_skill(skill_id):
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in ["name", "category", "icon_name", "display_order"]:
        if field in data:
            setattr(skill, field, data[field])

    db.session.commit()
    return jsonify(skill.to_dict())


@admin_bp.delete("/skills/<int:skill_id>")
@admin_required
def delete_skill(skill_id):
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill deleted"})


# ---------------------------------------------------------------------------
# Experience
# ---------------------------------------------------------------------------

@admin_bp.post("/experience")
@admin_required
def create_experience():
    data = request.get_json(silent=True) or {}
    company = (data.get("company") or "").strip()
    role = (data.get("role") or "").strip()
    if not company or not role:
        return jsonify({"error": "company and role are required"}), 400

    entry = Experience(
        company=company,
        role=role,
        duration=data.get("duration"),
        description=data.get("description"),
        display_order=data.get("display_order", 0),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201


@admin_bp.put("/experience/<int:entry_id>")
@admin_required
def update_experience(entry_id):
    entry = Experience.query.get(entry_id)
    if not entry:
        return jsonify({"error": "Experience entry not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in ["company", "role", "duration", "description", "display_order"]:
        if field in data:
            setattr(entry, field, data[field])

    db.session.commit()
    return jsonify(entry.to_dict())


@admin_bp.delete("/experience/<int:entry_id>")
@admin_required
def delete_experience(entry_id):
    entry = Experience.query.get(entry_id)
    if not entry:
        return jsonify({"error": "Experience entry not found"}), 404
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Experience entry deleted"})


# ---------------------------------------------------------------------------
# Contact submissions inbox
# ---------------------------------------------------------------------------

@admin_bp.get("/contact-submissions")
@admin_required
def list_contact_submissions():
    submissions = ContactSubmission.query.order_by(
        ContactSubmission.submitted_at.desc()
    ).all()
    return jsonify([s.to_dict() for s in submissions])
