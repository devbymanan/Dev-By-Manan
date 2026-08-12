import { ArrowUpRight } from "lucide-react";
import ProjectThumbnail from "./ProjectThumbnail";
import Badge from "../ui/Badge";
import type { Project } from "@/lib/api";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-raised text-left transition-all duration-300 ease-signal hover:-translate-y-1 hover:border-signal/40"
    >
      <ProjectThumbnail
        src={project.thumbnail_url}
        alt={project.title}
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium text-ink">{project.title}</h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-ink-muted transition-transform duration-300 ease-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
          />
        </div>

        {project.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {project.short_description}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
