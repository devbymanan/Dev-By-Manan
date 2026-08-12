"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select';

/**
 * A precise, geometric reticle cursor — tracks the pointer 1:1 (no spring
 * lag, deliberately not "flowy") and snaps into a locked, rotated state
 * over interactive elements. Disabled on touch devices and when
 * prefers-reduced-motion is set.
 */
export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer || shouldReduceMotion) return;

    setEnabled(true);
    document.body.classList.add("cursor-ready");

    const handleMove = (e: MouseEvent) => {
      // Raw motion values, no spring — the cursor sits exactly where the
      // pointer is, every frame. That 1:1 tracking is what reads as
      // "precise" instead of "flowy".
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);

    return () => {
      document.body.classList.remove("cursor-ready");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [cursorX, cursorY, shouldReduceMotion]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        animate={{ rotate: hovering ? 45 : 0, scale: hovering ? 1.3 : 1 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Four corner brackets — a reticle/viewfinder frame. Reads as
            precision/engineering rather than a decorative blob, matching
            the "signal" brand motif used elsewhere on the page. */}
        <g stroke="var(--signal)" strokeWidth={hovering ? 2 : 1.6} strokeLinecap="round">
          <path d="M2 8V2H8" />
          <path d="M18 2H24V8" />
          <path d="M24 18V24H18" />
          <path d="M8 24H2V18" />
        </g>
        <motion.circle
          cx="13"
          cy="13"
          r="1.4"
          fill="var(--signal)"
          animate={{ opacity: hovering ? 0 : 1, scale: hovering ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </motion.svg>
    </motion.div>
  );
}
