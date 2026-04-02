import Link from "next/link";

export default function VercelDocs() {
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
        <div className="text-4xl mb-4">▲</div>
        <h1 className="text-3xl font-bold mb-3">Vercel setup</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">
          Connect your <strong className="text-zinc-900 dark:text-zinc-100">yourname.from-mm.dev</strong> subdomain to a Vercel project.
        </p>

        {/* Prerequisites */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Before you start</h2>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 list-disc list-inside">
            <li>You have a project deployed on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Vercel</a></li>
            <li>You have registered a subdomain on from-mm.dev and selected <strong className="text-zinc-900 dark:text-zinc-100">Vercel</strong> as the target (<Link href="/register" className="text-green-600 hover:underline">register now</Link>)</li>
          </ul>
        </section>

        {/* Steps */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Step-by-step guide</h2>
          <div className="flex flex-col gap-6">
            <Step number={1} title="Open your Vercel project">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">vercel.com/dashboard</a> and click on the project you want to connect.
              </p>
            </Step>

            <Step number={2} title="Go to Settings → Domains">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Click the <strong className="text-zinc-900 dark:text-zinc-100">Settings</strong> tab at the top of your project</li>
                <li>Click <strong className="text-zinc-900 dark:text-zinc-100">Domains</strong> in the left sidebar</li>
              </ol>
            </Step>

            <Step number={3} title="Copy your Vercel CNAME value">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Click <strong className="text-zinc-900 dark:text-zinc-100">Add</strong> and enter your subdomain: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">yourname.from-mm.dev</code></li>
                <li>Vercel will show you a CNAME record to add - copy the <strong className="text-zinc-900 dark:text-zinc-100">Value</strong> (looks like <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">xxxxxxxxxxxxxxxx.vercel-dns-017.com</code>)</li>
                <li>Paste that value into the <strong className="text-zinc-900 dark:text-zinc-100">Vercel CNAME value</strong> field on the from-mm.dev register page</li>
              </ol>
              <div className="mt-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono">
                <span className="text-zinc-400">CNAME</span>{" "}
                <span className="text-green-600">yourname.from-mm.dev</span>{" "}
                <span className="text-zinc-400">→</span>{" "}
                <span className="text-zinc-900 dark:text-zinc-100">xxxxxxxxxxxxxxxx.vercel-dns-017.com</span>
              </div>
            </Step>



            <Step number={4} title="Verify Domain Ownership">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                If your domain was previously used on a different Vercel account, you may need to verify ownership.
              </p>
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Vercel will prompt you with a TXT record for <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">_vercel</code>.</li>
                <li>Copy the provided TXT record value (e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">vc-domain-...</code>).</li>
                <li>Add it during registration or by clicking <strong>Edit</strong> on your subdomain in the <Link href="/dashboard" className="text-green-600 hover:underline">dashboard</Link>.</li>
                <li>Once saved, click <strong>Refresh</strong> in Vercel.</li>
              </ol>
            </Step>

            <Step number={5} title="HTTPS is automatic">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Once verified, Vercel automatically provisions an SSL certificate. Your project will be live at{" "}
                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">https://yourname.from-mm.dev</code>.
              </p>
            </Step>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Troubleshooting</h2>
          <div className="flex flex-col gap-5">

            <TroubleshootItem title="Domain stuck on &quot;Pending&quot; in Vercel">
              DNS propagation can take up to 24 hours. You can force a re-check by removing the domain and re-adding it in Vercel Settings → Domains. Make sure the CNAME value you entered on from-mm.dev matches exactly what Vercel shows (e.g. <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">xxxxxxxxxxxxxxxx.vercel-dns-017.com</code>). Verify with: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">dig CNAME yourname.from-mm.dev</code>.
            </TroubleshootItem>
            <TroubleshootItem title="&quot;Domain already in use&quot; error in Vercel">
              The domain is already assigned to another Vercel project. Go to that project&apos;s Settings → Domains and remove it first.
            </TroubleshootItem>
            <TroubleshootItem title="Certificate not provisioned after verification">
              Wait up to 10 minutes. If still missing, go to Vercel Settings → Domains, click the three-dot menu next to the domain, and select <strong>Refresh</strong>.
            </TroubleshootItem>
            <TroubleshootItem title="Wrong project is being served">
              In Vercel, each domain can only be linked to one project. Make sure you removed the domain from any previous project before adding it to the new one.
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
