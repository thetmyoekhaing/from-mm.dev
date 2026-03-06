"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const examples = [
  { subdomain: "aungmoe", type: "GitHub Pages" },
  { subdomain: "khanthu", type: "Vercel" },
  { subdomain: "zawlinn", type: "GitHub Pages" },
  { subdomain: "thiha", type: "Vercel" },
];

const steps = [
  {
    number: "01",
    title: "Sign in with GitHub",
    description: "Login with GitHub to get started.",
  },
  {
    number: "02",
    title: "Claim your subdomain",
    description: "Choose your from-mm.dev name.",
  },
  {
    number: "03",
    title: "Point & publish",
    description: "Connect it to GitHub Pages or Vercel.",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </span>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/docs"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Docs
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-1.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-1.5 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              Get started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-1.5 text-sm text-green-700 dark:text-green-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          🇲🇲 Built for Myanmar developers
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Subdomains for <span className="text-green-600">Myanmar devs </span>
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
          Get a free{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            yourname.from-mm.dev
          </strong>{" "}
          subdomain for your GitHub Pages or Vercel projects.
        </p>

        {/* Subdomain preview */}
        <div className="inline-flex items-center gap-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-3 text-lg font-mono mb-10 shadow-sm">
          <span className="text-green-600 font-bold">yourname</span>
          <span className="text-zinc-400">.from-mm.dev</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-8 py-3 font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Claim your subdomain — it&apos;s free
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-8 py-3 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Read the docs
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-3">
              <span className="text-4xl font-black text-zinc-100 dark:text-zinc-800 select-none">
                {step.number}
              </span>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Live examples</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {examples.map((ex) => (
            <div
              key={ex.subdomain}
              className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-4"
            >
              <span className="font-mono text-sm">
                <span className="text-green-600 font-semibold">
                  {ex.subdomain}
                </span>
                <span className="text-zinc-400">.from-mm.dev</span>
              </span>
              <span className="text-xs rounded-full bg-zinc-200 dark:bg-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300">
                {ex.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to get your .dev domain?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Join Myanmar developers already using from-mm.dev.
        </p>
        <Link
          href="/register"
          className="rounded-full bg-green-600 text-white px-10 py-3 font-semibold hover:bg-green-700 transition-colors"
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-8 text-center text-sm text-zinc-400">
        <p>
          from-mm.dev · Free subdomains for Myanmar developers ·{" "}
          <Link href="/docs" className="hover:text-zinc-600 transition-colors">
            Docs
          </Link>
        </p>
        <p className="mt-2">
          Created by{" "}
          <a
            href="https://github.com/thetmyoekhaing"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-600 transition-colors font-medium"
          >
            tomari
          </a>
        </p>
      </footer>
    </div>
  );
}
