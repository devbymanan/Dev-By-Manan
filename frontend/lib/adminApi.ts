import { API_BASE_URL } from "./constants";
import type { Project, Skill, ExperienceEntry, SiteContent, ProjectImage } from "./api";

// Re-export read fetchers — the public GET endpoints already return
// everything the admin dashboard needs to render lists, so there's no
// separate set of "admin read" endpoints.
export { getProjects, getProject, getSkills, getExperience, getSiteContent } from "./api";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at: string | null;
  email_sent: boolean;
}

class AdminApiError extends Error {
  fields?: Record<string, string>;
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.fields = fields;
  }
}

/**
 * Fetch wrapper for admin endpoints — adds the Bearer token and throws
 * AdminApiError (with any field-level errors attached) on failure so
 * callers can drive form validation the same way ContactForm does.
 */
async function authFetch<T>(
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AdminApiError(data.error || "Request failed", data.fields);
  }
  return data as T;
}

function jsonHeaders(): HeadersInit {
  return { "Content-Type": "application/json" };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function adminLogin(
  username: string,
  password: string
): Promise<{ token: string; admin: { id: number; username: string } }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(data.error || "Invalid username or password");
  }
  return data;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectPayload = Partial<{
  title: string;
  short_description: string;
  full_description: string;
  challenge_solution: string;
  thumbnail_url: string;
  live_demo_url: string;
  github_url: string;
  is_featured: boolean;
  is_public_code: boolean;
  display_order: number;
  tags: string[];
}>;

export function createProject(token: string, payload: ProjectPayload) {
  return authFetch<Project>(token, "/api/admin/projects", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateProject(token: string, id: number, payload: ProjectPayload) {
  return authFetch<Project>(token, `/api/admin/projects/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteProject(token: string, id: number) {
  return authFetch<{ message: string }>(token, `/api/admin/projects/${id}`, {
    method: "DELETE",
  });
}

export function uploadProjectImage(
  token: string,
  projectId: number,
  file: File,
  opts: { alt_text?: string; display_order?: number } = {}
) {
  const form = new FormData();
  form.append("file", file);
  if (opts.alt_text) form.append("alt_text", opts.alt_text);
  if (opts.display_order !== undefined) {
    form.append("display_order", String(opts.display_order));
  }
  return authFetch<ProjectImage>(token, `/api/admin/projects/${projectId}/images`, {
    method: "POST",
    body: form,
  });
}

export function deleteProjectImage(token: string, projectId: number, imageId: number) {
  return authFetch<{ message: string }>(
    token,
    `/api/admin/projects/${projectId}/images/${imageId}`,
    { method: "DELETE" }
  );
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillPayload = Partial<{
  name: string;
  category: Skill["category"];
  icon_name: string | null;
  display_order: number;
}>;

export function createSkill(token: string, payload: SkillPayload) {
  return authFetch<Skill>(token, "/api/admin/skills", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateSkill(token: string, id: number, payload: SkillPayload) {
  return authFetch<Skill>(token, `/api/admin/skills/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteSkill(token: string, id: number) {
  return authFetch<{ message: string }>(token, `/api/admin/skills/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export type ExperiencePayload = Partial<{
  company: string;
  role: string;
  duration: string | null;
  description: string | null;
  display_order: number;
}>;

export function createExperience(token: string, payload: ExperiencePayload) {
  return authFetch<ExperienceEntry>(token, "/api/admin/experience", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateExperience(token: string, id: number, payload: ExperiencePayload) {
  return authFetch<ExperienceEntry>(token, `/api/admin/experience/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deleteExperience(token: string, id: number) {
  return authFetch<{ message: string }>(token, `/api/admin/experience/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Site content
// ---------------------------------------------------------------------------

export function updateSiteContent(token: string, payload: SiteContent) {
  return authFetch<SiteContent>(token, "/api/admin/site-content", {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Contact submissions inbox
// ---------------------------------------------------------------------------

export function listContactSubmissions(token: string) {
  return authFetch<ContactSubmission[]>(token, "/api/admin/contact-submissions");
}

export { AdminApiError };
