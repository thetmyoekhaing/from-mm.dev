import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
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

export async function POST(req: NextRequest) {
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
  const data = parsed.data;
  const project = {
    id: randomUUID(),
    userId: sessionUser.id,
    title: data.title,
    description: data.description,
    techStack: [...new Set(data.techStack.map((item) => item.trim()).filter(Boolean))],
    repoUrl: data.repoUrl || null,
    liveUrl: data.liveUrl || null,
    featured: data.featured,
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(projects).values(project);

  return NextResponse.json({ project });
}
