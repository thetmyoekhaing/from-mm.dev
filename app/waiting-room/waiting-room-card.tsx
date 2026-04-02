"use client";

import Link from "next/link";
import TrackView from "@/components/analytics/track-view";
import { formatPreference, getDeveloperProfilePath } from "@/lib/developers";

type WaitingRoomCardProps = {
  developer: {
    id: string;
    githubUsername: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    skillTags: string[];
    location: string | null;
    workPreference: string | null;
    employmentPreference: string | null;
    portfolioUrl: string | null;
    waitingRoomViews: number;
    waitingRoomClicks: number;
  };
};

function postWaitingRoomClick(githubUsername: string) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "waiting_room_click",
      githubUsername,
    }),
    keepalive: true,
  });
}

function postPortfolioClick(githubUsername: string) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "portfolio_click",
      githubUsername,
    }),
    keepalive: true,
  });
}

export default function WaitingRoomCard({ developer }: WaitingRoomCardProps) {
  return (
    <article className="relative rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <TrackView
        event={{ type: "waiting_room_view", githubUsername: developer.githubUsername }}
        dedupeKey={`waiting-room-view:${developer.githubUsername}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {developer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={developer.avatarUrl}
              alt=""
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-lg font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
              {developer.githubUsername.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {developer.name || developer.githubUsername}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              @{developer.githubUsername}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          Open
        </span>
      </div>

      <p className="mt-5 min-h-12 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {developer.bio || "No bio added yet."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {developer.skillTags.length > 0 ? (
          developer.skillTags.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-zinc-400">No skills yet</span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        {developer.location ? <span>{developer.location}</span> : null}
        {developer.workPreference ? (
          <span>{formatPreference(developer.workPreference)}</span>
        ) : null}
        {developer.employmentPreference ? (
          <span>{formatPreference(developer.employmentPreference)}</span>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-4 text-xs text-zinc-400">
        <span>{developer.waitingRoomViews} views</span>
        <span>{developer.waitingRoomClicks} clicks</span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href={getDeveloperProfilePath(developer.githubUsername)}
          onClick={() => postWaitingRoomClick(developer.githubUsername)}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          View profile
        </Link>
        {developer.portfolioUrl ? (
          <a
            href={developer.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-950"
            onClick={() => {
              postWaitingRoomClick(developer.githubUsername);
              postPortfolioClick(developer.githubUsername);
            }}
          >
            Portfolio
          </a>
        ) : null}
      </div>
    </article>
  );
}
