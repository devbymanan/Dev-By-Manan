# Dockerfile for deploying the Flask backend to Render.
# Installs the msodbcsql18 ODBC driver required by pyodbc to connect
# to Azure SQL, since Render's default Python environment doesn't
# include it.

FROM python:3.11-slim

# --- Install system dependencies + Microsoft ODBC Driver 18 ---
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    unixodbc \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/12/prod.list > /etc/apt/sources.list.d/mssql-release.list \
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

# Render sets $PORT automatically; gunicorn binds to it.
CMD gunicorn wsgi:app --bind 0.0.0.0:$PORT
