import hashlib

from flask import Blueprint, jsonify, request, send_from_directory, current_app

from extensions import db
from models import Project, Skill, Experience, SiteContent, Tag, ResumeDownload

public_bp = Blueprint("public", __name__, url_prefix="/api")


@public_bp.get("/projects")
def list_projects():
    """Featured projects first, then by display_order."""
    projects = Project.query.order_by(
        Project.is_featured.desc(), Project.display_order.asc(), Project.id.asc()
    ).all()
    return jsonify([p.to_dict() for p in projects])


@public_bp.get("/projects/<int:project_id>")
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    return jsonify(project.to_dict(detail=True))


@public_bp.get("/skills")
def list_skills():
    skills = Skill.query.order_by(Skill.category.asc(), Skill.display_order.asc()).all()
    grouped = {"frontend": [], "backend": [], "database": [], "tools": []}
    for s in skills:
        grouped.setdefault(s.category, []).append(s.to_dict())
    return jsonify(grouped)


@public_bp.get("/experience")
def list_experience():
    entries = Experience.query.order_by(Experience.display_order.asc()).all()
    return jsonify([e.to_dict() for e in entries])


@public_bp.get("/site-content")
def get_site_content():
    rows = SiteContent.query.all()
    return jsonify({row.content_key: row.content_value for row in rows})


@public_bp.get("/tags")
def list_tags():
    tags = Tag.query.order_by(Tag.name.asc()).all()
    return jsonify([t.to_dict() for t in tags])


@public_bp.post("/resume-download")
def log_resume_download():
    """Logs a lightweight, anonymized download event, then redirects/serves
    the resume file. IP is hashed, never stored raw."""
    ip = request.headers.get("X-Forwarded-For", request.remote_addr) or "unknown"
    ip_hash = hashlib.sha256(ip.encode()).hexdigest()

    db.session.add(ResumeDownload(ip_hash=ip_hash))
    db.session.commit()

    resume_row = SiteContent.query.get("resume_url")
    resume_url = resume_row.content_value if resume_row else None
    if not resume_url:
        return jsonify({"error": "Resume not available yet"}), 404

    return jsonify({"resume_url": resume_url})


@public_bp.get("/uploads/<path:filename>")
def serve_upload(filename):
    """Serves project images / resume files stored on local disk.
    In production this can be swapped for a CDN/object-storage URL without
    changing the API shape — see README 'Swapping file storage'."""
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)
