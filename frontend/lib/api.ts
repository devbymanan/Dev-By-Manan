import { API_BASE_URL } from "./constants";

export type SkillCategory = "frontend" | "backend" | "database" | "tools";

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  icon_name: string | null;
}

export type SkillsByCategory = Record<SkillCategory, Skill[]>;

export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  duration: string | null;
  description: string | null;
}

export interface SiteContent {
  about_text?: string;
  tagline?: string;
  education_degree?: string;
  education_university?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  resume_url?: string;
  whatsapp_url?: string;
  [key: string]: string | undefined;
}

export interface ProjectImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Project {
  id: number;
  title: string;
  short_description: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_public_code: boolean;
  live_demo_url: string | null;
  github_url: string | null;
  tags: string[];
  display_order: number;
  // Present only on the detail endpoint (GET /api/projects/<id>)
  full_description?: string;
  challenge_solution?: string;
  images?: ProjectImage[];
}

export interface Tag {
  id: number;
  name: string;
}

/**
 * Fetches JSON from the Flask API with a short timeout and a typed fallback.
 * The backend free-tier host can cold-start (see PRD Section 8) — rather
 * than let a slow/failed request break the page, callers get `fallback`
 * and the section renders its own empty state.
 */
async function fetchJSON<T>(path: string, fallback: T, revalidateSeconds = 60): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });
    clearTimeout(timeout);

    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/**
 * Project images/thumbnails come back from the API as relative paths
 * (e.g. "/api/uploads/xyz.png") since Flask serves them itself. Prefix
 * with the API origin so <Image> can load them from the Next.js frontend.
 */
export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

export function getSiteContent() {
  return fetchJSON<SiteContent>("/api/site-content", {});
}

export function getSkills() {
  return fetchJSON<SkillsByCategory>("/api/skills", {
    frontend: [],
    backend: [],
    database: [],
    tools: [],
  });
}

export function getExperience() {
  return fetchJSON<ExperienceEntry[]>("/api/experience", []);
}

export function getProjects() {
  return fetchJSON<Project[]>("/api/projects", []);
}

export function getProject(id: number) {
  return fetchJSON<Project | null>(`/api/projects/${id}`, null);
}

export function getTags() {
  return fetchJSON<Tag[]>("/api/tags", []);
}

/** Client-side call — logs an anonymized download event and returns the resume URL. */
export async function logResumeDownload(): Promise<{ resume_url?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/resume-download`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Resume not available yet." };
    return data;
  } catch {
    return { error: "Network error — please try again." };
  }
}

/** Client-side call — used by the Contact form. */
export async function submitContactForm(payload: {
  name: string;
  email: string;
  message: string;
  recaptcha_token?: string;
}): Promise<{ ok: boolean; message: string; fields?: Record<string, string> }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, message: data.error || "Something went wrong.", fields: data.fields };
    }
    return { ok: true, message: data.message };
  } catch {
    return { ok: false, message: "Network error — please try again." };
  }
}
