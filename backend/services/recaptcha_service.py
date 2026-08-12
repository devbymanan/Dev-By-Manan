"""
reCAPTCHA v3 verification — server-side token check for the contact form.

v3 is score-based (no challenge UI): Google returns a 0.0-1.0 score per
request, and we reject anything below RECAPTCHA_MIN_SCORE (default 0.5).
"""

import requests
from flask import current_app

VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"


def verify_recaptcha(token: str, remote_ip: str = None) -> bool:
    cfg = current_app.config

    if not cfg["RECAPTCHA_ENABLED"]:
        # No secret configured (local dev) — don't block the form.
        current_app.logger.warning("reCAPTCHA not configured — skipping verification.")
        return True

    if not token:
        return False

    try:
        resp = requests.post(
            VERIFY_URL,
            data={
                "secret": cfg["RECAPTCHA_SECRET_KEY"],
                "response": token,
                "remoteip": remote_ip,
            },
            timeout=5,
        )
        result = resp.json()
    except requests.RequestException as exc:
        current_app.logger.error(f"reCAPTCHA verification request failed: {exc}")
        return False

    return bool(result.get("success")) and result.get("score", 0) >= cfg["RECAPTCHA_MIN_SCORE"]
