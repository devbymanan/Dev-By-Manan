-- Dev by Manan — Initial schema (MSSQL / Azure SQL Database)
-- Source of truth: docs/PRD.md Section 15. Run this against Azure SQL for
-- the production database. Local development uses SQLAlchemy's
-- db.create_all() against SQLite instead — see backend/README.md.

-- Admin authentication
CREATE TABLE admin_users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Projects
CREATE TABLE projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    short_description VARCHAR(255),
    full_description NVARCHAR(MAX),
    challenge_solution NVARCHAR(MAX),
    thumbnail_url VARCHAR(500),
    live_demo_url VARCHAR(500),
    github_url VARCHAR(500),
    is_featured BIT DEFAULT 0,
    is_public_code BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO
-- MSSQL has no "ON UPDATE CURRENT_TIMESTAMP" clause — updated_at needs a trigger:
CREATE TRIGGER trg_projects_updated_at ON projects
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE projects
    SET updated_at = SYSUTCDATETIME()
    FROM projects p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Project images (gallery, supports multiple screenshots per project)
CREATE TABLE project_images (
    id INT IDENTITY(1,1) PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tech stack tags (normalized, reusable across projects for filtering)
CREATE TABLE tags (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Many-to-many: projects <-> tags
CREATE TABLE project_tags (
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Skills (categorized)
-- MSSQL has no ENUM type — use a CHECK constraint instead
CREATE TABLE skills (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
    icon_name VARCHAR(100),
    display_order INT DEFAULT 0
);

-- Experience entries
CREATE TABLE experience (
    id INT IDENTITY(1,1) PRIMARY KEY,
    company VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    duration VARCHAR(100),
    description NVARCHAR(MAX),
    display_order INT DEFAULT 0
);

-- Site content (single-row key-value style table for About text, resume URL, etc.)
CREATE TABLE site_content (
    content_key VARCHAR(100) PRIMARY KEY,
    content_value NVARCHAR(MAX)
);
-- Example rows: ('about_text', '...'), ('resume_url', '...'), ('education_degree', '...'), ('education_university', '...')

-- Contact form submissions (for record-keeping, even though emailed directly)
CREATE TABLE contact_submissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    submitted_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    email_sent BIT DEFAULT 0
);

-- Resume download tracking (lightweight analytics)
CREATE TABLE resume_downloads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    downloaded_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    ip_hash VARCHAR(64)
);
