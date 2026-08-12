import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(email: str) -> bool:
    return bool(email) and bool(EMAIL_RE.match(email.strip()))


def validate_contact_payload(data: dict):
    """Returns (is_valid, errors_dict)."""
    errors = {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or len(name) < 2:
        errors["name"] = "Name must be at least 2 characters."
    elif len(name) > 150:
        errors["name"] = "Name is too long."

    if not is_valid_email(email):
        errors["email"] = "A valid email address is required."

    if not message or len(message) < 10:
        errors["message"] = "Message must be at least 10 characters."
    elif len(message) > 5000:
        errors["message"] = "Message is too long."

    return (len(errors) == 0, errors)


def allowed_file(filename: str, allowed_extensions: set) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions
