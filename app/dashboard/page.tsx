import { auth } from "@/auth";
import { db } from "@/db";
import { projects, subdomains, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardClient from "./client";
import ProfileEditor from "./profile-editor";
import ProjectsManager from "./projects-manager";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const sessionUser = session.user as typeof session.user & { id: string; githubUsername: string };
  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);
  const userSubdomains = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.userId, sessionUser.id));
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, sessionUser.id))
    .orderBy(desc(projects.featured), desc(projects.createdAt));
  const totalProjectClicks = userProjects.reduce(
    (sum, project) => sum + project.clickCount,
    0
  );

  if (!userRecord) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
          )}
          <span className="text-zinc-500">{sessionUser.githubUsername}</span>
          <Link href="/api/auth/signout" className="text-zinc-400 hover:text-zinc-600 transition-colors">
            Sign out
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your developer profile, projects, and subdomains in one place.
            </p>
          </div>
          <div className="grid min-w-[280px] grid-cols-3 gap-3">
            <StatCard label="Subdomains" value={`${userSubdomains.length}/5`} />
            <StatCard label="Projects" value={String(userProjects.length)} />
            <StatCard
              label="Status"
              value={userRecord.availableForWork ? "Open" : "Private"}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Profile views" value={String(userRecord.profileViews)} />
            <StatCard label="Portfolio clicks" value={String(userRecord.portfolioClicks)} />
            <StatCard label="Waiting room views" value={String(userRecord.waitingRoomViews)} />
            <StatCard label="Project clicks" value={String(totalProjectClicks)} />
          </section>

          <ProfileEditor user={userRecord} />
          <ProjectsManager initialProjects={userProjects} />

          <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Your subdomains</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {userSubdomains.length} / 5 used
                </p>
              </div>
              {userSubdomains.length < 5 ? (
                <Link
                  href="/register"
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  + Add subdomain
                </Link>
              ) : null}
            </div>

            {userSubdomains.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
                <p className="mb-4 text-zinc-400">You don&apos;t have any subdomains yet.</p>
                <Link
                  href="/register"
                  className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Claim your first subdomain
                </Link>
              </div>
            ) : (
              <DashboardClient subdomains={userSubdomains} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
