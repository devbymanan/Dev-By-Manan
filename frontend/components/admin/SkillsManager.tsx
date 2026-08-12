"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getSkills, type Skill, type SkillCategory, type SkillsByCategory } from "@/lib/api";
import { createSkill, updateSkill, deleteSkill, AdminApiError } from "@/lib/adminApi";
import { useAuth } from "./AuthContext";
import { AdminField, AdminInput, AdminPanel } from "./ui/fields";
import { Button } from "../ui/Button";

const CATEGORIES: SkillCategory[] = ["frontend", "backend", "database", "tools"];
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  tools: "Tools",
};

type FormState = {
  id: number | null;
  name: string;
  category: SkillCategory;
  icon_name: string;
  display_order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  category: "frontend",
  icon_name: "",
  display_order: 0,
};

export default function SkillsManager() {
  const { token } = useAuth();
  const [skills, setSkills] = useState<SkillsByCategory>({
    frontend: [],
    backend: [],
    database: [],
    tools: [],
  });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setSkills(await getSkills());
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
        name: form.name,
        category: form.category,
        icon_name: form.icon_name || null,
        display_order: form.display_order,
      };
      if (form.id) {
        await updateSkill(token, form.id, payload);
      } else {
        await createSkill(token, payload);
      }
      setForm(null);
      refresh();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to save skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (!token) return;
    if (!window.confirm(`Delete "${skill.name}"?`)) return;
    await deleteSkill(token, skill.id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Skills</h2>
        <Button variant="primary" onClick={() => setForm(EMPTY_FORM)}>
          <Plus size={15} /> New skill
        </Button>
      </div>

      {form && (
        <AdminPanel
          title={form.id ? "Edit skill" : "New skill"}
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
              <AdminField label="Name">
                <AdminInput
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </AdminField>
              <AdminField label="Category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as SkillCategory })
                  }
                  className="rounded-xl border border-line bg-raised px-4 py-2.5 text-sm text-ink outline-none focus:border-signal"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Icon name" hint="Optional — lucide-react icon key.">
                <AdminInput
                  value={form.icon_name}
                  onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                />
              </AdminField>
              <AdminField label="Display order">
                <AdminInput
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: Number(e.target.value) })
                  }
                />
              </AdminField>
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Create skill"}
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
      ) : (
        <div className="flex flex-col gap-8">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-muted">
                {CATEGORY_LABELS[category]}
              </h3>
              {skills[category].length === 0 ? (
                <p className="text-sm text-ink-muted">No skills in this category yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills[category].map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 rounded-full border border-line bg-raised/50 py-1.5 pl-4 pr-2 text-sm text-ink"
                    >
                      {skill.name}
                      <button
                        onClick={() =>
                          setForm({
                            id: skill.id,
                            name: skill.name,
                            category: skill.category,
                            icon_name: skill.icon_name || "",
                            display_order: 0,
                          })
                        }
                        className="rounded-full p-1 text-ink-muted transition-colors hover:text-signal"
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill)}
                        className="rounded-full p-1 text-ink-muted transition-colors hover:text-red-400"
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
