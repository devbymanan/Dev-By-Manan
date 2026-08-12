"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { listContactSubmissions, type ContactSubmission } from "@/lib/adminApi";
import { useAuth } from "./AuthContext";

export default function MessagesManager() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setSubmissions(await listContactSubmissions(token));
      } catch {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl text-ink">Messages</h2>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-ink-muted">No contact form submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line bg-raised/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base text-ink">{s.name}</h3>
                  <a
                    href={`mailto:${s.email}`}
                    className="text-sm text-ink-muted transition-colors hover:text-signal"
                  >
                    {s.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  <span
                    className="flex items-center gap-1.5"
                    title={s.email_sent ? "Notification email sent" : "Notification email not sent"}
                  >
                    {s.email_sent ? (
                      <CheckCircle2 size={13} className="text-signal" />
                    ) : (
                      <Circle size={13} />
                    )}
                    {s.email_sent ? "Notified" : "Not notified"}
                  </span>
                  {s.submitted_at && <span>{formatDate(s.submitted_at)}</span>}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-muted">{s.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
