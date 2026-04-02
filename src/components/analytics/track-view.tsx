"use client";

import { useEffect, useRef } from "react";

type TrackViewProps = {
  event:
    | { type: "profile_view"; githubUsername: string }
    | { type: "waiting_room_view"; githubUsername: string };
  dedupeKey: string;
  mode?: "visible" | "immediate";
};

function postAnalyticsEvent(body: TrackViewProps["event"]) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
}

export default function TrackView({
  event,
  dedupeKey,
  mode = "visible",
}: TrackViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = `from-mm.dev:${dedupeKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const commit = () => {
      window.sessionStorage.setItem(storageKey, "1");
      postAnalyticsEvent(event);
    };

    if (mode === "immediate") {
      commit();
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        commit();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [dedupeKey, event, mode]);

  if (mode === "immediate") return null;

  return <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden />;
}
