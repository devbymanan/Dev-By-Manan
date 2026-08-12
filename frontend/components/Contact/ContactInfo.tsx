import { Mail, MessageCircle } from "lucide-react";

export default function ContactInfo({
  email,
  whatsappUrl,
}: {
  email?: string;
  whatsappUrl?: string;
}) {
  if (!email && !whatsappUrl) return null;

  return (
    <div className="flex flex-col gap-3">
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-3 text-sm text-ink-muted transition-colors duration-200 hover:text-signal"
        >
          <Mail size={16} /> {email}
        </a>
      )}
      {/* WhatsApp Business link only — phone number is never displayed
          raw, per CLAUDE.md non-negotiable constraints. */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 text-sm text-ink-muted transition-colors duration-200 hover:text-signal"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      )}
    </div>
  );
}
