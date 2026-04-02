"use client";

type AnalyticsEvent =
  | { type: "portfolio_click"; githubUsername: string }
  | { type: "waiting_room_click"; githubUsername: string }
  | { type: "project_click"; projectId: string };

type TrackedExternalLinkProps = {
  href: string;
  event: AnalyticsEvent;
  className: string;
  children: React.ReactNode;
};

function postAnalyticsEvent(body: AnalyticsEvent) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
}

export default function TrackedExternalLink({
  href,
  event,
  className,
  children,
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => postAnalyticsEvent(event)}
    >
      {children}
    </a>
  );
}
