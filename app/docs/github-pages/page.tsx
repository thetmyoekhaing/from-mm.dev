import Link from "next/link";

export default function GitHubPagesDocs() {
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
        <div className="text-4xl mb-4">🐙</div>
        <h1 className="text-3xl font-bold mb-3">GitHub Pages setup</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">
          Connect your <strong className="text-zinc-900 dark:text-zinc-100">yourname.from-mm.dev</strong> subdomain to a GitHub Pages site.
        </p>

        {/* Prerequisites */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Before you start</h2>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 list-disc list-inside">
            <li>You have a GitHub repository with a Pages-enabled branch (e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">main</code>)</li>
            <li>You have registered a subdomain on from-mm.dev (<Link href="/register" className="text-green-600 hover:underline">register now</Link>)</li>
          </ul>
        </section>

        {/* Steps */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Step-by-step guide</h2>
          <div className="flex flex-col gap-6">
            <Step number={1} title="Add a CNAME file to your repository">
              <p>In the root of your repository, create a file named <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">CNAME</code> (no extension) containing exactly your subdomain:</p>
              <pre className="mt-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm font-mono overflow-x-auto">
                yourname.from-mm.dev
              </pre>
              <p className="text-xs text-zinc-400 mt-2">Replace <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">yourname</code> with your actual subdomain.</p>
            </Step>

            <Step number={2} title="Enable GitHub Pages in your repository">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Go to your repository on GitHub</li>
                <li>Click <strong className="text-zinc-900 dark:text-zinc-100">Settings</strong> (top navigation)</li>
                <li>Scroll down to <strong className="text-zinc-900 dark:text-zinc-100">Pages</strong> in the left sidebar</li>
                <li>Under <strong className="text-zinc-900 dark:text-zinc-100">Source</strong>, select the branch you want to publish (e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">main</code>) and click <strong className="text-zinc-900 dark:text-zinc-100">Save</strong></li>
              </ol>
            </Step>

            <Step number={3} title="Set your custom domain">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Still in <strong className="text-zinc-900 dark:text-zinc-100">Settings → Pages</strong>, find the <strong className="text-zinc-900 dark:text-zinc-100">Custom domain</strong> field</li>
                <li>Enter your subdomain: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">yourname.from-mm.dev</code></li>
                <li>Click <strong className="text-zinc-900 dark:text-zinc-100">Save</strong></li>
                <li>GitHub will check the DNS records - this should pass automatically since we already created the CNAME</li>
              </ol>
            </Step>

            <Step number={4} title="Enforce HTTPS">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Once the DNS check passes, the <strong className="text-zinc-900 dark:text-zinc-100">Enforce HTTPS</strong> checkbox will become available. Check it to ensure all traffic is served securely.
              </p>
            </Step>

            <Step number={5} title="Wait for DNS propagation">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                DNS changes typically propagate within 5 minutes, but may take up to 24 hours. Your site will be live at{" "}
                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">https://yourname.from-mm.dev</code> once complete.
              </p>
            </Step>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Troubleshooting</h2>
          <div className="flex flex-col gap-5">
            <TroubleshootItem title="&quot;Domain already taken&quot; error in GitHub Pages">
              Another GitHub Pages site is using this domain. Make sure you are the only one using this subdomain. If you recently transferred a repo, wait a few minutes for the old association to clear.
            </TroubleshootItem>
            <TroubleshootItem title="Certificate still pending after 24 hours">
              Go to <strong>Settings → Pages</strong> and remove then re-add the custom domain to force GitHub to re-issue the certificate.
            </TroubleshootItem>
            <TroubleshootItem title="DNS check failing in GitHub Pages settings">
              Verify the CNAME record exists by running: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">dig CNAME yourname.from-mm.dev</code>. The answer should point to <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">yourname.github.io</code>. If not, delete and re-register your subdomain on from-mm.dev.
            </TroubleshootItem>
            <TroubleshootItem title="Site shows GitHub&apos;s 404 page">
              Make sure your repository has GitHub Pages enabled and your source branch is correct. Confirm the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">CNAME</code> file exists in your repo root.
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
