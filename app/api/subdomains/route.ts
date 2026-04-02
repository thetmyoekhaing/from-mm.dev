import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { z } from "zod";
import { createCnameRecord, createTxtRecord } from "@/lib/cloudflare";
import {
  validateSubdomain,
  buildTarget,
  SUBDOMAIN_MAX_PER_USER,
  BASE_DOMAIN,
} from "@/lib/subdomain";
import { randomUUID } from "crypto";

const schema = z.object({
  subdomain: z.string(),
  type: z.enum(["github_pages", "vercel", "netlify"]),
  customTarget: z.string().optional(),
  vercelTxtValue: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const check = req.nextUrl.searchParams.get("check");
  if (!check) return NextResponse.json({ available: false });

  const validation = validateSubdomain(check);
  if (!validation.valid)
    return NextResponse.json({ available: false, error: validation.error });

  const existing = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.subdomain, check))
    .limit(1);

  return NextResponse.json({ available: existing.length === 0 });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { subdomain, type, customTarget, vercelTxtValue } = parsed.data;
    const validation = validateSubdomain(subdomain);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const normalizedTxtValue =
      type === "vercel" || type === "netlify"
        ? vercelTxtValue?.trim() || null
        : null;

    const sessionUser = session.user as typeof session.user & {
      id: string;
      githubUsername: string;
    };
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);
    if (!dbUser[0])
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [{ value: userSubdomainCount }] = await db
      .select({ value: count() })
      .from(subdomains)
      .where(eq(subdomains.userId, dbUser[0].id));

    if (Number(userSubdomainCount) >= SUBDOMAIN_MAX_PER_USER) {
      return NextResponse.json(
        { error: `You can only have ${SUBDOMAIN_MAX_PER_USER} subdomains.` },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(subdomains)
      .where(eq(subdomains.subdomain, subdomain))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Subdomain already taken." },
        { status: 409 },
      );
    }

    const target = buildTarget(type, dbUser[0].githubUsername, customTarget);
    const cfRecordId = await createCnameRecord(subdomain, target);

    let cfTxtRecordId: string | null = null;
    if (normalizedTxtValue) {
      const txtName =
        type === "vercel" ? "_vercel" : "subdomain-owner-verification";
      cfTxtRecordId = await createTxtRecord(txtName, normalizedTxtValue);
    }

    const newId = randomUUID();
    await db.insert(subdomains).values({
      id: newId,
      subdomain,
      userId: dbUser[0].id,
      type,
      target,
      cfRecordId,
      cfTxtRecordId,
      vercelTxtValue: normalizedTxtValue,
      status: "active",
    });

    return NextResponse.json({
      id: newId,
      subdomain,
      url: `https://${subdomain}.${BASE_DOMAIN}`,
      type,
      target,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
