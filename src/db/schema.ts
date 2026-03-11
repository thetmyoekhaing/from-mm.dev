import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const subdomainTypeEnum = pgEnum("subdomain_type", [
  "github_pages",
  "vercel",
  "netlify",
]);
export const subdomainStatusEnum = pgEnum("subdomain_status", [
  "active",
  "suspended",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  githubId: text("github_id").notNull().unique(),
  githubUsername: text("github_username").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subdomains = pgTable("subdomains", {
  id: text("id").primaryKey(),
  subdomain: varchar("subdomain", { length: 63 }).notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: subdomainTypeEnum("type").notNull(),
  target: text("target").notNull(),
  cfRecordId: text("cf_record_id"),
  cfTxtRecordId: text("cf_txt_record_id"),
  vercelTxtValue: text("vercel_txt_value"),
  netlifyTxtName: text("netlify_txt_name"),
  netlifyTxtValue: text("netlify_txt_value"),
  status: subdomainStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abuseReports = pgTable("abuse_reports", {
  id: text("id").primaryKey(),
  subdomainId: text("subdomain_id")
    .notNull()
    .references(() => subdomains.id, { onDelete: "cascade" }),
  reporterEmail: text("reporter_email"),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subdomain = typeof subdomains.$inferSelect;
export type NewSubdomain = typeof subdomains.$inferInsert;
export type AbuseReport = typeof abuseReports.$inferSelect;
export type NewAbuseReport = typeof abuseReports.$inferInsert;
