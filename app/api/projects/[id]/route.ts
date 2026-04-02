import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";

const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(500),
  techStack: z.array(z.string().trim().min(1).max(32)).max(12).default([]),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(false),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const sessionUser = session.user as typeof session.user & { id: string };
  const { id } = await params;
  const [existingProject] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, sessionUser.id)))
    .limit(1);

  if (!existingProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const data = parsed.data;
  const updates = {
    title: data.title,
    description: data.description,
    techStack: [...new Set(data.techStack.map((item) => item.trim()).filter(Boolean))],
    repoUrl: data.repoUrl || null,
    liveUrl: data.liveUrl || null,
    featured: data.featured,
    updatedAt: new Date(),
  };

  await db
    .update(projects)
    .set(updates)
    .where(and(eq(projects.id, id), eq(projects.userId, sessionUser.id)));

  return NextResponse.json({ project: { ...existingProject, ...updates } });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = session.user as typeof session.user & { id: string };
  const { id } = await params;
  const result = await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, sessionUser.id)))
    .returning({ id: projects.id });

  if (result.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
