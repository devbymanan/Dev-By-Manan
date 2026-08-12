from flask import Blueprint, request, jsonify

from extensions import db, limiter
from models import ContactSubmission
from services.email_service import send_contact_notification
from services.recaptcha_service import verify_recaptcha
from utils.validators import validate_contact_payload

contact_bp = Blueprint("contact", __name__, url_prefix="/api")


@contact_bp.post("/contact")
@limiter.limit("5 per minute")
def submit_contact():
    data = request.get_json(silent=True) or {}

    is_valid, errors = validate_contact_payload(data)
    if not is_valid:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    recaptcha_token = data.get("recaptcha_token")
    if not verify_recaptcha(recaptcha_token, request.remote_addr):
        return jsonify({"error": "reCAPTCHA verification failed. Please try again."}), 400

    name = data["name"].strip()
    email = data["email"].strip()
    message = data["message"].strip()

    email_sent = send_contact_notification(name, email, message)

    submission = ContactSubmission(
        name=name, email=email, message=message, email_sent=email_sent
    )
    db.session.add(submission)
    db.session.commit()

    # Submission is saved regardless of email delivery, so nothing is lost
    # if Gmail SMTP has a hiccup — visible in the admin inbox either way.
    return jsonify(
        {
            "message": "Thanks for reaching out — I'll get back to you soon.",
            "email_sent": email_sent,
        }
    ), 201
