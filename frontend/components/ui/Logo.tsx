import Link from "next/link";

/**
 * Placeholder brand mark. PRD Section 9 lists the icon-based logo as a
 * separate pre-launch design task — this is a clean typographic stand-in,
 * not a finished mark. Swap the SVG below once the real logo exists.
 */
export default function Logo() {
  return (
    <Link href="#top" className="group flex items-center gap-2" aria-label="Dev by Manan — home">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M7 5L2 11L7 17"
          stroke="var(--signal)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 5L20 11L15 17"
          stroke="currentColor"
          className="text-ink"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-base font-medium tracking-tight text-ink">
        Dev by Manan
      </span>
    </Link>
  );
}
