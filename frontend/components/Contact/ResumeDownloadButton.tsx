"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { logResumeDownload } from "@/lib/api";

export default function ResumeDownloadButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    const result = await logResumeDownload();
    setLoading(false);

    if (result.resume_url) {
      window.open(result.resume_url, "_blank", "noopener,noreferrer");
    } else {
      setError(result.error || "Resume not available yet.");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-signal hover:text-signal disabled:opacity-50"
      >
        <Download size={15} /> {loading ? "Preparing…" : "Download résumé"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-ink-muted" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
