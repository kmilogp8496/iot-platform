ALTER TABLE "notificationConfigurations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notificationConfigurations" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notificationConfigurations" ADD COLUMN "name" text NOT NULL;