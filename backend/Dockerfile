# Dockerfile for deploying the Flask backend to Render.
# Installs the msodbcsql18 ODBC driver required by pyodbc to connect
# to Azure SQL, since Render's default Python environment doesn't
# include it.

FROM python:3.11-slim

# --- Install system dependencies + Microsoft ODBC Driver 18 ---
# Uses the modern gpg keyring method since apt-key is removed in
# newer Debian releases. The repo line is written directly (targeting
# Debian 12/Bookworm packages, which also work on Trixie) instead of
# fetching Microsoft's prod.list, since that file can be malformed
# for OS versions Microsoft hasn't published a list for yet.
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    unixodbc \
    unixodbc-dev \
    && curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Install Python dependencies ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Copy app code ---
COPY . .

# Railway/Render set $PORT automatically; gunicorn binds to it.
CMD ["sh", "-c", "gunicorn wsgi:app --bind 0.0.0.0:$PORT"]
