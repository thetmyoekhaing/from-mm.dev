"use client";

import { useState } from "react";
import type { User } from "@/db/schema";

type ProfilePayload = {
  name: string;
  bio: string;
  skillTags: string[];
  location: string;
  workPreference: string;
  employmentPreference: string;
  portfolioUrl: string;
  linkedinUrl: string;
  availableForWork: boolean;
};

type ProfileEditorProps = {
  user: User;
};

function toPayload(user: User): ProfilePayload {
  return {
    name: user.name ?? "",
    bio: user.bio ?? "",
    skillTags: user.skillTags ?? [],
    location: user.location ?? "",
    workPreference: user.workPreference ?? "",
    employmentPreference: user.employmentPreference ?? "",
    portfolioUrl: user.portfolioUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    availableForWork: user.availableForWork,
  };
}

export default function ProfileEditor({ user }: ProfileEditorProps) {
  const [form, setForm] = useState<ProfilePayload>(() => toPayload(user));
  const [skillsInput, setSkillsInput] = useState((user.skillTags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update<K extends keyof ProfilePayload>(key: K, value: ProfilePayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      skillTags: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save your profile.");
        return;
      }

      setForm(payload);
      setSkillsInput(payload.skillTags.join(", "));
      setSuccess("Profile updated.");
    } catch {
      setError("Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Developer profile</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          This powers your public profile and waiting room presence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Display name">
            <input
              type="text"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              placeholder="Yangon, Myanmar"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>
        </div>

        <Field label="One-line bio" hint={`${form.bio.length}/160`}>
          <textarea
            value={form.bio}
            onChange={(event) => update("bio", event.target.value.slice(0, 160))}
            rows={3}
            placeholder="Frontend engineer building clean developer tools."
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </Field>

        <Field label="Skill tags" hint="Comma-separated">
          <input
            type="text"
            value={skillsInput}
            onChange={(event) => setSkillsInput(event.target.value)}
            placeholder="React, TypeScript, Node.js"
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Work preference">
            <select
              value={form.workPreference}
              onChange={(event) => update("workPreference", event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select one</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </Field>

          <Field label="Employment preference">
            <select
              value={form.employmentPreference}
              onChange={(event) => update("employmentPreference", event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select one</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Portfolio URL">
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={(event) => update("portfolioUrl", event.target.value)}
              placeholder="https://yourname.from-mm.dev"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(event) => update("linkedinUrl", event.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Available for work</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              If enabled, you can appear in the public waiting room.
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.availableForWork}
            onChange={(event) => update("availableForWork", event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-500"
          />
        </label>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            GitHub profile: @{user.githubUsername}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        {hint ? <span className="text-xs text-zinc-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}
