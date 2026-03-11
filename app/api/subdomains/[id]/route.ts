import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteDnsRecord, updateCnameRecord, updateTxtRecord, createTxtRecord } from "@/lib/cloudflare";
import { z } from "zod";

const patchSchema = z.object({
  vercelTarget: z.string().min(1).optional(),
  vercelTxtValue: z.string().min(1).optional(),
  netlifyTarget: z.string().min(1).optional(),
  netlifyTxtName: z.string().min(1).optional(),
  netlifyTxtValue: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sessionUser = session.user as typeof session.user & { id: string };

  const record = await db
    .select()
    .from(subdomains)
    .where(and(eq(subdomains.id, id), eq(subdomains.userId, sessionUser.id)))
    .limit(1);

  if (!record[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (record[0].type === "github_pages") {
    return NextResponse.json({ error: "GitHub Pages subdomains cannot be updated." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { vercelTarget, vercelTxtValue, netlifyTarget, netlifyTxtName, netlifyTxtValue } = parsed.data;
  const updates: Partial<typeof record[0]> = {};

  if (record[0].type === "vercel") {
    if (vercelTarget && record[0].cfRecordId) {
      await updateCnameRecord(record[0].cfRecordId, record[0].subdomain, vercelTarget);
      updates.target = vercelTarget;
    }

    if (vercelTxtValue) {
      const trimmed = vercelTxtValue.trim();
      if (record[0].cfTxtRecordId) {
        await updateTxtRecord(record[0].cfTxtRecordId, "_vercel", trimmed);
      } else {
        const newTxtId = await createTxtRecord("_vercel", trimmed);
        updates.cfTxtRecordId = newTxtId;
      }
      updates.vercelTxtValue = trimmed;
    }
  }

  if (record[0].type === "netlify") {
    if (netlifyTarget && record[0].cfRecordId) {
      await updateCnameRecord(record[0].cfRecordId, record[0].subdomain, netlifyTarget);
      updates.target = netlifyTarget;
    }

    const desiredTxtName = (netlifyTxtName?.trim() || record[0].netlifyTxtName?.trim() || "subdomain-owner-verification").trim();
    const desiredTxtValue = netlifyTxtValue?.trim();

    if (netlifyTxtName || netlifyTxtValue) {
      if (record[0].cfTxtRecordId) {
        const nextValue = desiredTxtValue ?? record[0].netlifyTxtValue ?? "";
        if (!nextValue) {
          return NextResponse.json({ error: "TXT value is required." }, { status: 400 });
        }
        await updateTxtRecord(record[0].cfTxtRecordId, desiredTxtName, nextValue);
      } else {
        if (!desiredTxtValue) {
          return NextResponse.json({ error: "TXT value is required." }, { status: 400 });
        }
        const newTxtId = await createTxtRecord(desiredTxtName, desiredTxtValue);
        updates.cfTxtRecordId = newTxtId;
      }
      updates.netlifyTxtName = desiredTxtName;
      if (desiredTxtValue) updates.netlifyTxtValue = desiredTxtValue;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await db.update(subdomains).set(updates).where(eq(subdomains.id, id));

  return NextResponse.json({ success: true, ...updates });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sessionUser = session.user as typeof session.user & { id: string };

  const record = await db
    .select()
    .from(subdomains)
    .where(and(eq(subdomains.id, id), eq(subdomains.userId, sessionUser.id)))
    .limit(1);

  if (!record[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (record[0].cfRecordId) {
    await deleteDnsRecord(record[0].cfRecordId);
  }
  if (record[0].cfTxtRecordId) {
    await deleteDnsRecord(record[0].cfTxtRecordId);
  }

  await db.delete(subdomains).where(eq(subdomains.id, id));

  return NextResponse.json({ success: true });
}
