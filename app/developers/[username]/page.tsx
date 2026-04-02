import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, subdomains, users } from "@/db/schema";
import TrackView from "@/components/analytics/track-view";
import TrackedExternalLink from "@/components/analytics/tracked-external-link";
import {
  formatPreference,
  getDeveloperProfilePath,
  getPrimaryPortfolioUrl,
} from "@/lib/developers";

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [developer] = await db
    .select()
    .from(users)
    .where(eq(users.githubUsername, username))
    .limit(1);

  if (!developer) notFound();

  const developerProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, developer.id))
    .orderBy(desc(projects.featured), desc(projects.createdAt));
  const developerSubdomains = await db
    .select()
    .from(subdomains)
    .where(and(eq(subdomains.userId, developer.id), eq(subdomains.status, "active")))
    .orderBy(desc(subdomains.createdAt));

  const primaryPortfolioUrl = getPrimaryPortfolioUrl(developer, developerSubdomains);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <TrackView
        event={{ type: "profile_view", githubUsername: developer.githubUsername }}
        dedupeKey={`profile-view:${developer.githubUsername}`}
        mode="immediate"
      />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/waiting-room"
            className="text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Waiting room
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-200 px-4 py-1.5 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <section className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              {developer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={developer.avatarUrl}
                  alt=""
                  className="h-20 w-20 rounded-3xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-2xl font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                  {developer.githubUsername.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {developer.name || developer.githubUsername}
                  </h1>
                  {developer.availableForWork ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                      Available for work
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  @{developer.githubUsername}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                  {developer.bio || "This developer has not added a public bio yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryPortfolioUrl ? (
                <TrackedExternalLink
                  href={primaryPortfolioUrl}
                  event={{
                    type: "portfolio_click",
                    githubUsername: developer.githubUsername,
                  }}
                  className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Visit portfolio
                </TrackedExternalLink>
              ) : null}
              {developer.linkedinUrl ? (
                <a
                  href={developer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-950"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            {developer.location ? <span>{developer.location}</span> : null}
            {developer.workPreference ? (
              <span>{formatPreference(developer.workPreference)}</span>
            ) : null}
            {developer.employmentPreference ? (
              <span>{formatPreference(developer.employmentPreference)}</span>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
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
              <span className="text-sm text-zinc-400">No skill tags yet</span>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Link
                href={getDeveloperProfilePath(developer.githubUsername)}
                className="text-sm text-zinc-400"
              >
                Public profile
              </Link>
            </div>

            <div className="grid gap-4">
              {developerProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-10 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  No public projects yet.
                </div>
              ) : (
                developerProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {project.featured ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {project.description}
                    </p>
                    {project.techStack.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {project.repoUrl ? (
                        <TrackedExternalLink
                          href={project.repoUrl}
                          event={{ type: "project_click", projectId: project.id }}
                          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                          Source code
                        </TrackedExternalLink>
                      ) : null}
                      {project.liveUrl ? (
                        <TrackedExternalLink
                          href={project.liveUrl}
                          event={{ type: "project_click", projectId: project.id }}
                          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                          Live demo
                        </TrackedExternalLink>
                      ) : null}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="grid gap-6">
            <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">Subdomains</h2>
              <div className="mt-5 grid gap-3">
                {developerSubdomains.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No active subdomains yet.
                  </p>
                ) : (
                  developerSubdomains.map((subdomain) => {
                    const href = `https://${subdomain.subdomain}.from-mm.dev`;
                    return (
                      <TrackedExternalLink
                        key={subdomain.id}
                        href={href}
                        event={{
                          type: "portfolio_click",
                          githubUsername: developer.githubUsername,
                        }}
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-mono text-green-600 transition-colors hover:border-green-300 dark:border-zinc-700 dark:bg-zinc-950"
                      >
                        {subdomain.subdomain}.from-mm.dev
                      </TrackedExternalLink>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">Profile links</h2>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                {primaryPortfolioUrl ? (
                  <TrackedExternalLink
                    href={primaryPortfolioUrl}
                    event={{
                      type: "portfolio_click",
                      githubUsername: developer.githubUsername,
                    }}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-green-300 dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    Portfolio
                  </TrackedExternalLink>
                ) : null}
                <a
                  href={`https://github.com/${developer.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-green-300 dark:border-zinc-700 dark:bg-zinc-950"
                >
                  GitHub
                </a>
                {developer.linkedinUrl ? (
                  <a
                    href={developer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-green-300 dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
