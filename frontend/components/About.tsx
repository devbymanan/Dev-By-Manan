import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./Reveal";
import { getSiteContent } from "@/lib/api";

export default async function About() {
  const content = await getSiteContent();
  const aboutText =
    content.about_text ||
    "Software Engineer specializing in automation and web development.";

  return (
    <section id="about" className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <Reveal>
          <SectionHeading eyebrow="About" title="Built for reliability, not just launch day." />
          <p className="max-w-xl text-lg leading-relaxed text-ink-muted">{aboutText}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <ConvergeDiagram />
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Signature illustration: several sources converging into one reliable
 * record — a literal, honest nod to what Manan's actual project work does
 * (AMS: multiple attendance devices syncing into a single database),
 * rather than a generic "coding" clipart.
 */
function ConvergeDiagram() {
  const nodes = [
    { x: 20, y: 30 },
    { x: 20, y: 90 },
    { x: 20, y: 150 },
  ];

  return (
    <svg viewBox="0 0 260 180" className="mx-auto w-full max-w-xs text-line" aria-hidden="true">
      {nodes.map((n, i) => (
        <g key={i}>
          <path
            d={`M${n.x + 8} ${n.y} C 100 ${n.y}, 140 90, 200 90`}
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx={n.x} cy={n.y} r="6" fill="var(--bg-raised)" stroke="var(--signal)" strokeWidth="1.5" />
        </g>
      ))}
      <rect x="196" y="70" width="44" height="40" rx="8" fill="var(--bg-raised)" stroke="var(--signal)" strokeWidth="1.5" />
      <path d="M204 84h28M204 92h28M204 100h18" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
