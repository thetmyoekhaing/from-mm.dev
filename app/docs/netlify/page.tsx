import Link from "next/link";
import Image from "next/image";

export default function NetlifyDocs() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          ← Docs
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-4">
          <Image src="/netlify.svg" alt="Netlify" width={40} height={40} />
        </div>
        <h1 className="text-3xl font-bold mb-3">Netlify setup</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">
          Connect your <strong className="text-zinc-900 dark:text-zinc-100">yourname.from-mm.dev</strong> subdomain to a Netlify site.
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Before you start</h2>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 list-disc list-inside">
            <li>You have a site deployed on <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Netlify</a></li>
            <li>You have registered a subdomain on from-mm.dev and selected <strong className="text-zinc-900 dark:text-zinc-100">Netlify</strong> as the target (<Link href="/register" className="text-green-600 hover:underline">register now</Link>)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Step-by-step guide</h2>
          <div className="flex flex-col gap-6">
            <Step number={1} title="Open your Netlify site">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Go to <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">app.netlify.com</a> and open the site you want to connect.
              </p>
            </Step>

            <Step number={2} title="Go to Site settings → Domain management">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                In your site, open <strong className="text-zinc-900 dark:text-zinc-100">Site settings</strong>, then find <strong className="text-zinc-900 dark:text-zinc-100">Domain management</strong>.
              </p>
            </Step>

            <Step number={3} title="Add your subdomain and copy the CNAME target">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Click <strong className="text-zinc-900 dark:text-zinc-100">Add a domain</strong> and enter Add a domain you already own and enter <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">yourname.from-mm.dev</code></li>
                <li>Netlify will show a CNAME target (often your site’s <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">something.netlify.app</code>)</li>
                <li>Paste that value into the <strong className="text-zinc-900 dark:text-zinc-100">Netlify CNAME value</strong> field on the from-mm.dev register page</li>
              </ol>
            </Step>

            <Step number={4} title="If prompted, add the TXT verification record">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                If Netlify says the domain is already registered or not owned by your account, it will ask you to verify ownership with a TXT record (often at the root).
              </p>
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Copy the TXT record details shown by Netlify</li>
                <li>Add it during registration or via <Link href="/dashboard" className="text-green-600 hover:underline">Dashboard</Link> → your subdomain → <strong>Edit</strong></li>
                <li>Wait a few minutes, then retry verification in Netlify</li>
              </ol>
            </Step>

            <Step number={5} title="HTTPS is automatic">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Once verified, Netlify provisions SSL automatically. Your site will be live at{" "}
                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">https://yourname.from-mm.dev</code>.
              </p>
            </Step>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Troubleshooting</h2>
          <div className="flex flex-col gap-5">
            <TroubleshootItem title="Netlify says DNS is incorrect">
              Verify your CNAME points to the exact value Netlify shows. You can check with{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">dig CNAME yourname.from-mm.dev</code>.
            </TroubleshootItem>
            <TroubleshootItem title="Netlify keeps asking for TXT verification">
              Add the TXT record Netlify shows (name + value) using Dashboard → your subdomain → Edit, then retry after a few minutes.
            </TroubleshootItem>
            <TroubleshootItem title="TLS/SSL pending for a long time">
              Give it up to 30 minutes. If it’s still pending, remove and re-add the domain alias in Netlify to trigger a re-check.
            </TroubleshootItem>
          </div>
        </section>

        <div className="flex gap-3">
          <Link href="/register" className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-700 transition-colors">
            Register a subdomain
          </Link>
          <Link href="/docs" className="rounded-full border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Back to docs
          </Link>
        </div>
      </main>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center text-xs font-bold mt-0.5">
        {number}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function TroubleshootItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <p className="font-medium text-sm mb-1.5">{title}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{children}</p>
    </div>
  );
}
