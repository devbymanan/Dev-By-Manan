"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "./ui/Container";
import Logo from "./ui/Logo";
import ThemeToggle from "./ThemeToggle";
import { NAV_ITEMS } from "@/lib/constants";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-signal ${
        scrolled
          ? "border-b border-line bg-void/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <a
            href="#contact"
            className="rounded-full bg-signal-fill px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-signal hover:bg-signal-fill-hover"
          >
            Get in touch
          </a>
        </div>

        <button
          type="button"
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} className="text-ink" /> : <Menu size={22} className="text-ink" />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="border-t border-line bg-void md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-3 text-sm text-ink-muted transition-colors hover:bg-raised hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between px-2">
              <ThemeToggle />
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-signal-fill px-5 py-2.5 text-sm font-medium text-white"
              >
                Get in touch
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
