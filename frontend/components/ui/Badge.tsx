export default function Badge({
  children,
  active = false,
  as: Tag = "span",
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  as?: "span" | "button";
  [key: string]: any;
}) {
  return (
    <Tag
      aria-pressed={Tag === "button" ? active : undefined}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-xs transition-colors duration-200 ${
        active
          ? "border-signal-fill bg-signal-fill text-white"
          : "border-line bg-raised text-ink-muted hover:border-signal/50 hover:text-ink"
      }`}
      {...props}
    >
      {children}
    </Tag>
  );
}
