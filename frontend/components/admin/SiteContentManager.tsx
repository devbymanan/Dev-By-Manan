"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getSiteContent, type SiteContent } from "@/lib/api";
import { updateSiteContent, AdminApiError } from "@/lib/adminApi";
import { useAuth } from "./AuthContext";
import { AdminField, AdminInput, AdminTextarea, AdminPanel } from "./ui/fields";
import { Button } from "../ui/Button";

// Every site_content key the public site reads, per CLAUDE.md /
// docs/PRD.md Section 15. Keeping this list explicit (rather than
// dynamically inferred from whatever keys already exist) means new
// content keys always have a place to be set even before they've ever
// been saved.
const FIELDS: { key: keyof SiteContent; label: string; multiline?: boolean; hint?: string }[] = [
  { key: "tagline", label: "Tagline", hint: "Shown in the Hero section." },
  { key: "about_text", label: "About text", multiline: true },
  { key: "education_degree", label: "Education — degree" },
  { key: "education_university", label: "Education — university" },
  { key: "email", label: "Contact email" },
  { key: "github_url", label: "GitHub URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "resume_url", label: "Resume URL" },
  {
    key: "whatsapp_url",
    label: "WhatsApp link",
    hint: "Phone number is never shown raw on the public site — WhatsApp link only.",
  },
];

export default function SiteContentManager() {
  const { token } = useAuth();
  const [values, setValues] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setValues(await getSiteContent());
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: keyof SiteContent, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSiteContent(token, values);
      setValues(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to save site content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl text-ink">Site content</h2>

      <AdminPanel>
        <div className="flex flex-col gap-5">
          {FIELDS.map(({ key, label, multiline, hint }) => (
            <AdminField key={key} label={label} hint={hint}>
              {multiline ? (
                <AdminTextarea
                  rows={5}
                  value={values[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : (
                <AdminInput
                  value={values[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </AdminField>
          ))}

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                "Saving…"
              ) : (
                <>
                  Save changes <Save size={15} />
                </>
              )}
            </Button>
            {saved && <span className="text-sm text-signal">Saved.</span>}
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
