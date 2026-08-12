import type { MetadataRoute } from "next";

// No sitemap reference yet — the production domain isn't finalized (per
// docs/PRD.md, a custom domain is a post-launch future milestone; v1
// launches on a Vercel subdomain). Add a `sitemap` field here once that's
// settled, pointing at the final URL rather than a placeholder one.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
  };
}
