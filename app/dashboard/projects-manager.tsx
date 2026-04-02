"use client";

import { useState } from "react";
import type { Project } from "@/db/schema";

type ProjectsManagerProps = {
  initialProjects: Project[];
};

type ProjectFormState = {
  title: string;
  description: string;
  techStack: string;
  repoUrl: string;
  liveUrl: string;
  featured: boolean;
};

const emptyForm: ProjectFormState = {
  title: "",
  description: "",
  techStack: "",
  repoUrl: "",
  liveUrl: "",
  featured: false,
};

function toFormState(project: Project): ProjectFormState {
  return {
    title: project.title,
    description: project.description,
    techStack: project.techStack.join(", "),
    repoUrl: project.repoUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    featured: project.featured,
  };
}

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function update<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      techStack: form.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      repoUrl: form.repoUrl,
      liveUrl: form.liveUrl,
      featured: form.featured,
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save project.");
        return;
      }

      if (editingId) {
        setProjects((current) =>
          current.map((project) => (project.id === editingId ? data.project : project))
        );
      } else {
        setProjects((current) => [data.project, ...current]);
      }

      resetForm();
    } catch {
      setError("Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(projectId: string) {
    if (!confirm("Delete this project?")) return;

    setDeletingId(projectId);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to delete project.");
        return;
      }

      setProjects((current) => current.filter((project) => project.id !== projectId));

      if (editingId === projectId) {
        resetForm();
      }
    } catch {
      setError("Unable to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Featured projects</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add the projects you want to show on your public profile.
          </p>
        </div>
        {editingId ? (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-950"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project title">
            <input
              type="text"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="from-mm.dev"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </Field>

          <Field label="Tech stack" hint="Comma-separated">
            <input
              type="text"
              value={form.techStack}
              onChange={(event) => update("techStack", event.target.value)}
              placeholder="Next.js, TypeScript, Postgres"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={3}
            placeholder="A lightweight platform for Myanmar developers to claim subdomains and get discovered."
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
            required
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Repository URL">
            <input
              type="url"
              value={form.repoUrl}
              onChange={(event) => update("repoUrl", event.target.value)}
              placeholder="https://github.com/your/repo"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>

          <Field label="Live URL">
            <input
              type="url"
              value={form.liveUrl}
              onChange={(event) => update("liveUrl", event.target.value)}
              placeholder="https://yourname.from-mm.dev"
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500"
          />
          Mark as featured
        </label>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update project" : "Add project"}
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No projects yet. Add at least one project so your public profile is not empty.
          </div>
        ) : (
          projects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.featured ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {project.description}
                  </p>
                  {project.techStack.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(project.id);
                      setForm(toFormState(project));
                      setError("");
                    }}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
                  >
                    {deletingId === project.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
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
