import {
  FileCode2,
  Palette,
  Braces,
  Wind,
  Terminal,
  Server,
  Database,
  GitBranch,
  Github,
  Code2,
  LucideIcon,
} from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./Reveal";
import { getSkills } from "@/lib/api";
import type { Skill, SkillCategory } from "@/lib/api";

// Falls back to a generic icon for anything not explicitly mapped here —
// keeps the CMS free to add new skills without breaking the icon lookup.
const ICON_MAP: Record<string, LucideIcon> = {
  HTML: FileCode2,
  CSS: Palette,
  JavaScript: Braces,
  "Tailwind CSS": Wind,
  Python: Terminal,
  Flask: Server,
  MSSQL: Database,
  Git: GitBranch,
  GitHub: Github,
};

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  tools: "Tools",
};

export default async function Skills() {
  const skills = await getSkills();
  const categories = Object.keys(CATEGORY_LABELS) as SkillCategory[];
  const hasAnySkills = categories.some((c) => skills[c]?.length);

  return (
    <section id="skills" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Skills"
          title="The stack behind the work."
          description="Tools chosen for reliability over hype — the same ones used to actually ship the projects below."
        />

        {hasAnySkills ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, i) => (
              <Reveal key={category} delay={i * 0.08}>
                <SkillGroup label={CATEGORY_LABELS[category]} skills={skills[category] || []} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Container>
    </section>
  );
}

function SkillGroup({ label, skills }: { label: string; skills: Skill[] }) {
  return (
    <div className="rounded-2xl border border-line bg-raised p-6">
      <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </h3>
      <ul className="mt-5 flex flex-col gap-1">
        {skills.map((skill) => {
          const Icon = ICON_MAP[skill.name] || Code2;
          return (
            <li
              key={skill.id}
              className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-raised-2"
            >
              <Icon
                size={17}
                className="text-ink-muted transition-colors duration-200 group-hover:text-signal"
              />
              <span className="text-sm text-ink">{skill.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line p-12 text-center text-ink-muted">
      Skills will appear here once added via the CMS.
    </div>
  );
}
