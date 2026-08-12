"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import Badge from "../ui/Badge";
import Reveal from "../Reveal";
import type { Project } from "@/lib/api";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center text-ink-muted">
        Projects will appear here once added via the CMS.
      </div>
    );
  }

  return (
    <>
      {allTags.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <Badge as="button" active={activeTag === null} onClick={() => setActiveTag(null)}>
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              as="button"
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <Reveal key={project.id} delay={Math.min(i * 0.06, 0.24)}>
            <ProjectCard project={project} onOpen={() => setOpenProject(project)} />
          </Reveal>
        ))}
      </div>

      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
}
