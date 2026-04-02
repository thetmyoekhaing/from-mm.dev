CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"tech_stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"repo_url" text,
	"live_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" varchar(160);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "skill_tags" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(80);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "work_preference" varchar(32);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employment_preference" varchar(32);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "portfolio_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "available_for_work" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;