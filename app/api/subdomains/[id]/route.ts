import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteDnsRecord, updateCnameRecord, updateTxtRecord, createTxtRecord } from "@/lib/cloudflare";
import { z } from "zod";

const patchSchema = z.object({
  customTarget: z.string().min(1).optional(),
  vercelTxtValue: z.string().min(1).optional(),
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
    return NextResponse.json({ error: "GitHub Pages subdomains cannot be updated here." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { customTarget, vercelTxtValue } = parsed.data;
  const updates: Partial<typeof record[0]> = {};

  if (customTarget && record[0].cfRecordId) {
    await updateCnameRecord(record[0].cfRecordId, record[0].subdomain, customTarget);
    updates.target = customTarget;
  }

  if ((record[0].type === "vercel" || record[0].type === "netlify") && vercelTxtValue) {
    const txtName = record[0].type === "vercel" ? "_vercel" : "subdomain-owner-verification";
    const txtValue = vercelTxtValue.trim();
    if (record[0].cfTxtRecordId) {
      await updateTxtRecord(record[0].cfTxtRecordId, txtName, txtValue);
    } else {
      const newTxtId = await createTxtRecord(txtName, txtValue);
      updates.cfTxtRecordId = newTxtId;
    }
    updates.vercelTxtValue = txtValue;
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
