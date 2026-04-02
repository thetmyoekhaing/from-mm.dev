import type { Subdomain, User } from "@/db/schema";
import { BASE_DOMAIN } from "./subdomain";

export function getDeveloperProfilePath(githubUsername: string) {
  return `/developers/${githubUsername}`;
}

export function getPrimaryPortfolioUrl(
  user: Pick<User, "portfolioUrl">,
  subdomains: Pick<Subdomain, "subdomain" | "status">[]
) {
  if (user.portfolioUrl) return user.portfolioUrl;

  const activeSubdomain = subdomains.find((subdomain) => subdomain.status === "active");
  if (!activeSubdomain) return null;

  return `https://${activeSubdomain.subdomain}.${BASE_DOMAIN}`;
}

export function formatPreference(value: string | null | undefined) {
  if (!value) return null;

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
