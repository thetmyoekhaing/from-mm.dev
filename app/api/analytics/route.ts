import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { projects, users } from "@/db/schema";

const analyticsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("profile_view"),
    githubUsername: z.string().min(1),
  }),
  z.object({
    type: z.literal("waiting_room_view"),
    githubUsername: z.string().min(1),
  }),
  z.object({
    type: z.literal("waiting_room_click"),
    githubUsername: z.string().min(1),
  }),
  z.object({
    type: z.literal("portfolio_click"),
    githubUsername: z.string().min(1),
  }),
  z.object({
    type: z.literal("project_click"),
    projectId: z.string().min(1),
  }),
]);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = analyticsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data = parsed.data;

  if (data.type === "project_click") {
    await db
      .update(projects)
      .set({ clickCount: sql`${projects.clickCount} + 1` })
      .where(eq(projects.id, data.projectId));

    return NextResponse.json({ success: true });
  }

  if (data.type === "profile_view") {
    await db
      .update(users)
      .set({ profileViews: sql`${users.profileViews} + 1` })
      .where(eq(users.githubUsername, data.githubUsername));
  } else if (data.type === "waiting_room_view") {
    await db
      .update(users)
      .set({ waitingRoomViews: sql`${users.waitingRoomViews} + 1` })
      .where(eq(users.githubUsername, data.githubUsername));
  } else if (data.type === "waiting_room_click") {
    await db
      .update(users)
      .set({ waitingRoomClicks: sql`${users.waitingRoomClicks} + 1` })
      .where(eq(users.githubUsername, data.githubUsername));
  } else {
    await db
      .update(users)
      .set({ portfolioClicks: sql`${users.portfolioClicks} + 1` })
      .where(eq(users.githubUsername, data.githubUsername));
  }

  return NextResponse.json({ success: true });
}
