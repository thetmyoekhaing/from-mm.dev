import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const urlField = z.string().trim().url().optional().or(z.literal(""));

const profileSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(160).optional().or(z.literal("")),
  skillTags: z.array(z.string().trim().min(1).max(32)).max(16).default([]),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  workPreference: z
    .enum(["remote", "hybrid", "onsite"])
    .optional()
    .or(z.literal("")),
  employmentPreference: z
    .enum(["full-time", "part-time", "contract", "freelance"])
    .optional()
    .or(z.literal("")),
  portfolioUrl: urlField,
  linkedinUrl: urlField,
  availableForWork: z.boolean().default(false),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = session.user as typeof session.user & { id: string };
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data = parsed.data;
  const skillTags = [...new Set(data.skillTags.map((item) => item.trim()).filter(Boolean))];

  await db
    .update(users)
    .set({
      name: data.name || null,
      bio: data.bio || null,
      skillTags,
      location: data.location || null,
      workPreference: data.workPreference || null,
      employmentPreference: data.employmentPreference || null,
      portfolioUrl: data.portfolioUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      availableForWork: data.availableForWork,
      updatedAt: new Date(),
    })
    .where(eq(users.id, sessionUser.id));

  return NextResponse.json({ success: true });
}
