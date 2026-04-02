import Link from "next/link";
import { db } from "@/db";
import { users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { formatPreference, getDeveloperProfilePath } from "@/lib/developers";

type SearchParams = Promise<{
  q?: string;
  skill?: string;
  location?: string;
  work?: string;
}>;

export default async function WaitingRoomPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const allDevelopers = await db
    .select()
    .from(users)
    .where(eq(users.availableForWork, true))
    .orderBy(asc(users.githubUsername));

  const query = params.q?.trim().toLowerCase() ?? "";
  const skill = params.skill?.trim().toLowerCase() ?? "";
  const location = params.location?.trim().toLowerCase() ?? "";
  const work = params.work?.trim().toLowerCase() ?? "";

  const filteredDevelopers = allDevelopers.filter((developer) => {
    const matchesQuery =
      !query ||
      [
        developer.githubUsername,
        developer.name ?? "",
        developer.bio ?? "",
        developer.location ?? "",
        ...(developer.skillTags ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesSkill =
      !skill || developer.skillTags.some((item) => item.toLowerCase() === skill);
    const matchesLocation =
      !location || developer.location?.toLowerCase() === location;
    const matchesWork =
      !work || developer.workPreference?.toLowerCase() === work;

    return matchesQuery && matchesSkill && matchesLocation && matchesWork;
  });

  const skillOptions = Array.from(
    new Set(allDevelopers.flatMap((developer) => developer.skillTags))
  ).sort((left, right) => left.localeCompare(right));
  const locationOptions = Array.from(
    new Set(
      allDevelopers
        .map((developer) => developer.location)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((left, right) => left.localeCompare(right));
  const workOptions = Array.from(
    new Set(
      allDevelopers
        .map((developer) => developer.workPreference)
        .filter((value): value is string => Boolean(value))
    )
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/docs"
            className="text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-200 px-4 py-1.5 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="mb-10 rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-white via-green-50 to-orange-50 p-8 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-green-600">
            Myanmar Developer Waiting Room
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Myanmar developers who are open to new work.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            Browse public profiles, filter by skills and location, and jump straight
            to a developer&apos;s profile or portfolio.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full bg-white/80 px-4 py-2 dark:bg-zinc-900">
              {filteredDevelopers.length} developers shown
            </div>
            <div className="rounded-full bg-white/80 px-4 py-2 dark:bg-zinc-900">
              {skillOptions.length} tracked skills
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <form className="grid gap-4 md:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Search</span>
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="React, Yangon, frontend..."
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Skill</span>
              <select
                name="skill"
                defaultValue={params.skill ?? ""}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="">All skills</option>
                {skillOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Location</span>
              <select
                name="location"
                defaultValue={params.location ?? ""}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="">All locations</option>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Work style</span>
              <select
                name="work"
                defaultValue={params.work ?? ""}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="">All work styles</option>
                {workOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatPreference(option)}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end gap-3 md:col-span-4">
              <button
                type="submit"
                className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Apply filters
              </button>
              <Link
                href="/waiting-room"
                className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-950"
              >
                Reset
              </Link>
            </div>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDevelopers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 px-6 py-16 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 md:col-span-2 xl:col-span-3">
              No developers matched your filters yet.
            </div>
          ) : (
            filteredDevelopers.map((developer) => (
              <article
                key={developer.id}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
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

                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href={getDeveloperProfilePath(developer.githubUsername)}
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
                    >
                      Portfolio
                    </a>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
