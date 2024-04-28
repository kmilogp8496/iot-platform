DO $$ BEGIN
 CREATE TYPE "notification_level" AS ENUM('info', 'warning', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "notification_type" AS ENUM('slack', 'discord', 'http');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "level" "notification_level" NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" "notification_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "url" text NOT NULL;