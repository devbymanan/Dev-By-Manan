export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return ""; // In browser, relative URL works
  }
  if (process.env.URL) {
    return process.env.URL; // Netlify site URL
  }
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL;
  }
  return "https://dev-by-manan.netlify.app";
}

export const API_BASE_URL = "";

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const SITE_META = {
  name: "Manan Ashraf",
  brand: "Dev by Manan",
  title: "Full-Stack Web Developer",
} as const;
