CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."obligation_status" AS ENUM('active', 'expired', 'completed', 'paused');--> statement-breakpoint
CREATE TYPE "public"."renewal_frequency" AS ENUM('once', 'monthly', 'quarterly', 'annually', 'custom');--> statement-breakpoint
CREATE TYPE "public"."recipient_type" AS ENUM('owner', 'backup_owner', 'all_members', 'custom_email');--> statement-breakpoint
CREATE TYPE "public"."reminder_channel" AS ENUM('email', 'in_app');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('sent', 'failed', 'pending');--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "obligations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"status" "obligation_status" DEFAULT 'active' NOT NULL,
	"due_date" date NOT NULL,
	"renewal_frequency" "renewal_frequency",
	"custom_frequency_days" integer,
	"owner_clerk_id" text,
	"owner_name" text,
	"owner_email" text,
	"backup_owner_clerk_id" text,
	"backup_owner_name" text,
	"backup_owner_email" text,
	"notes" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminder_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"obligation_id" integer NOT NULL,
	"days_before" integer NOT NULL,
	"channel" "reminder_channel" DEFAULT 'email' NOT NULL,
	"recipient_type" "recipient_type" DEFAULT 'owner' NOT NULL,
	"custom_email" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_triggered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"obligation_id" integer NOT NULL,
	"rule_id" integer,
	"channel" text NOT NULL,
	"recipient_email" text NOT NULL,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer,
	"obligation_id" integer,
	"obligation_title" text,
	"actor_clerk_id" text,
	"actor_name" text,
	"action" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"request_method" varchar(10) NOT NULL,
	"request_path" text NOT NULL,
	"response_status" integer,
	"response_body" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminder_rules" ADD CONSTRAINT "reminder_rules_obligation_id_obligations_id_fk" FOREIGN KEY ("obligation_id") REFERENCES "public"."obligations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_history" ADD CONSTRAINT "delivery_history_obligation_id_obligations_id_fk" FOREIGN KEY ("obligation_id") REFERENCES "public"."obligations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_obligation_id_obligations_id_fk" FOREIGN KEY ("obligation_id") REFERENCES "public"."obligations"("id") ON DELETE set null ON UPDATE no action;