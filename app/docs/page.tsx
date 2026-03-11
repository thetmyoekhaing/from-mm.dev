import Link from "next/link";

export default function DocsIndex() {
  const guides = [
    {
      href: "/docs/github-pages",
      icon: "🐙",
      title: "GitHub Pages",
      description: "Point your subdomain to a GitHub Pages site. Free hosting directly from your repo.",
    },
    {
      href: "/docs/vercel",
      icon: "▲",
      title: "Vercel",
      description: "Connect your subdomain to a Vercel deployment. Zero-config HTTPS.",
    },
    {
      href: "/docs/netlify",
      icon: "🟩",
      title: "Netlify",
      description: "Connect your subdomain to a Netlify site. Automatic HTTPS after verification.",
    },
  ];

  const faqs = [
    {
      q: "How long does DNS propagation take?",
      a: "Usually under 5 minutes, but can take up to 24 hours in rare cases. If your site isn't loading after 30 minutes, double-check your setup guide steps.",
    },
    {
      q: "How many subdomains can I have?",
      a: "Up to 5 subdomains per GitHub account.",
    },
    {
      q: "Can I use the same subdomain for multiple projects?",
      a: "No — each subdomain maps to a single target. You can delete and re-register a subdomain if you need to change the target.",
    },
    {
      q: "What is the subdomain format?",
      a: "3–63 lowercase characters: letters, numbers, and hyphens only. No leading or trailing hyphens.",
    },
    {
      q: "What happens if my subdomain is reported for abuse?",
      a: "We review all reports manually. If the subdomain is found to violate our terms, it will be suspended and the DNS record removed.",
    },
    {
      q: "How do I delete a subdomain?",
      a: "Go to your Dashboard, find the subdomain, and click Delete. The DNS record is removed immediately.",
    },
    {
      q: "Is this really free?",
      a: "Yes, completely free for Myanmar developers. No ads, no catches.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <Link href="/register" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Get started
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-12">
          Everything you need to connect your subdomain to your project.
        </p>

        {/* Guides */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-5">Setup guides</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
              >
                <div className="text-2xl mb-3">{guide.icon}</div>
                <h3 className="font-semibold mb-1 group-hover:text-green-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{guide.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-semibold mb-5">FAQ</h2>
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <p className="font-medium mb-2">{faq.q}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
