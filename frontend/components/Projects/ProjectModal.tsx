"use client";

import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import ProjectThumbnail from "./ProjectThumbnail";
import Badge from "../ui/Badge";
import { getProject } from "@/lib/api";
import type { Project } from "@/lib/api";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Project>(project);
  const [loading, setLoading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getProject(project.id).then((full) => {
      if (!cancelled && full) setDetail(full);
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [project.id]);

  useEffect(() => {
    // Remember what had focus before the modal opened (the project card
    // button) so it can be restored on close, rather than leaving focus
    // stranded on a now-unmounted element.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Basic focus trap — keeps Tab/Shift+Tab cycling within the dialog
      // instead of escaping into the page behind it, per the WAI-ARIA
      // dialog pattern.
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const images = detail.images && detail.images.length > 0 ? detail.images : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${detail.title} — project details`}
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-void/80 px-4 py-8 backdrop-blur-sm md:items-center md:py-12"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} className="w-full max-w-2xl rounded-2xl border border-line bg-raised">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-display text-lg font-medium text-ink">{detail.title}</h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-raised-2 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {images ? (
            <div className="mb-6 flex gap-3 overflow-x-auto">
              {images.map((img) => (
                <ProjectThumbnail
                  key={img.id}
                  src={img.image_url}
                  alt={img.alt_text || detail.title}
                  className="h-40 w-56 shrink-0 rounded-xl"
                />
              ))}
            </div>
          ) : (
            <ProjectThumbnail
              src={detail.thumbnail_url}
              alt={detail.title}
              className="mb-6 aspect-[16/9] w-full rounded-xl"
            />
          )}

          {detail.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {detail.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-ink-muted">Loading details…</p>
          ) : (
            <div className="flex flex-col gap-6">
              {detail.full_description && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                    Overview
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {detail.full_description}
                  </p>
                </div>
              )}

              {detail.challenge_solution && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                    Challenge &amp; solution
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {detail.challenge_solution}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {detail.live_demo_url && (
              <a
                href={detail.live_demo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-signal-fill px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-signal-fill-hover"
              >
                Live demo <ExternalLink size={14} />
              </a>
            )}
            {/* Only rendered when the API returns it — gated server-side by
                is_public_code, so private/institutional project code never
                reaches the client at all. */}
            {detail.github_url && (
              <a
                href={detail.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-signal hover:text-signal"
              >
                <Github size={14} /> View code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
