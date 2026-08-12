import { Github, Linkedin, Mail } from "lucide-react";
import Container from "./ui/Container";
import { LinkButton } from "./ui/Button";
import { getSiteContent } from "@/lib/api";
import { SITE_META } from "@/lib/constants";

export default async function Footer() {
  const content = await getSiteContent();
  const year = new Date().getFullYear();

  const socials = [
    content.github_url && { icon: Github, href: content.github_url, label: "GitHub" },
    content.linkedin_url && { icon: Linkedin, href: content.linkedin_url, label: "LinkedIn" },
    content.email && { icon: Mail, href: `mailto:${content.email}`, label: "Email" },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[];

  return (
    <footer className="border-t border-line py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
              Have a project in mind?
            </h2>
            <p className="mt-3 max-w-md text-ink-muted">
              Let&apos;s talk about what you&apos;re building.
            </p>
            <LinkButton href="#contact" variant="primary" className="mt-6">
              Start a conversation
            </LinkButton>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-200 hover:border-signal hover:text-signal"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-8 text-sm text-ink-muted md:flex-row md:items-center">
          <p>
            © {year} {SITE_META.brand}. All rights reserved.
          </p>
          <p className="font-mono text-xs">Built by Manan.</p>
        </div>
      </Container>
    </footer>
  );
}
