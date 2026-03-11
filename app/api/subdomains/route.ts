import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { z } from "zod";
import { createCnameRecord, createTxtRecord } from "@/lib/cloudflare";
import { validateSubdomain, buildTarget, SUBDOMAIN_MAX_PER_USER, BASE_DOMAIN } from "@/lib/subdomain";
import { randomUUID } from "crypto";

const schema = z.object({
  subdomain: z.string(),
  type: z.enum(["github_pages", "vercel", "netlify"]),
  vercelTarget: z.string().optional(),
  vercelTxtValue: z.string().optional(),
  netlifyTarget: z.string().optional(),
  netlifyTxtName: z.string().optional(),
  netlifyTxtValue: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const check = req.nextUrl.searchParams.get("check");
  if (!check) return NextResponse.json({ available: false });

  const validation = validateSubdomain(check);
  if (!validation.valid) return NextResponse.json({ available: false, error: validation.error });

  const existing = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.subdomain, check))
    .limit(1);

  return NextResponse.json({ available: existing.length === 0 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { subdomain, type, vercelTarget, vercelTxtValue, netlifyTarget, netlifyTxtName, netlifyTxtValue } =
    parsed.data;
  const validation = validateSubdomain(subdomain);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sessionUser = session.user as typeof session.user & { id: string; githubUsername: string };
  const dbUser = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);
  if (!dbUser[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [{ value: userSubdomainCount }] = await db
    .select({ value: count() })
    .from(subdomains)
    .where(eq(subdomains.userId, dbUser[0].id));

  if (Number(userSubdomainCount) >= SUBDOMAIN_MAX_PER_USER) {
    return NextResponse.json(
      { error: `You can only have ${SUBDOMAIN_MAX_PER_USER} subdomains.` },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.subdomain, subdomain))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Subdomain already taken." }, { status: 409 });
  }

  if (type === "vercel" && !vercelTarget) {
    return NextResponse.json({ error: "Vercel CNAME value is required." }, { status: 400 });
  }
  if (type === "netlify" && !netlifyTarget) {
    return NextResponse.json({ error: "Netlify CNAME value is required." }, { status: 400 });
  }

  const explicitTarget = type === "vercel" ? vercelTarget : type === "netlify" ? netlifyTarget : undefined;
  const target = buildTarget(type, dbUser[0].githubUsername, explicitTarget);
  const cfRecordId = await createCnameRecord(subdomain, target);

  let cfTxtRecordId: string | null = null;
  const vercelTxt = type === "vercel" && vercelTxtValue ? vercelTxtValue.trim() : null;
  let netlifyTxt: string | null = null;
  let netlifyTxtRecordName: string | null = null;

  if (vercelTxt) {
    cfTxtRecordId = await createTxtRecord("_vercel", vercelTxt);
  } else if (type === "netlify" && netlifyTxtValue) {
    netlifyTxt = netlifyTxtValue.trim();
    netlifyTxtRecordName = (netlifyTxtName?.trim() || "subdomain-owner-verification").trim();
    cfTxtRecordId = await createTxtRecord(netlifyTxtRecordName, netlifyTxt);
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
    vercelTxtValue: vercelTxt,
    netlifyTxtName: netlifyTxtRecordName,
    netlifyTxtValue: netlifyTxt,
    status: "active",
  });

  return NextResponse.json({
    id: newId,
    subdomain,
    url: `https://${subdomain}.${BASE_DOMAIN}`,
    type,
    target,
  });
}
