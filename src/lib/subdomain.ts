export const RESERVED_SUBDOMAINS = new Set([
  "www", "api", "mail", "admin", "status", "docs", "help",
  "support", "blog", "cdn", "assets", "app", "dev", "staging",
  "test", "ns1", "ns2", "smtp", "ftp", "ssh", "vpn",
]);

export const SUBDOMAIN_MAX_PER_USER = 5;

export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "from-mm.dev";

export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  if (!subdomain || subdomain.length < 3) return { valid: false, error: "Must be at least 3 characters." };
  if (subdomain.length > 63) return { valid: false, error: "Must be 63 characters or fewer." };
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) && !/^[a-z0-9]$/.test(subdomain)) {
    return { valid: false, error: "Only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen." };
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return { valid: false, error: "That subdomain is reserved." };
  }
  return { valid: true };
}

export function buildTarget(
  type: "github_pages" | "vercel" | "netlify",
  githubUsername: string,
  explicitTarget?: string
): string {
  if (type === "github_pages") return `${githubUsername}.github.io`;
  if (type === "vercel") return explicitTarget ?? "cname.vercel-dns.com";
  return explicitTarget ?? "";
}
