import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const subdomainTypeEnum = pgEnum("subdomain_type", [
  "github_pages",
  "vercel",
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
  bio: varchar("bio", { length: 160 }),
  skillTags: text("skill_tags").array().notNull().default(sql`'{}'::text[]`),
  location: varchar("location", { length: 80 }),
  workPreference: varchar("work_preference", { length: 32 }),
  employmentPreference: varchar("employment_preference", { length: 32 }),
  portfolioUrl: text("portfolio_url"),
  linkedinUrl: text("linkedin_url"),
  availableForWork: boolean("available_for_work").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull().default(sql`'{}'::text[]`),
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subdomain = typeof subdomains.$inferSelect;
export type NewSubdomain = typeof subdomains.$inferInsert;
export type AbuseReport = typeof abuseReports.$inferSelect;
export type NewAbuseReport = typeof abuseReports.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
