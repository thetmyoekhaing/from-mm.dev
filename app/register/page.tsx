"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type DeployType = "github_pages" | "vercel" | "netlify";

export default function RegisterPage() {
  const { data: session } = useSession();
  const githubUsername =
    (session?.user as ({ githubUsername?: string }) | undefined)?.githubUsername ?? "";

  const [subdomain, setSubdomain] = useState("");
  const [type, setType] = useState<DeployType>("github_pages");
  const [customTarget, setCustomTarget] = useState("");
  const [vercelTxtValue, setVercelTxtValue] = useState("");
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ url: string; type: DeployType; target: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!githubUsername || subdomain) return;
    // Only pre-fill if the username subdomain isn't already taken
    fetch(`/api/subdomains?check=${encodeURIComponent(githubUsername)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.available) setSubdomain(githubUsername);
      })
      .catch(() => { });
  }, [githubUsername, subdomain]);

  const checkAvailability = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    try {
      const res = await fetch(`/api/subdomains?check=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.error) {
        setAvailability("invalid");
        setAvailabilityMsg(data.error);
      } else if (data.available) {
        setAvailability("available");
        setAvailabilityMsg("Available!");
      } else {
        setAvailability("taken");
        setAvailabilityMsg("Already taken.");
      }
    } catch {
      setAvailability("idle");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkAvailability(subdomain), 400);
    return () => clearTimeout(timer);
  }, [subdomain, checkAvailability]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/subdomains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          type,
          customTarget: type === "github_pages" ? undefined : customTarget,
          vercelTxtValue:
            type !== "github_pages" && vercelTxtValue ? vercelTxtValue : undefined,
        }),
      });
      const raw = await res.text();
      let data: Record<string, unknown> = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          data = { error: raw };
        }
      }
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
      } else {
        setSuccess({
          url: String(data.url),
          type: data.type as DeployType,
          target: String(data.target),
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const docsLink =
      success.type === "github_pages"
        ? "/docs/github-pages"
        : success.type === "vercel"
          ? "/docs/vercel"
          : "/docs/netlify";
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6 text-3xl">
            🎉
          </div>
          <h1 className="text-2xl font-bold mb-3">You&apos;re all set!</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Your subdomain is registered. DNS may take up to a few minutes to propagate.
          </p>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-4 mb-8 font-mono text-sm break-all">
            <p className="text-green-600 font-bold text-lg">{success.url}</p>
            <p className="text-zinc-400 mt-1">→ {success.target}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={docsLink}
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-2.5 font-medium hover:bg-zinc-700 transition-colors text-sm"
            >
              View setup guide →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-2.5 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = {
    idle: "text-zinc-400",
    checking: "text-zinc-400",
    available: "text-green-600",
    taken: "text-red-500",
    invalid: "text-red-500",
  }[availability];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-8 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mb-2">Claim your subdomain</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
          You can have up to 5 subdomains.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Subdomain input */}
          <div>
            <label className="block text-sm font-medium mb-2">Subdomain</label>
            <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-400">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                placeholder="yourname"
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-mono"
                required
              />
              <span className="px-4 py-3 text-sm text-zinc-400 font-mono border-l border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                .from-mm.dev
              </span>
            </div>
            {availability !== "idle" && (
              <p className={`text-xs mt-1.5 ${statusColor}`}>
                {availability === "checking" ? "Checking…" : availabilityMsg}
              </p>
            )}
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Deploy target</label>
            <div className="grid grid-cols-3 gap-3">
              {(["github_pages", "vercel", "netlify"] as DeployType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors text-left ${type === t
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    }`}
                >
                  {t === "github_pages"
                    ? "🐙 GitHub Pages"
                    : t === "vercel"
                      ? "▲ Vercel"
                      : "🌐 Netlify"}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {type === "github_pages"
                ? `Points to: ${githubUsername || "your-username"}.github.io`
                : customTarget
                  ? `Points to: ${customTarget}`
                  : type === "vercel"
                    ? "Enter your Vercel CNAME value below"
                    : ""}
            </p>
          </div>

          {/* Custom target input */}
          {type == "vercel" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "vercel" ? "Vercel CNAME value" : "Netlify target"}
              </label>
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value.trim())}
                placeholder={
                  type === "vercel"
                    ? "xxxxxxxxxxxxxxxx.vercel-dns-017.com"
                    : "your-site.netlify.app"
                }
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
                required
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                {type === "vercel" ? (
                  <>
                    Find this in your Vercel project →{" "}
                    <strong className="text-zinc-600 dark:text-zinc-300">Settings → Domains</strong> → add your subdomain → copy the CNAME value shown.
                  </>
                ) : (
                  <>
                    Find this in your Netlify site →{" "}
                    <strong className="text-zinc-600 dark:text-zinc-300">Site configuration → Domain management</strong> → add your subdomain → copy the hostname Netlify shows.
                  </>
                )}
              </p>
            </div>
          )}



          {/* TXT verification input */}
          {(type === "vercel" || type === "netlify") && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "vercel" ? "Vercel TXT verification value" : "Netlify TXT verification value"}{" "}
              </label>
              <input
                type="text"
                value={vercelTxtValue}
                onChange={(e) => setVercelTxtValue(e.target.value.trim())}
                placeholder={
                  type === "vercel"
                    ? "vc-domain-verify=your-sub.from-mm.dev,xxxxxxxxxxxxxxxx"
                    : "the verification value Netlify shows"
                }
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                {type === "vercel"
                  ? <>For project verification, copy the <strong className="text-zinc-600 dark:text-zinc-300">TXT value</strong> from Vercel for <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">_vercel</code>.</>
                  : <>If Netlify requires verification, paste the TXT value here. from-mm.dev will create the TXT record using the fixed name <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">subdomain-owner-verification</code>.</>}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={
              submitting ||
              availability === "taken" ||
              availability === "invalid" ||
              availability === "checking" ||
              (type !== "github_pages" && !customTarget)
            }
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-3 font-semibold disabled:opacity-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            {submitting ? "Registering…" : "Register subdomain"}
          </button>
        </form>
      </div>
    </div>
  );
}
