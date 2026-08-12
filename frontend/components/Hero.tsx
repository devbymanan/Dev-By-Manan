import Container from "./ui/Container";
import Eyebrow from "./ui/Eyebrow";
import { LinkButton } from "./ui/Button";
import SignalDivider from "./SignalDivider";
import { getSiteContent } from "@/lib/api";
import { SITE_META } from "@/lib/constants";

export default async function Hero() {
  const content = await getSiteContent();
  const tagline = content.tagline || "Turning ideas into reliable, well-built products.";

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      {/* Ambient background texture — a faint grid, kept subtle per the
          brief's "not overwhelming" direction. Fixed so it doesn't jitter
          during scroll on lower-powered devices. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>Available for freelance work</Eyebrow>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            {SITE_META.name}
          </h1>
          <p className="mt-3 font-display text-xl text-ink-muted md:text-2xl">
            {SITE_META.title}
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
            {tagline}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <LinkButton href="#projects" variant="primary">
              View My Work ↓
            </LinkButton>
            <LinkButton href="#contact" variant="outline">
              Start a project
            </LinkButton>
          </div>
        </div>

        {/* Photo placeholder — real headshot is a pre-launch task per PRD
            Section 9/19. Deliberately an honest placeholder, not a stock
            photo standing in for Manan. */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] border border-line bg-raised" />
          <div className="absolute inset-6 flex items-center justify-center rounded-[1.5rem] border border-dashed border-line">
            <span className="font-display text-6xl font-medium text-ink-muted/40">MA</span>
          </div>
          <div
            className="absolute -bottom-3 -right-3 h-24 w-24 rounded-full bg-signal/10 blur-2xl"
            aria-hidden="true"
          />
        </div>
      </Container>

      {/* Signature "signal line" — the spine motif that recurs at section
          boundaries throughout the page */}
      <div className="mt-20 md:mt-28">
        <SignalDivider />
      </div>
    </section>
  );
}
