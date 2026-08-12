import { GraduationCap } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./Reveal";
import { getExperience, getSiteContent } from "@/lib/api";

export default async function ExperienceEducation() {
  const [experience, content] = await Promise.all([getExperience(), getSiteContent()]);

  return (
    <section id="experience" className="py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Background" title="Experience & education." />

        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="flex flex-col gap-4">
            {experience.length > 0 ? (
              experience.map((entry, i) => (
                <Reveal key={entry.id} delay={i * 0.08}>
                  <article className="rounded-2xl border border-line bg-raised p-6 md:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-medium text-ink">{entry.role}</h3>
                      {entry.duration && (
                        <span className="font-mono text-xs text-ink-muted">{entry.duration}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-signal">{entry.company}</p>
                    {entry.description && (
                      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                        {entry.description}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
                Experience will appear here once added via the CMS.
              </div>
            )}
          </div>

          {/* Education — intentionally smaller visual weight, no dates
              shown, per PRD Section 5/14. */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-raised/50 p-6">
              <div className="flex items-center gap-2 text-ink-muted">
                <GraduationCap size={16} />
                <span className="font-mono text-xs uppercase tracking-wide">Education</span>
              </div>
              {content.education_degree ? (
                <>
                  <p className="mt-4 font-display text-base font-medium text-ink">
                    {content.education_degree}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{content.education_university}</p>
                </>
              ) : (
                <p className="mt-4 text-sm text-ink-muted">Added via the CMS.</p>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
