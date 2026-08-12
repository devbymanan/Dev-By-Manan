"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getExperience, type ExperienceEntry } from "@/lib/api";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  AdminApiError,
} from "@/lib/adminApi";
import { useAuth } from "./AuthContext";
import { AdminField, AdminInput, AdminTextarea, AdminPanel } from "./ui/fields";
import { Button } from "../ui/Button";

type FormState = {
  id: number | null;
  company: string;
  role: string;
  duration: string;
  description: string;
  display_order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  company: "",
  role: "",
  duration: "",
  description: "",
  display_order: 0,
};

export default function ExperienceManager() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setEntries(await getExperience());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async () => {
    if (!token || !form) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        company: form.company,
        role: form.role,
        duration: form.duration || null,
        description: form.description || null,
        display_order: form.display_order,
      };
      if (form.id) {
        await updateExperience(token, form.id, payload);
      } else {
        await createExperience(token, payload);
      }
      setForm(null);
      refresh();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: ExperienceEntry) => {
    if (!token) return;
    if (!window.confirm(`Delete "${entry.role} at ${entry.company}"?`)) return;
    await deleteExperience(token, entry.id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Experience</h2>
        <Button variant="primary" onClick={() => setForm(EMPTY_FORM)}>
          <Plus size={15} /> New entry
        </Button>
      </div>

      {form && (
        <AdminPanel
          title={form.id ? "Edit entry" : "New entry"}
          action={
            <button
              onClick={() => setForm(null)}
              className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:text-ink"
              aria-label="Cancel"
            >
              <X size={15} />
            </button>
          }
        >
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Company">
                <AdminInput
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </AdminField>
              <AdminField label="Role">
                <AdminInput
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </AdminField>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Duration" hint="e.g. Jan 2024 – Present">
                <AdminInput
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </AdminField>
              <AdminField label="Display order" hint="Lower numbers appear first.">
                <AdminInput
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: Number(e.target.value) })
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Description">
              <AdminTextarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </AdminField>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Create entry"}
              </Button>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </AdminPanel>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-ink-muted">No experience entries yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-raised/50 p-4"
            >
              <div className="min-w-0">
                <h3 className="truncate font-display text-base text-ink">
                  {entry.role} · {entry.company}
                </h3>
                {entry.duration && (
                  <p className="mt-1 text-sm text-ink-muted">{entry.duration}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() =>
                    setForm({
                      id: entry.id,
                      company: entry.company,
                      role: entry.role,
                      duration: entry.duration || "",
                      description: entry.description || "",
                      display_order: 0,
                    })
                  }
                  className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:border-signal hover:text-signal"
                  aria-label={`Edit ${entry.role}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(entry)}
                  className="rounded-full border border-line p-2 text-ink-muted transition-colors hover:border-red-400 hover:text-red-400"
                  aria-label={`Delete ${entry.role}`}
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
