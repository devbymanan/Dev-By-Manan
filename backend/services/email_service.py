"""
Email service — sends contact-form notifications via Gmail SMTP.

Requires a Gmail App Password (Google Account -> Security -> 2-Step
Verification -> App Passwords), not the regular account password.
Set SMTP_USERNAME / SMTP_PASSWORD in the environment.

Documented in PRD as free-tier now, upgradeable to Resend/SendGrid later —
if that swap happens, only this file should need to change.
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import current_app


def send_contact_notification(name: str, email: str, message: str) -> bool:
    """Sends a notification email to Manan when the contact form is submitted.
    Returns True on success, False on failure (caller decides how to handle)."""

    cfg = current_app.config
    if not cfg["SMTP_USERNAME"] or not cfg["SMTP_PASSWORD"]:
        current_app.logger.warning("SMTP not configured — skipping email send.")
        return False

    msg = MIMEMultipart()
    msg["From"] = cfg["SMTP_USERNAME"]
    msg["To"] = cfg["CONTACT_RECEIVING_EMAIL"]
    msg["Reply-To"] = email
    msg["Subject"] = f"New contact form submission — {name}"

    body = (
        f"New message from the Dev by Manan contact form:\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}\n"
    )
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(cfg["SMTP_HOST"], cfg["SMTP_PORT"]) as server:
            server.starttls()
            server.login(cfg["SMTP_USERNAME"], cfg["SMTP_PASSWORD"])
            server.sendmail(cfg["SMTP_USERNAME"], cfg["CONTACT_RECEIVING_EMAIL"], msg.as_string())
        return True
    except Exception as exc:  # noqa: BLE001 — log and degrade gracefully
        current_app.logger.error(f"Failed to send contact email: {exc}")
        return False
