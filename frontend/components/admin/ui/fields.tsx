import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  InputHTMLAttributes as CheckboxAttrs,
  ReactNode,
} from "react";

/**
 * Shared admin form primitives. AdminInput/AdminTextarea spread native
 * HTML props and merge className, so callers just pass value/onChange/etc.
 * directly — same pattern as the public site's Button component.
 */

export function AdminField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-ink-muted">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-ink-muted/70">{hint}</span>}
      {error && (
        <span className="text-xs text-red-400" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export function AdminInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl border border-line bg-raised px-4 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-muted/60 focus:border-signal ${className}`}
      {...props}
    />
  );
}

export function AdminTextarea({
  className = "",
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`rounded-xl border border-line bg-raised px-4 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-muted/60 focus:border-signal ${className}`}
      {...props}
    />
  );
}

export function AdminCheckbox({
  label,
  className = "",
  ...props
}: CheckboxAttrs<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-line bg-raised text-signal accent-signal ${className}`}
        {...props}
      />
      {label}
    </label>
  );
}

export function AdminPanel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-raised/50 p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h3 className="font-display text-lg text-ink">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
