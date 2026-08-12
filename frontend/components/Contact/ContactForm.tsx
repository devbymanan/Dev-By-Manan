"use client";

import { useState, useId, isValidElement, cloneElement, FormEvent, ReactNode } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/lib/api";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { Button } from "../ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange =
    (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((f) => {
          const next = { ...f };
          delete next[field];
          return next;
        });
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFieldErrors({});

    const recaptcha_token = await getRecaptchaToken("contact");
    const result = await submitContactForm({ ...values, recaptcha_token });

    if (result.ok) {
      setStatus("success");
      setStatusMessage(result.message);
      setValues(EMPTY_VALUES);
    } else {
      setStatus("error");
      setStatusMessage(result.message);
      setFieldErrors(result.fields || {});
    }
  };

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border border-signal/30 bg-signal/5 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="text-signal" size={28} />
        <p className="text-ink">{statusMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-ink-muted underline transition-colors hover:text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Name" error={fieldErrors.name}>
        <input
          type="text"
          required
          maxLength={150}
          value={values.name}
          onChange={handleChange("name")}
          className={inputClass(Boolean(fieldErrors.name))}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email" error={fieldErrors.email}>
        <input
          type="email"
          required
          value={values.email}
          onChange={handleChange("email")}
          className={inputClass(Boolean(fieldErrors.email))}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Message" error={fieldErrors.message}>
        <textarea
          required
          rows={5}
          maxLength={5000}
          value={values.message}
          onChange={handleChange("message")}
          className={inputClass(Boolean(fieldErrors.message))}
          placeholder="Tell me a bit about what you're building…"
        />
      </Field>

      {status === "error" && Object.keys(fieldErrors).length === 0 && (
        <p className="flex items-center gap-2 text-sm text-red-400" role="alert">
          <AlertCircle size={15} /> {statusMessage}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="self-start"
      >
        {status === "submitting" ? (
          "Sending…"
        ) : (
          <>
            Send message <Send size={15} />
          </>
        )}
      </Button>

      {/* Required disclosure — the reCAPTCHA badge itself is hidden via
          globals.css per Google's terms, so this text stands in for it. */}
      <p className="text-xs text-ink-muted">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-ink"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-ink"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })
    : children;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-ink-muted">{label}</span>
      {child}
      {error && (
        <span id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `rounded-xl border bg-raised px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-muted/60 focus:border-signal ${
    hasError ? "border-red-400/60" : "border-line"
  }`;
}
