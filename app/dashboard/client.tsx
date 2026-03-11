"use client";

import { useState } from "react";
import Link from "next/link";
import type { Subdomain } from "@/db/schema";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "from-mm.dev";

export default function DashboardClient({ subdomains }: { subdomains: Subdomain[] }) {
  const [list, setList] = useState(subdomains);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [openInstructions, setOpenInstructions] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState("");
  const [editTxtName, setEditTxtName] = useState("");
  const [editTxtValue, setEditTxtValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  function startEdit(sub: Subdomain) {
    setOpenEdit(sub.id);
    setEditTarget(sub.target);
    setEditTxtName(sub.type === "netlify" ? (sub.netlifyTxtName ?? "") : "");
    setEditTxtValue(sub.type === "vercel" ? (sub.vercelTxtValue ?? "") : (sub.netlifyTxtValue ?? ""));
    setEditError("");
  }

  function cancelEdit() {
    setOpenEdit(null);
    setEditTarget("");
    setEditTxtName("");
    setEditTxtValue("");
    setEditError("");
  }

  async function handleSaveEdit(sub: Subdomain) {
    setSaving(true);
    setEditError("");
    try {
      const body: Record<string, string> = {};
      if (sub.type === "vercel") {
        if (editTarget && editTarget !== sub.target) body.vercelTarget = editTarget;
        if (editTxtValue && editTxtValue !== sub.vercelTxtValue) body.vercelTxtValue = editTxtValue;
      }
      if (sub.type === "netlify") {
        if (editTarget && editTarget !== sub.target) body.netlifyTarget = editTarget;
        if (editTxtName && editTxtName !== sub.netlifyTxtName) body.netlifyTxtName = editTxtName;
        if (editTxtValue && editTxtValue !== sub.netlifyTxtValue) body.netlifyTxtValue = editTxtValue;
      }
      if (Object.keys(body).length === 0) { cancelEdit(); return; }

      const res = await fetch(`/api/subdomains/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error ?? "Something went wrong.");
      } else {
        setList((prev) =>
          prev.map((s) =>
            s.id === sub.id
              ? {
                ...s,
                target: data.target ?? s.target,
                vercelTxtValue: data.vercelTxtValue ?? s.vercelTxtValue,
                netlifyTxtName: data.netlifyTxtName ?? s.netlifyTxtName,
                netlifyTxtValue: data.netlifyTxtValue ?? s.netlifyTxtValue,
              }
              : s
          )
        );
        cancelEdit();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this subdomain? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/subdomains/${id}`, { method: "DELETE" });
      if (res.ok) setList((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {list.map((sub) => {
        const url = `https://${sub.subdomain}.${BASE_DOMAIN}`;
        const docsLink =
          sub.type === "github_pages"
            ? "/docs/github-pages"
            : sub.type === "vercel"
              ? "/docs/vercel"
              : "/docs/netlify";
        const isOpen = openInstructions === sub.id;
        const isEditing = openEdit === sub.id;

        return (
          <div
            key={sub.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-green-600">{sub.subdomain}</span>
                  <span className="text-zinc-400 font-mono text-sm">.{BASE_DOMAIN}</span>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${sub.status === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900 text-red-700"
                      }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {(sub.type === "github_pages"
                    ? "GitHub Pages"
                    : sub.type === "vercel"
                      ? "Vercel"
                      : "Netlify")}{" "}
                  · → {sub.target}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy URL"
                >
                  Copy URL
                </button>
                {sub.type !== "github_pages" && (
                  <button
                    onClick={() => isEditing ? cancelEdit() : startEdit(sub)}
                    className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                )}
                <button
                  onClick={() => setOpenInstructions(isOpen ? null : sub.id)}
                  className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isOpen ? "Hide setup" : "Setup guide"}
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={deleting === sub.id}
                  className="text-xs text-red-500 border border-red-200 dark:border-red-900 rounded-full px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
                >
                  {deleting === sub.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>

            {/* Edit panel for Vercel subdomains */}
            {isEditing && (
              <div className="px-5 pb-5 pt-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="pt-4 flex flex-col gap-4">
                  <p className="text-sm font-medium">
                    {sub.type === "vercel" ? "▲ Update Vercel settings" : "🟩 Update Netlify settings"}
                  </p>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-zinc-500">CNAME value</label>
                    <input
                      type="text"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value.trim())}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
                      placeholder={sub.type === "vercel" ? "xxxxxxxxxxxxxxxx.vercel-dns-017.com" : "your-site.netlify.app"}
                    />
                  </div>
                  {sub.type === "vercel" ? (
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-zinc-500">
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">_vercel</code> TXT verification value
                      </label>
                      <input
                        type="text"
                        value={editTxtValue}
                        onChange={(e) => setEditTxtValue(e.target.value.trim())}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
                        placeholder="vc-domain-verify=your-sub.from-mm.dev,xxxxxxxxxxxxxxxx"
                      />
                      <p className="text-xs text-zinc-400 mt-1">
                        Copy from Vercel → Settings → Domains → the TXT value shown next to your domain.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-zinc-500">
                          TXT record name <span className="text-zinc-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={editTxtName}
                          onChange={(e) => setEditTxtName(e.target.value.trim())}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
                          placeholder="subdomain-owner-verification"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-zinc-500">
                          TXT verification value <span className="text-zinc-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={editTxtValue}
                          onChange={(e) => setEditTxtValue(e.target.value.trim())}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
                          placeholder="11a0ed99c4953053b7b7dab358926e7f"
                        />
                        <p className="text-xs text-zinc-400 mt-1">
                          Only needed if Netlify asks you to verify the domain with a TXT record (often at the root).
                        </p>
                      </div>
                    </div>
                  )}
                  {editError && <p className="text-sm text-red-500">{editError}</p>}
                  <button
                    onClick={() => handleSaveEdit(sub)}
                    disabled={saving}
                    className="self-start rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            )}

            {isOpen && (
              <div className="px-5 pb-5 pt-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="pt-4 flex flex-col gap-3">
                  <p className="text-sm font-medium">
                    {sub.type === "github_pages" ? "🐙 GitHub Pages setup" : sub.type === "vercel" ? "▲ Vercel setup" : "🟩 Netlify setup"}
                  </p>
                  {sub.type === "github_pages" ? (
                    <ol className="text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
                      <li>Create a file named <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">CNAME</code> in your repo root containing: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Go to repo <strong>Settings → Pages</strong> and set the custom domain field to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Check <strong>Enforce HTTPS</strong></li>
                      <li>Wait a few minutes for DNS to propagate</li>
                    </ol>
                  ) : sub.type === "vercel" ? (
                    <ol className="text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
                      <li>Go to your Vercel project <strong>Settings → Domains</strong></li>
                      <li>Click <strong>Add</strong> and enter <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Vercel shows a CNAME value — that value is already set in your DNS</li>
                      <li>If verification is required, click <strong>Edit</strong> above and paste the TXT value provided by Vercel</li>
                      <li>HTTPS is automatic once Vercel verifies (usually &lt;5 min)</li>
                    </ol>
                  ) : (
                    <ol className="text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
                      <li>Go to Netlify → your site → <strong>Site settings → Domain management</strong></li>
                      <li>Click <strong>Add domain alias</strong> and enter <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Netlify shows a CNAME target — that value is already set in your DNS</li>
                      <li>If Netlify asks for domain verification, click <strong>Edit</strong> above and add the TXT value it provides</li>
                      <li>HTTPS is automatic once verified (usually a few minutes)</li>
                    </ol>
                  )}
                  <Link href={docsLink} className="text-sm text-green-600 hover:underline mt-1">
                    Full setup guide →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
