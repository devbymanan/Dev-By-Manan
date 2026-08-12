"""
Auth service — single admin user, JWT-based session, bcrypt hashing.

Kept intentionally simple: one user, one role. Do not add a roles/permissions
system — see CLAUDE.md "Solo-only architecture".
"""

from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import current_app, request, jsonify

from extensions import bcrypt


def hash_password(plain_password: str) -> str:
    return bcrypt.generate_password_hash(plain_password).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.check_password_hash(password_hash, plain_password)


def issue_token(admin_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(admin_id),  # PyJWT requires "sub" to be a string
        "iat": now,
        "exp": now + current_app.config["JWT_EXPIRES"],
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET"], algorithm="HS256")


def decode_token(token: str):
    """Returns the payload dict, or raises jwt exceptions on invalid/expired tokens."""
    return jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])


def admin_required(fn):
    """Decorator for admin routes. Expects `Authorization: Bearer <token>`."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or malformed Authorization header"}), 401

        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired, please log in again"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid session token"}), 401

        request.admin_id = int(payload["sub"])
        return fn(*args, **kwargs)

    return wrapper
