"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, X, ImagePlus } from "lucide-react";
import { getProjects, getProject, resolveMediaUrl, type Project } from "@/lib/api";
import {
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
  AdminApiError,
  type ProjectPayload,
} from "@/lib/adminApi";
import { useAuth } from "./AuthContext";
import { AdminField, AdminInput, AdminTextarea, AdminCheckbox, AdminPanel } from "./ui/fields";
import { Button } from "../ui/Button";

type ViewState = { mode: "list" } | { mode: "create" } | { mode: "edit"; project: Project };

export default function ProjectsManager() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>({ mode: "list" });

  const refresh = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleEdit = async (id: number) => {
    const detail = await getProject(id);
    if (detail) setView({ mode: "edit", project: detail });
  };

  const handleDelete = async (id: number, title: string) => {
    if (!token) return;
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deleteProject(token, id);
    refresh();
  };

  if (view.mode === "create" || view.mode === "edit") {
    return (
      <ProjectForm
        project={view.mode === "edit" ? view.project : null}
        onDone={() => {
          setView({ mode: "list" });
          refresh();
        }}
        onCancel={() => setView({ mode: "list" })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Projects</h2>
        <Button variant="primary" onClick={() => setView({ mode: "create" })}>
          <Plus size={15} /> New project
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-ink-muted">No projects yet — add your first one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-raised/50 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-display text-base text-ink">{project.title}</h3>
                  {project.is_featured && (
                    <Star size={13} className="shrink-0 fill-signal text-signal" />
                  )}
                </div>
                {project.short_description && (
                  <p className="mt-1 truncate text-sm text-ink-muted">
                    {project.short_description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleEdit(project.id)}
                  className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:border-signal hover:text-signal"
                  aria-label={`Edit ${project.title}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:border-red-400 hover:text-red-400"
                  aria-label={`Delete ${project.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form sub-component (create + edit)
// ---------------------------------------------------------------------------

const EMPTY_FORM: ProjectPayload & { tagsInput: string } = {
  title: "",
  short_description: "",
  full_description: "",
  challenge_solution: "",
  thumbnail_url: "",
  live_demo_url: "",
  github_url: "",
  is_featured: false,
  is_public_code: false,
  display_order: 0,
  tagsInput: "",
};

function ProjectForm({
  project,
  onDone,
  onCancel,
}: {
  project: Project | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { token } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState(project?.images || []);
  const [savedProjectId, setSavedProjectId] = useState<number | null>(project?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        short_description: project.short_description || "",
        full_description: project.full_description || "",
        challenge_solution: project.challenge_solution || "",
        thumbnail_url: project.thumbnail_url || "",
        live_demo_url: project.live_demo_url || "",
        github_url: project.github_url || "",
        is_featured: project.is_featured,
        is_public_code: project.is_public_code,
        display_order: project.display_order,
        tagsInput: project.tags.join(", "),
      });
      setImages(project.images || []);
      setSavedProjectId(project.id);
    }
  }, [project]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ProjectPayload = {
      title: form.title,
      short_description: form.short_description,
      full_description: form.full_description,
      challenge_solution: form.challenge_solution,
      thumbnail_url: form.thumbnail_url,
      live_demo_url: form.live_demo_url,
      github_url: form.github_url,
      is_featured: form.is_featured,
      is_public_code: form.is_public_code,
      display_order: form.display_order,
      tags,
    };

    try {
      if (savedProjectId) {
        await updateProject(token, savedProjectId, payload);
        onDone();
      } else {
        const created = await createProject(token, payload);
        // Stay on the form so image upload becomes available, matching the
        // spec: the image panel only appears once the project has an id.
        setSavedProjectId(created.id);
      }
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Something went wrong saving the project.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!token || !savedProjectId) return;
    setUploading(true);
    try {
      const image = await uploadProjectImage(token, savedProjectId, file, {
        alt_text: form.title,
      });
      setImages((imgs) => [...imgs, image]);
    } catch {
      setError("Image upload failed — check the file type and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId: number) => {
    if (!token || !savedProjectId) return;
    await deleteProjectImage(token, savedProjectId, imageId);
    setImages((imgs) => imgs.filter((img) => img.id !== imageId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">
          {savedProjectId ? "Edit project" : "New project"}
        </h2>
        <button
          onClick={onCancel}
          className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:text-ink"
          aria-label="Cancel"
        >
          <X size={15} />
        </button>
      </div>

      <AdminPanel>
        <div className="flex flex-col gap-5">
          <AdminField label="Title" error={fieldErrors.title}>
            <AdminInput
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </AdminField>

          <AdminField label="Short description" hint="Shown on the project card.">
            <AdminTextarea
              rows={2}
              value={form.short_description}
              onChange={(e) => update("short_description", e.target.value)}
            />
          </AdminField>

          <AdminField label="Full description" hint="Shown in the project modal overview.">
            <AdminTextarea
              rows={4}
              value={form.full_description}
              onChange={(e) => update("full_description", e.target.value)}
            />
          </AdminField>

          <AdminField label="Challenge / solution">
            <AdminTextarea
              rows={4}
              value={form.challenge_solution}
              onChange={(e) => update("challenge_solution", e.target.value)}
            />
          </AdminField>

          <AdminField
            label="Tags"
            hint="Comma-separated, e.g. Flask, MSSQL, Python"
          >
            <AdminInput
              value={form.tagsInput}
              onChange={(e) => update("tagsInput", e.target.value)}
            />
          </AdminField>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Live demo URL">
              <AdminInput
                type="url"
                value={form.live_demo_url}
                onChange={(e) => update("live_demo_url", e.target.value)}
              />
            </AdminField>
            <AdminField label="GitHub URL">
              <AdminInput
                type="url"
                value={form.github_url}
                onChange={(e) => update("github_url", e.target.value)}
              />
            </AdminField>
          </div>

          <AdminField
            label="Thumbnail URL override"
            hint="Leave blank to use the first uploaded image."
          >
            <AdminInput
              value={form.thumbnail_url}
              onChange={(e) => update("thumbnail_url", e.target.value)}
            />
          </AdminField>

          <AdminField label="Display order" hint="Lower numbers appear first.">
            <AdminInput
              type="number"
              value={form.display_order}
              onChange={(e) => update("display_order", Number(e.target.value))}
            />
          </AdminField>

          <div className="flex flex-col gap-3 rounded-xl border border-line/60 p-4">
            <AdminCheckbox
              label="Featured project"
              checked={form.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
            />
            <AdminCheckbox
              label="Make source code public"
              checked={form.is_public_code}
              onChange={(e) => update("is_public_code", e.target.checked)}
            />
            <p className="text-xs text-ink-muted">
              When unchecked, the GitHub link is never sent to the public site —
              it&apos;s gated server-side, not just hidden in the UI.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : savedProjectId ? "Save changes" : "Create project"}
            </Button>
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
          </div>
        </div>
      </AdminPanel>

      {savedProjectId && (
        <AdminPanel title="Images">
          <div className="flex flex-col gap-4">
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => {
                  const src = resolveMediaUrl(img.image_url);
                  return (
                    <div
                      key={img.id}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-line bg-raised-2"
                    >
                      {src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={img.alt_text || form.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleImageDelete(img.id)}
                        className="absolute right-2 top-2 rounded-full bg-void/80 p-1.5 text-ink opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                        aria-label="Delete image"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-dashed border-line px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-signal hover:text-signal">
              <ImagePlus size={15} />
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </AdminPanel>
      )}
    </div>
  );
}
