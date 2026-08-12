"""
Shared extension instances.

Kept in their own module (rather than inside app.py) so models and routes
can import `db` / `bcrypt` without circular-import issues.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

db = SQLAlchemy()
bcrypt = Bcrypt()
limiter = Limiter(key_func=get_remote_address)
