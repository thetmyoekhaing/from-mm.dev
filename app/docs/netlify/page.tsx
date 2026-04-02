import Link from "next/link";

export default function NetlifyDocs() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <Link
          href="/docs"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← Docs
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-4xl mb-4">🌐</div>
        <h1 className="text-3xl font-bold mb-3">Netlify setup</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          Connect your{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            yourname.from-mm.dev
          </strong>{" "}
          subdomain to a Netlify site.
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Before you start</h2>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 list-disc list-inside">
            <li>
              You have a site deployed on{" "}
              <a
                href="https://app.netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Netlify
              </a>
            </li>
            <li>
              You have a subdomain reserved on from-mm.dev and selected{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">Netlify</strong> as the target{" "}
              (<Link href="/register" className="text-green-600 hover:underline">register now</Link>)
            </li>
            <li>
              You can open your Netlify site&apos;s{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                Domain management
              </strong>{" "}
              settings
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Step-by-step guide</h2>
          <div className="flex flex-col gap-6">
            <Step number={1} title="Open your Netlify site">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Go to{" "}
                <a
                  href="https://app.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  app.netlify.com
                </a>{" "}
                and open the site you want to connect.
              </p>
            </Step>

            <Step number={2} title="Go to Domain management">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>Open your site dashboard on Netlify</li>
                <li>
                  Click <strong className="text-zinc-900 dark:text-zinc-100">Site configuration</strong>
                </li>
                <li>
                  Open <strong className="text-zinc-900 dark:text-zinc-100">Domain management</strong>
                </li>
              </ol>
            </Step>

            <Step number={3} title="Add your from-mm.dev subdomain">
              <ol className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5 list-decimal list-inside">
                <li>
                  Click <strong className="text-zinc-900 dark:text-zinc-100">Add a domain</strong>
                </li>
                <li>
                  Enter your subdomain, for example{" "}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">
                    yourname.from-mm.dev
                  </code>
                </li>
                <li>Continue until Netlify shows the DNS records it expects</li>
              </ol>
            </Step>

            <Step number={4} title="Copy the DNS target Netlify gives you">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Netlify will usually provide a target hostname for your custom
                domain. That is the value from-mm.dev needs to point at.
              </p>
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm font-mono">
                <span className="text-zinc-400">CNAME</span>{" "}
                <span className="text-green-600">yourname.from-mm.dev</span>{" "}
                <span className="text-zinc-400">→</span>{" "}
                <span className="text-zinc-900 dark:text-zinc-100">
                  your-site.netlify.app
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                The exact target may differ depending on your Netlify site setup.
              </p>
            </Step>

            <Step number={5} title="Paste the target into from-mm.dev">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                During registration on from-mm.dev, select{" "}
                <strong className="text-zinc-900 dark:text-zinc-100">Netlify</strong>{" "}
                and paste the target hostname Netlify gives you. from-mm.dev will
                create the CNAME record for you.
              </p>
            </Step>

            <Step number={6} title="Add the Netlify TXT verification value if requested">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If Netlify asks for TXT verification, copy the TXT value it shows
                and paste it into from-mm.dev. from-mm.dev will create the TXT
                record using the fixed name{" "}
                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-sm">
                  subdomain-owner-verification
                </code>.
              </p>
            </Step>

            <Step number={7} title="Verify HTTPS">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                After DNS resolves correctly, Netlify should provision HTTPS for
                your subdomain automatically. If the certificate is still pending,
                wait a few minutes and refresh the domain settings page.
              </p>
            </Step>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-5">Troubleshooting</h2>
          <div className="flex flex-col gap-5">
            <TroubleshootItem title="Netlify says the custom domain is not using the expected DNS">
              Double-check the hostname Netlify shows for your custom domain. The
              final CNAME target must match Netlify exactly.
            </TroubleshootItem>
            <TroubleshootItem title="HTTPS certificate is still pending">
              Wait up to 10 minutes after the DNS record starts resolving. Then
              refresh the custom domain page in Netlify.
            </TroubleshootItem>
            <TroubleshootItem title="The site shows a Netlify 404 page">
              Make sure the custom domain is attached to the correct Netlify site
              and not another site in the same Netlify account.
            </TroubleshootItem>
            <TroubleshootItem title="The domain is already assigned somewhere else">
              Remove the custom domain from the old Netlify site first, then add
              it again on the correct site.
            </TroubleshootItem>
            <TroubleshootItem title="Netlify asks for a TXT record">
              Paste only the TXT value into from-mm.dev. The TXT record name is
              fixed to <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded font-mono text-xs">subdomain-owner-verification</code>.
            </TroubleshootItem>
          </div>
        </section>

        <div className="flex gap-3">
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Register a subdomain
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Back to docs
          </Link>
        </div>
      </main>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
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

function TroubleshootItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <p className="font-medium text-sm mb-1.5">{title}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
