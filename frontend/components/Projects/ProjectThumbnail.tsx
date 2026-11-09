import Image from "next/image";
import { Boxes } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";

export default function ProjectThumbnail({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const resolved = resolveMediaUrl(src);

  if (!resolved) {
    return (
      <div
        className={`flex items-center justify-center bg-raised-2 ${className}`}
        role="img"
        aria-label={`${alt} — screenshot coming soon`}
      >
        <Boxes size={28} className="text-ink-muted/40" />
      </div>
    );
  }

  if (resolved.startsWith("data:")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolved}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={resolved} alt={alt} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
    </div>
  );
}
